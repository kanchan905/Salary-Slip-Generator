import React, { useState } from 'react';
import '../assets/css/custom.css';
import { useNavigate, Link } from 'react-router-dom';
import logoNioh from '../assets/img/images/nioh_logo_white.png';
import logoRohc from '../assets/img/images/rohc-logo.jpg';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { sendPasswordResetOtp, verifyOtpAndGetToken, resetPassword } from '../redux/slices/authSlice';
import CustomSnackbar from 'components/include/CustomSnackbar';

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector(state => state.auth);

    const [step, setStep] = useState(1);
    const [userEmail, setUserEmail] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // --- Schemas (Unchanged) ---
    const step1Schema = Yup.object({
        email: Yup.string().email('Invalid email format').required('Email is required'),
    });
    const step2Schema = Yup.object({
        email: Yup.string().email('Invalid email format').required('Email is required'),
        otp: Yup.string().required('OTP is required').matches(/^[0-9]+$/, "Must be only digits").length(6, 'OTP must be exactly 6 digits'),
    });
    const step3Schema = Yup.object({
        password: Yup.string().required('New password is required').min(8, 'Password must be at least 8 characters long'),
        confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm password is required'),
    });

    const getCurrentValidationSchema = () => {
        switch (step) {
            case 1: return step1Schema;
            case 2: return step2Schema;
            case 3: return step3Schema;
            default: return step1Schema;
        }
    };

    // ============================ CHANGE #1 ============================
    // Move initialValues inside the component and make it dynamic.
    // It now depends on the `userEmail` state.
    const initialValues = {
        email: userEmail || '',
        otp: '',
        password: '',
        confirmPassword: '',
    };
    // ===================================================================

    const onSubmit = async (values, { setSubmitting, resetForm }) => {
        // ... onSubmit logic remains exactly the same
        try {
            switch (step) {
                case 1: {
                    await dispatch(sendPasswordResetOtp({ email: values.email })).unwrap();
                    setUserEmail(values.email); // This will cause a re-render
                    setStep(2);
                    setSnackbar({ open: true, message: 'OTP sent successfully to your email!', severity: 'success' });
                    break;
                }
                case 2: {
                    const response = await dispatch(verifyOtpAndGetToken({ email: values.email, otp: values.otp })).unwrap();
                    if (response && response.reset_token) {
                        setResetToken(response.reset_token);
                        setStep(3);
                        setSnackbar({ open: true, message: 'OTP verified successfully!', severity: 'success' });
                    } else {
                        throw new Error('Invalid response from server. Reset token not found.');
                    }
                    break;
                }
                case 3: {

                    const payload = {
                        email: userEmail,
                        reset_token: resetToken,
                        password: values.password,
                    };
                    await dispatch(resetPassword(payload)).unwrap();
                    setSnackbar({ open: true, message: 'Password has been reset successfully! Redirecting to login...', severity: 'success' });
                    resetForm();
                    setTimeout(() => navigate('/login'), 2000);
                    break;
                }
                default:
                    throw new Error('Invalid form step');
            }
        } catch (error) {
            setSnackbar({ open: true, message: error.message || 'An unexpected error occurred. Please try again.', severity: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className='login-main'>
            <div className="login-page">
                <div className="custom-container d-flex" style={{ padding: '0px', width: '70vw', boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)', overflow: 'hidden', borderRadius: '20px' }}>
                    {/* Left Panel (Unchanged) */}
                    <div className="left-panel">
                        <div className="slideshow">
                            <div className="slide" style={{ backgroundImage: "url('/placeholder-panel1.jpg')" }}></div>
                            <div className="slide" style={{ backgroundImage: "url('/placeholder-panel2.jpg')" }}></div>
                            <div className="slide" style={{ backgroundImage: "url('/placeholder-panel3.jpg')" }}></div>
                        </div>
                        <div className="content-wrapper">
                            <div className="logos-container">
                                <div className="main-logo logo"><img src={logoNioh} alt="ICMR Logo" /></div>
                                <div className="secondary-logos"><div className="logo"><img src={logoRohc} alt="ROHC Logo" /></div></div>
                            </div>
                            <div className="header-content">
                                <h1 style={{ color: '#fff' }}>Salary Portal</h1>
                                <h2 style={{ color: '#fff' }}>ICMR-NIOH Ahmedabad & ROHC Bangalore</h2>
                                <p>Access and download your salary slips securely from anywhere, anytime.</p>
                            </div>
                            <div className="institute-info">
                                ICMR-National Institute of Occupational Health (NIOH), Ahmedabad &<br />
                                Regional Occupational Health Centre (ROHC), Bangalore
                            </div>
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className="right-panel">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={getCurrentValidationSchema()}
                            onSubmit={onSubmit}
                            enableReinitialize // This prop is crucial for the fix to work
                        >
                            {({ isSubmitting }) => ( // ============================ CHANGE #2 ============================
                                // The problematic `setFieldValue` call is now REMOVED.
                                <Form className="space-y-6 login-form">
                                    {/* Dynamic Header */}
                                    <h3 className="text-2xl font-semibold text-center text-gray-800">
                                        {step === 1 && 'Forgot Password'}
                                        {step === 2 && 'Verify Your OTP'}
                                        {step === 3 && 'Set New Password'}
                                    </h3>

                                    {/* STEP 1: EMAIL */}
                                    {step === 1 && (
                                        <>
                                            <p className="text-center text-sm text-gray-600 mt-2">Enter your email to receive a One-Time Password (OTP).</p>
                                            <div className="space-y-1 mb-4">
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                    Email Address
                                                </label>
                                                <Field
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="Enter your registered email"
                                                     style={{ width: '100%' }}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                                />
                                                <ErrorMessage
                                                    name="email"
                                                    component="p"
                                                    className="text-red-500 text-sm"
                                                    style={{color:'red'}}
                                                />
                                            </div>
                                            <button type="submit" disabled={isSubmitting || loading} className="login-btn w-full py-2 mt-4 bg-gradient-to-r from-blue-700 to-blue-900 text-white font-semibold rounded-md hover:opacity-90">
                                                {loading ? 'Sending...' : 'Send OTP'}
                                            </button>
                                        </>
                                    )}

                                    {/* STEP 2: OTP VERIFICATION */}
                                    {step === 2 && (
                                        <>
                                            <p className="text-center text-sm text-gray-600 mt-2">An OTP has been sent to <strong>{userEmail}</strong>.</p>
                                            <div className='mt-4 mb-2'>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                                {/* The value is now set automatically by Formik */}
                                                <Field name="email" type="email" disabled  style={{ width: '100%' }} className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100" />
                                                <ErrorMessage name="email" component="p" className="text-red-600 text-sm mt-1" style={{color:'red'}}/>
                                            </div>
                                            <div className='mt-2 mb-2'>
                                                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">OTP Code</label>
                                                <Field name="otp" type="text" placeholder="Enter 6-digit OTP"  style={{ width: '100%' }} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                                <ErrorMessage name="otp" component="p" className="text-red-600 text-sm mt-1" style={{color:'red'}} />
                                            </div>
                                            <button type="submit" disabled={isSubmitting || loading} className="login-btn w-full py-2 mt-4 bg-gradient-to-r from-blue-700 to-blue-900 text-white font-semibold rounded-md hover:opacity-90">
                                                {loading ? 'Verifying...' : 'Verify OTP'}
                                            </button>
                                        </>
                                    )}

                                    {/* STEP 3: RESET PASSWORD */}
                                    {step === 3 && (
                                        <>
                                            <p className="text-center text-sm text-gray-600 mt-2">Create a new, strong password for your account.</p>
                                            <div className='mt-4 mb-2'>
                                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                                <Field name="password" type="password" placeholder="Enter new password"  style={{ width: '100%' }} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                                <ErrorMessage name="password" component="p" className="text-red-600 text-sm mt-1" style={{color:'red'}} />
                                            </div>
                                            <div className='mt-2 mb-2'>
                                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                                <Field name="confirmPassword" type="password" placeholder="Confirm new password"  style={{ width: '100%' }} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                                <ErrorMessage name="confirmPassword" component="p" className="text-red-600 text-sm mt-1" style={{color:'red'}} />
                                            </div>
                                            <button type="submit" disabled={isSubmitting || loading} className="login-btn w-full py-2 mt-4 bg-gradient-to-r from-blue-700 to-blue-900 text-white font-semibold rounded-md hover:opacity-90">
                                                {loading ? 'Resetting...' : 'Reset Password'}
                                            </button>
                                        </>
                                    )}

                                    <p className="text-center text-sm text-gray-600 help-text">
                                        Remembered your password?{' '}
                                        <Link to="/login" className="text-blue-600 hover:underline">Back to Login</Link>
                                    </p>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>

            <CustomSnackbar
                open={snackbar.open}
                handleClose={() => setSnackbar({ ...snackbar, open: false })}
                message={snackbar.message}
                severity={snackbar.severity}
            />
        </div>
    );
};

export default ForgotPassword;