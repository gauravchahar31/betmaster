import React, { useState } from 'react';
import './login.css';
import backgroundImage from './background.jpg'; // Local background image

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showContactPopup, setShowContactPopup] = useState(false);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateEmail(email)) {
            setError('Please enter a valid email.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('https://your-backend-api.com/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            setLoading(false);

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            console.log('Login successful:', data);
            alert('Login successful!');
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div
            className="login-container"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            {/* Top Navigation Bar */}
            <nav className="top-nav">
                <span className="welcome-text">Welcome to Bet Master</span>
                <button className="contact-button" onClick={() => setShowContactPopup(true)}>
                    Contact
                </button>
            </nav>

            {/* Login Form */}
            <form className="login-form" onSubmit={handleLogin}>
                <h1>Login</h1>
                {error && <div className="error-message">{error}</div>}
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                </div>
                <button type="submit" className="login-button" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            {/* Contact Popup Modal */}
            {showContactPopup && (
                <div className="popup-overlay" onClick={() => setShowContactPopup(false)}>
                    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Contact Us</h2>
                        <p>Email: support@betmaster.com</p>
                        <p>WhatsApp: +123-456-7890</p>
                        <button className="close-button" onClick={() => setShowContactPopup(false)}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginPage;