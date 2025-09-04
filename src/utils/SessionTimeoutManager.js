import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import { clearAuth } from '../redux/slices/authSlice'; // Your logout action

// --- CONFIGURATION ---

// The total duration of a session is exactly 24 hours.
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

// How often we check if the session is still valid (e.g., every minute).
const SESSION_CHECK_INTERVAL_MS = 60 * 1000;

// Keys for cookies used to track the session in this browser.
const SESSION_ID_COOKIE = 'app_session_id';
const LOGIN_TIMESTAMP_COOKIE = 'app_login_timestamp';

/**
 * Manages user session lifecycle based on two rules:
 * 1. A session has a hard expiration of 24 hours.
 * 2. A user can only have one active session. A new login on another
 *    browser/device will invalidate the previous session.
 *
 * --- REQUIRED SETUP ---
 * This component requires your Redux store and backend to work together:
 *
 * 1.  **Backend Login API:**
 *     - When a user logs in, your server MUST generate a new, unique session ID.
 *     - This new session ID must be returned in the login API response.
 *
 * 2.  **Redux `authSlice`:**
 *     - Your Redux `auth` state MUST store this `sessionId`.
 *     - The selector `state.auth.sessionId` should provide this value.
 */
const SessionTimeoutManager = ({ children }) => {
  const dispatch = useDispatch();
  const checkIntervalId = useRef(null);

  // Get the latest session information from the Redux store.
  // `canonicalSessionId` is the "true" session ID from the most recent login.
  const { isLoggedIn, canonicalSessionId } = useSelector((state) => ({
    isLoggedIn: state.auth.isLoggedIn,
    sessionId: state.auth.sessionId, 
  }));

  // Reusable function to terminate the session, clear data, and notify the user.
  const endSession = (message) => {
    // Check if a session cookie exists to prevent running multiple times.
    if (!getCookie(SESSION_ID_COOKIE)) return;
    
    console.warn(`Session ended: ${message}`);
    toast.error(message, { toastId: 'session-expired-toast' });

    // Clean up cookies and dispatch the logout action.
    deleteCookie(SESSION_ID_COOKIE);
    deleteCookie(LOGIN_TIMESTAMP_COOKIE);
    dispatch(clearAuth());
  };

  useEffect(() => {
    // If the user isn't logged in, we stop any running checks and do nothing.
    if (!isLoggedIn || !canonicalSessionId) {
      clearInterval(checkIntervalId.current);
      return;
    }

    // Get the session ID currently stored in this browser's cookies.
    const localSessionId = getCookie(SESSION_ID_COOKIE);

    // If the Redux session ID is different from the cookie's, it's a new login.
    // We must update the cookies with the new session details.
    if (localSessionId !== canonicalSessionId) {
      const now = Date.now();
      const cookieOptions = {
        path: '/',
        maxAge: SESSION_DURATION_MS / 1000, // 24 hours in seconds
        sameSite: 'strict',
        // secure: true, // Recommended for production environments
      };
      
      setCookie(LOGIN_TIMESTAMP_COOKIE, now.toString(), cookieOptions);
      setCookie(SESSION_ID_COOKIE, canonicalSessionId, cookieOptions);
    }

    // Periodically check the validity of the current session.
    checkIntervalId.current = setInterval(() => {
      const loginTimestamp = parseInt(getCookie(LOGIN_TIMESTAMP_COOKIE) || '0', 10);
      const currentLocalSessionId = getCookie(SESSION_ID_COOKIE);

      // Failsafe: if cookies are missing, end the session.
      if (!loginTimestamp || !currentLocalSessionId) {
        endSession('Session data is invalid. Please log in again.');
        return;
      }

      // CHECK 1: Has the 24-hour hard limit been reached?
      if (Date.now() - loginTimestamp > SESSION_DURATION_MS) {
        endSession('Session expired after 24 hours. Please log in again.');
        return;
      }

      // CHECK 2: Has a new login occurred elsewhere?
      // We compare this browser's cookie with the "true" ID from Redux.
      // If they don't match, this session is old and must be terminated.
      if (canonicalSessionId && currentLocalSessionId !== canonicalSessionId) {
        endSession('Logged out because you signed in on another browser or device.');
        return;
      }
    }, SESSION_CHECK_INTERVAL_MS);

    // Cleanup function: This runs when the component unmounts or dependencies change.
    // It's crucial for preventing memory leaks.
    return () => {
      clearInterval(checkIntervalId.current);
    };
  }, [isLoggedIn, canonicalSessionId, dispatch]);

  return children;
};

export default SessionTimeoutManager;