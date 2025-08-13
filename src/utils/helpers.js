import { Box, Typography } from "@mui/material";
import { deleteCookie } from 'cookies-next';

export const BASE_URL = process.env.REACT_APP_BASE_URL;

export const increamentMonths = [
    { value: 1, label: 'January' },
    { value: 7, label: 'July' },
]; 

export const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
]; 

export const salaryMonths = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
]; 

export const dateFormat = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // JS months are 0-based
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
}

export function customRound(value) {
  const intPart = Math.floor(value);
  const decimal = value - intPart;
  return decimal >= 0.5 ? Math.ceil(value) : Math.floor(value);
}

export const getMonthName = (monthNumber) => {
    if (!monthNumber) return "N/A";
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    // If monthNumber is already a string, parse it to int
    const index = parseInt(monthNumber, 10) - 1;
    return monthNames[index] || "N/A";
  };

// Authentication error handling utilities (without store dependency)
export const handleAuthError = (error, customMessage = null) => {
  const isAuthError = error.response?.status === 401 || 
                     error.response?.status === 403 ||
                     error.response?.data?.message?.toLowerCase().includes('unauthenticated') ||
                     error.response?.data?.error?.toLowerCase().includes('unauthenticated') ||
                     error.response?.data?.errorMsg?.toLowerCase().includes('unauthenticated');

  if (isAuthError) {
    // Clear all authentication data
    deleteCookie('token');
    deleteCookie('user');
    deleteCookie('session_id');
    deleteCookie('login_timestamp');
    deleteCookie('last_activity');

    // Return true to indicate auth error was detected
    // The calling component should handle the Redux dispatch
    return true;
  }

  return false; // No auth error
};

// Check if token is expired (24 hours)
export const isTokenExpired = () => {
  const loginTimestamp = localStorage.getItem('login_timestamp') || 
                        document.cookie.match(/login_timestamp=([^;]+)/)?.[1];
  
  if (!loginTimestamp) return true;

  const timeSinceLogin = Date.now() - parseInt(loginTimestamp);
  const TOKEN_EXPIRATION_MILLISECONDS = 24 * 60 * 60 * 1000; // 24 hours

  return timeSinceLogin > TOKEN_EXPIRATION_MILLISECONDS;
};

// Clear all session data (without Redux dispatch)
export const clearSessionData = () => {
  deleteCookie('token');
  deleteCookie('user');
  deleteCookie('session_id');
  deleteCookie('login_timestamp');
  deleteCookie('last_activity');
};

// Force logout user (without Redux dispatch)
export const forceLogout = (reason = "Session expired") => {
  clearSessionData();
  
  // Redirect to login page
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};


export const InfoRow = ({ label, value }) => (
    <Box display="flex" mb={1}>
        <Typography variant="body2" className='text-capitalize' fontWeight="600" width="130px" color="text.secondary">
            {label}:
        </Typography>
        <Typography variant="body2" className='text-capitalize'>{value || 'N/A'}</Typography>
    </Box>
);
