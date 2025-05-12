import React, { useState } from 'react';
import '../assets/css/custom.css';
import { useNavigate, Link } from 'react-router-dom';
import logoNioh from '../assets/img/images/nioh_logo_white.png';
import logoRohc from '../assets/img/images/rohc-logo.jpg';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/slices/authSlice'
import { fetchCurrentUser } from '../redux/slices/authSlice';
import CustomSnackbar from 'components/include/CustomSnackbar';


const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(state => state.auth);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success', 
  });

  const initialValues = {
    username: '',
    password: '',
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .required('Username is required'),
    password: Yup.string()
      .required('Password is required')
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await dispatch(loginUser(values)).unwrap();

      if (response && response.token) {

        setSnackbar({
          open: true,
          message: 'Login successful!',
          severity: 'success',
        });

        const {data} = await dispatch(fetchCurrentUser()).unwrap(); 
        const role = data.role.name.toLowerCase();
        
        setTimeout(() => {
          navigate(`/${role}/index`);
        }, 100);

        console.log('Login successful');
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Login failed! Please try again.',
        severity: 'error',
      });

      console.log("Login failed! Please try again.")
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className='login-main'>
      <div className="login-page">
        <div className="custom-container d-flex" style={{ padding: '0px', width:'70vw', boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)' , overflow: 'hidden',borderRadius:'20px'}}>
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
                  {/* <div className="logo">
                    <img src={logoNioh} alt="NIOH Logo" />
                  </div> */}
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
                      Employee ID
                    </label>
                    <div className="relative">
                      <Field
                        name="username"
                        type="text"
                        placeholder="Enter your employee ID"
                        style={{width:'100%'}}
                        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {/* <span className="absolute left-3 top-2.5 text-gray-500 input-icon">👤</span> */}
                    </div>
                    <ErrorMessage name="username" component="p" className="text-red-600 text-sm mt-1" />
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
                        placeholder="Enter your password"
                        style={{width:'100%'}}
                        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {/* <span className="absolute left-3 top-2.5 text-gray-500 input-icon">🔒</span> */}
                    </div>
                    <ErrorMessage name="password" component="p" className="text-red-600 text-sm mt-1" />
                  </div>

                  {/* Forgot Password */}
                  <div className="text-right forgot-password mt-4">
                    <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
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
                  <p className="text-center text-sm text-gray-600 help-text">
                    Having trouble logging in?{' '}
                    <Link href="/contact-support" className="text-blue-600 hover:underline">
                      Contact Support
                    </Link>
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

export default Login;
