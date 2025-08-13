import { useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout, clearAuth } from '../redux/slices/authSlice'; 
import { toast } from 'react-toastify';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

// Session timeout configuration
const TIMEOUT_IN_MINUTES = 30; // Reduced from 1440 (24 hours) to 30 minutes for security
const TIMEOUT_IN_MILLISECONDS = TIMEOUT_IN_MINUTES * 60 * 1000;
const WARNING_TIME = 5 * 60 * 1000; // Show warning 5 minutes before timeout

// 24-hour token expiration
const TOKEN_EXPIRATION_HOURS = 24;
const TOKEN_EXPIRATION_MILLISECONDS = TOKEN_EXPIRATION_HOURS * 60 * 60 * 1000;

// Session tracking
const SESSION_ID_KEY = 'session_id';
const LAST_ACTIVITY_KEY = 'last_activity';
const LOGIN_TIMESTAMP_KEY = 'login_timestamp';

const SessionTimeoutManager = ({ children }) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  const timeoutIdRef = useRef(null);
  const warningIdRef = useRef(null);
  const activityCheckIdRef = useRef(null);
  const tokenExpirationIdRef = useRef(null);

  // Generate unique session ID
  const generateSessionId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Check if this is a new login (prevent multiple sessions)
  const checkForExistingSession = useCallback(() => {
    const existingSessionId = getCookie(SESSION_ID_KEY);
    const loginTimestamp = getCookie(LOGIN_TIMESTAMP_KEY);
    
    if (existingSessionId && loginTimestamp) {
      const timeSinceLogin = Date.now() - parseInt(loginTimestamp);
      // If session is older than 1 hour, consider it stale
      if (timeSinceLogin > 60 * 60 * 1000) {
        deleteCookie(SESSION_ID_KEY);
        deleteCookie(LOGIN_TIMESTAMP_KEY);
        deleteCookie(LAST_ACTIVITY_KEY);
        return false;
      }
      return true;
    }
    return false;
  }, []);

  // Initialize session on login
  const initializeSession = useCallback(() => {
    if (isLoggedIn && user) {
      const sessionId = generateSessionId();
      const timestamp = Date.now();
      
      setCookie(SESSION_ID_KEY, sessionId, { 
        path: '/', 
        maxAge: 60 * 60 * 24, // 24 hours
        secure: true,
        sameSite: 'strict'
      });
      setCookie(LOGIN_TIMESTAMP_KEY, timestamp.toString(), { 
        path: '/', 
        maxAge: 60 * 60 * 24,
        secure: true,
        sameSite: 'strict'
      });
      setCookie(LAST_ACTIVITY_KEY, timestamp.toString(), { 
        path: '/', 
        maxAge: 60 * 60 * 24,
        secure: true,
        sameSite: 'strict'
      });
    }
  }, [isLoggedIn, user]);

  // Update last activity timestamp
  const updateLastActivity = useCallback(() => {
    if (isLoggedIn) {
      const timestamp = Date.now();
      setCookie(LAST_ACTIVITY_KEY, timestamp.toString(), { 
        path: '/', 
        maxAge: 60 * 60 * 24,
        secure: true,
        sameSite: 'strict'
      });
    }
  }, [isLoggedIn]);

  // Check session validity
  const validateSession = useCallback(() => {
    if (!isLoggedIn) return;

    const lastActivity = getCookie(LAST_ACTIVITY_KEY);
    const sessionId = getCookie(SESSION_ID_KEY);
    const loginTimestamp = getCookie(LOGIN_TIMESTAMP_KEY);
    
    if (!lastActivity || !sessionId || !loginTimestamp) {
      dispatch(clearAuth());
      toast.error("Session expired. Please login again.");
      return false;
    }

    const timeSinceLastActivity = Date.now() - parseInt(lastActivity);
    const timeSinceLogin = Date.now() - parseInt(loginTimestamp);
    
    // Check if session has been inactive for too long
    if (timeSinceLastActivity > TIMEOUT_IN_MILLISECONDS) {
      dispatch(clearAuth());
      toast.error("Session expired due to inactivity. Please login again.");
      return false;
    }

    // Check if token has expired (24 hours)
    if (timeSinceLogin > TOKEN_EXPIRATION_MILLISECONDS) {
      dispatch(clearAuth());
      toast.error("Session expired after 24 hours. Please login again.");
      return false;
    }

    return true;
  }, [isLoggedIn, dispatch]);

  // Periodic session validation
  const startSessionValidation = useCallback(() => {
    if (isLoggedIn) {
      // Check session every 5 minutes
      activityCheckIdRef.current = setInterval(() => {
        if (!validateSession()) {
          clearInterval(activityCheckIdRef.current);
        }
      }, 5 * 60 * 1000);
    }
  }, [isLoggedIn, validateSession]);

  // Set up 24-hour token expiration
  const setupTokenExpiration = useCallback(() => {
    if (isLoggedIn) {
      const loginTimestamp = getCookie(LOGIN_TIMESTAMP_KEY);
      if (loginTimestamp) {
        const timeSinceLogin = Date.now() - parseInt(loginTimestamp);
        const timeUntilExpiration = Math.max(0, TOKEN_EXPIRATION_MILLISECONDS - timeSinceLogin);
        
        tokenExpirationIdRef.current = setTimeout(() => {
          dispatch(clearAuth());
          toast.error("Session expired after 24 hours. Please login again.");
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }, timeUntilExpiration);
      }
    }
  }, [isLoggedIn, dispatch]);

  const logoutUser = useCallback(() => {
    if (isLoggedIn) {
      // Clear all session data
      deleteCookie(SESSION_ID_KEY);
      deleteCookie(LOGIN_TIMESTAMP_KEY);
      deleteCookie(LAST_ACTIVITY_KEY);
      
      dispatch(clearAuth());
      toast.info("You have been logged out due to inactivity.");
    }
  }, [dispatch, isLoggedIn]);

  const showWarning = useCallback(() => {
    toast.warning("Your session will expire in 5 minutes. Please save your work.", {
      autoClose: false,
      closeOnClick: false,
      draggable: false
    });
  }, []);

  const resetTimer = useCallback(() => {
    // Clear existing timers
    clearTimeout(timeoutIdRef.current);
    clearTimeout(warningIdRef.current);
    
    if (isLoggedIn) {
      updateLastActivity();
      
      // Set warning timer
      warningIdRef.current = setTimeout(showWarning, TIMEOUT_IN_MILLISECONDS - WARNING_TIME);
      
      // Set logout timer
      timeoutIdRef.current = setTimeout(logoutUser, TIMEOUT_IN_MILLISECONDS);
    }
  }, [isLoggedIn, logoutUser, showWarning, updateLastActivity]);

  // Handle user activity
  const handleUserActivity = useCallback(() => {
    if (isLoggedIn) {
      resetTimer();
    }
  }, [isLoggedIn, resetTimer]);

  useEffect(() => {
    if (isLoggedIn) {
      // Check for existing session on login
      if (checkForExistingSession()) {
        // If session exists, validate it
        if (!validateSession()) {
          return;
        }
      } else {
        // Initialize new session
        initializeSession();
      }
      
      // Start session validation
      startSessionValidation();
      
      // Set up 24-hour token expiration
      setupTokenExpiration();
      
      // Set up activity listeners
      const events = ['mousemove', 'click', 'keydown', 'scroll', 'touchstart'];
      events.forEach(event => window.addEventListener(event, handleUserActivity, { passive: true }));
      
      // Initial timer setup
      resetTimer();
    } else {
      // Clear all timers and session data when logged out
      clearTimeout(timeoutIdRef.current);
      clearTimeout(warningIdRef.current);
      clearInterval(activityCheckIdRef.current);
      clearTimeout(tokenExpirationIdRef.current);
      
      deleteCookie(SESSION_ID_KEY);
      deleteCookie(LOGIN_TIMESTAMP_KEY);
      deleteCookie(LAST_ACTIVITY_KEY);
    }

    return () => {
      clearTimeout(timeoutIdRef.current);
      clearTimeout(warningIdRef.current);
      clearInterval(activityCheckIdRef.current);
      clearTimeout(tokenExpirationIdRef.current);
      
      const events = ['mousemove', 'click', 'keydown', 'scroll', 'touchstart'];
      events.forEach(event => window.removeEventListener(event, handleUserActivity));
    };
  }, [isLoggedIn, checkForExistingSession, validateSession, initializeSession, startSessionValidation, setupTokenExpiration, handleUserActivity, resetTimer]);

  return children;
};

export default SessionTimeoutManager;