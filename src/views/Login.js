import React, { useState, useEffect } from 'react';
import '../assets/css/custom.css';
import { useNavigate, Link } from 'react-router-dom';
import logoNioh from '../assets/img/images/nioh_logo_white.png';
import logoRohc from '../assets/img/images/rohc-logo.jpg';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/slices/authSlice'
import { fetchCurrentUser } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { Bounce, ToastContainer } from "react-toastify";


const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(state => state.auth);
  const [captcha, setCaptcha] = useState('');


  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let captchaText = '';
    for (let i = 0; i < 6; i++) {
      captchaText += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(captchaText);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const initialValues = {
    username: '',
    password: '',
    captcha: '',
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .required('Username is required'),
    password: Yup.string()
      .required('Password is required'),
    captcha: Yup.string()
      .required('CAPTCHA is required'),
  });

  const onSubmit = async (values, { setSubmitting, setFieldValue, setFieldError }) => {
    // CAPTCHA validation (case-insensitive)
    if (values.captcha.toLowerCase() !== captcha.toLowerCase()) {
      // This is the key change:
      setFieldError('captcha', 'CAPTCHA does not match. Please try again.');
      
      generateCaptcha(); // Generate a new CAPTCHA
      // setFieldValue('captcha', ''); 
      setSubmitting(false);
      return;
    }

    try {
      const loginCredentials = {
        username: values.username,
        password: values.password,
      };

      const response = await dispatch(loginUser(loginCredentials)).unwrap();

      if (response && response.token) {
        toast.success('Login Successful')
        await dispatch(fetchCurrentUser()).unwrap();
        setTimeout(() => {
          navigate(`/index`);
        }, 100);
      }
    } catch (err) {
      toast.error(err)
      generateCaptcha(); // Also refresh CAPTCHA on login failure
      setFieldValue('captcha', '');
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className='login-main'>
      <div className="login-page">
        <div className="custom-container d-flex" style={{ padding: '0px', width: '70vw', boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)', overflow: 'hidden', borderRadius: '20px' }}>
          <div className="left-panel">
            <div className="slideshow">
              <div className="slide" style={{ backgroundImage: "url('/placeholder-panel1.jpg')" }}></div>
              <div className="slide" style={{ backgroundImage: "url('/placeholder-panel2.jpg')" }}></div>
              <div className="slide" style={{ backgroundImage: "url('/placeholder-panel3.jpg')" }}></div>
            </div>

            <div className="content-wrapper">
              <div className="logos-container">
                <div className="main-logo logo">
                  <img src={logoNioh} alt="ICMR Logo" />
                </div>
                <div className="secondary-logos">
                  <div className="logo">
                    <img src={logoRohc} alt="ROHC Logo" />
                  </div>
                </div>
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

          <div className="right-panel">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6 login-form">
                  <h3 className="text-2xl font-semibold text-center text-gray-800">Employee Login</h3>

                  {/* Employee ID */}
                  <div className='mt-2 mb-2'>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                      USER ID
                    </label>
                    <div className="relative">
                      <Field
                        name="username"
                        type="text"
                        autoComplete="username"
                        placeholder="Enter your user ID"
                        style={{ width: '100%' }}
                        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {/* <span className="absolute left-3 top-2.5 text-gray-500 input-icon">👤</span> */}
                    </div>
                    <ErrorMessage name="username" component="p" className="text-red-600 text-sm mt-1" style={{color:'red'}}/>
                  </div>

                  {/* Password */}
                  <div className='mt-2 mb-2'>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Field
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        style={{ width: '100%' }}
                        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {/* <span className="absolute left-3 top-2.5 text-gray-500 input-icon">🔒</span> */}
                    </div>
                    <ErrorMessage name="password" component="p" className="text-red-600 text-sm mt-1" style={{color:'red'}}/>
                  </div>

                  <div className='mt-4 mb-2'>
                    <label htmlFor="captcha" className="block text-sm font-medium text-gray-700 mb-1">
                      Security Code
                    </label>
                    <div className="captcha-container">
                      <div className="captcha-box">
                        {captcha}
                      </div>
                      <button type="button" onClick={generateCaptcha} className="captcha-refresh-btn" title="Refresh CAPTCHA">
                        &#x21bb;
                      </button>
                    </div>
                    <Field
                      name="captcha"
                      type="text"
                      placeholder="Enter the code above"
                      style={{ width: '100%', marginTop: '8px' }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage name="captcha" component="p" className="text-red-600 text-sm mt-1" style={{color:'red'}}/>
                  </div>

                  {/* Forgot Password */}
                  <div className="text-right forgot-password mt-4">
                    <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                      Forgot Password?
                    </Link>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="login-btn w-full py-2 bg-gradient-to-r from-blue-700 to-blue-900 text-white font-semibold rounded-md hover:opacity-90"
                  >
                    {loading ? 'Logging in...' : 'Sign In'}
                  </button>

                  {/* Help Text */}
                  <p className="text-center text-sm text-gray-600 help-text mt-2">
                    Need help?{' '}
                    <a
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=NIOH.web@gmail.com&su=Forgot%20Password%20Assistance&body=Hi%20Support%2C%20I%20need%20help%20with%20resetting%20my%20password."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Contact Support
                    </a>
                  </p>

                  <p className="text-center text-sm text-gray-600 help-text mt-2">
                    Pensioner?{' '}
                    <Link to="/pensioner-slip" className="text-sm text-blue-600 hover:underline">
                      Monthly Pension
                    </Link>
                  </p>

                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
};

export default Login;
