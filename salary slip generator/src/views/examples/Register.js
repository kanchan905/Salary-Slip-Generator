import React from 'react';
import '../../assets/css/custom.css';
import logo from '../../assets/img/images/logo.png'
import { useDispatch } from 'react-redux';
import { setUserData } from '../../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const roles = ['Admin', 'Accounts Officer', 'Coordinator(NIOH)', 'Coordinator(ROHC)', 'Pensioner Operator', 'End User'];
    const [formData, setFormData] = React.useState({
        username: '',
        password: '',
        email: '',
        institute: ' ',
        role: 'Admin',
        status: 'Active',
    });
    const dispatch = useDispatch();
    const navigate = useNavigate(); 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }; 

    const handleSubmit = (e)=>{
        e.preventDefault();
        console.log(formData); 
        // Dispatch the user data to the Redux store
        dispatch(setUserData(formData));
         // Store the user data in localStorage
        localStorage.setItem("userData", JSON.stringify(formData));
        console.log("ROLE: ", formData.role);
         // Redirect based on role
        switch (formData.role) {
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
        console.log(`Redirecting to: ${formData.role}`);
    }


    return (
        <div className="login-page">
            <div className="custom-container" style={{ padding: '0px' }}>
                <div className="left-panel">
                    <div className="content-wrapper">
                        <div className="logos-container">
                            <div className="main-logo logo">
                                <img src={logo} alt="ICMR Logo" />
                            </div>
                        </div>

                        <div className="header-content">
                            <h1 style={{ color: '#fff' }}>Salary Portal</h1>
                            <h2 style={{ color: '#fff' }}>ICMR-NIOH Ahmedabad & ROHC Bangalore</h2>
                            <p>Access and download your salary slips securely from anywhere, anytime.</p>
                        </div>

                        <div className="features">
                            <div className="feature-item">
                                <div className="feature-icon">✓</div>
                                <span>View and download monthly salary statements</span>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon">✓</div>
                                <span>Access payment history and tax details</span>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon">✓</div>
                                <span>Secure and confidential access to personal pay records</span>
                            </div>
                        </div>

                        <div className="institute-info">
                            National Institute of Occupational Health (NIOH), Ahmedabad & Regional Occupational Health Center (ROHC), Bangalore
                        </div>
                    </div>
                </div>

                <div className="right-panel">
                    <form className="login-form" onSubmit={handleSubmit}>
                        <h3>Employee Sign up</h3>

                        <div className="input-group">
                            <label htmlFor="employee-id">Employee Name</label>
                            <input
                                type="text"
                                id="employee-id"
                                placeholder="Enter your Name"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                            <div className="input-icon">👤</div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="employee-email">Employee Email</label>
                            <input
                                type="email"
                                id="employee-email"
                                placeholder="Enter your Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <div className="input-icon">✉️</div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Enter your password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <div className="input-icon">🔒</div>
                        </div>

                        <div className="input-group justify-content-between">
                            <label htmlFor="employee-role" className="fs-4">Role</label>
                            <select
                                id="employee-role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                            >
                                {roles.map((role) => (
                                    <option key={role} value={role}>
                                        {role}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="forgot-password">
                            <a href="/sign-up">Forgot Password?</a>
                        </div>

                        <button type="submit" className="login-btn">Sign Up</button>

                        <div className="help-text">
                            You have an account? <a href="/login">Sign In</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
