import React from 'react';
import '../../assets/css/custom.css';
import { useDispatch } from 'react-redux';
import { setUserData } from '../../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';

import logoNioh from '../../assets/img/images/nioh_logo_white.png';
import logoRohc from '../../assets/img/images/rohc-logo.jpg';

const Login = () => {
  const [formData, setFormData] = React.useState({
    username: '',
    password: '',
    email: '',
    institute: '',
    role: 'Admin',
    status: 'Active',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setUserData(formData));
    localStorage.setItem('userData', JSON.stringify(formData));

    setTimeout(() => {
      switch (formData?.role) {
        case 'Admin':
          navigate('/admin/index');
          break;
        case 'Accounts Officer':
          navigate('/accounts/dashboard');
          break;
        case 'Coordinator(NIOH)':
          navigate('/nioh/dashboard');
          break;
        case 'Coordinator(ROHC)':
          navigate('/rohc/dashboard');
          break;
        case 'Pensioner Operator':
          navigate('/pensioner/dashboard');
          break;
        case 'End User':
          navigate('/user/dashboard');
          break;
        default:
          navigate('/login');
      }
    }, 1500);
  };

  return (
    <div className='login-main'>
    <div className="login-page">
      <div className="bg-slideshow">
        <div className="bg-slide" style={{ backgroundImage: "url('/placeholder-bg1.jpg')" }}></div>
        <div className="bg-slide" style={{ backgroundImage: "url('/placeholder-bg2.jpg')" }}></div>
        <div className="bg-slide" style={{ backgroundImage: "url('/placeholder-bg3.jpg')" }}></div>
      </div>

      <div className="custom-container d-flex" style={{ padding: '0px' }}>
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
                  <img src={logoNioh} alt="NIOH Logo" />
                </div>
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
          <form className="login-form" onSubmit={handleSubmit}>
            <h3>Employee Login</h3>

            <div className="input-group">
              <label htmlFor="employee-id">Employee ID</label>
              <input
                type="text"
                id="employee-id"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your employee ID"
                required
              />
              <div className="input-icon">👤</div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              <div className="input-icon">🔒</div>
            </div>

            <div className="forgot-password">
              <a href="/forgot-password">Forgot Password?</a>
            </div>

            <button type="submit" className="login-btn">Sign In</button>

            <div className="help-text">
              Having trouble logging in? <a href="/contact-support">Contact Support</a>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Login;
