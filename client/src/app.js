import React, { useState } from 'react';
import ReactDom from 'react-dom/client';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';

// Components for various pages
import LoginPage from './pages/login/login';

const HomePage = () => {
    return <h1>Home Page</h1>;
};

const AboutPage = () => {
    return <h1>About Page</h1>;
};

const ProfilePage = () => {
    return <h1>Profile Page</h1>;
};

const NotFoundPage = () => {
    return <h1>404 - Page Not Found</h1>;
};

// App Component
const App = () => {
    // Simulate authentication state
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <Router>
            <Routes>
                {/* Home Route */}
                <Route
                    path="/"
                    element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />}
                />
                
                {/* Login Route */}
                <Route path="/login" element={<LoginPage />} />

                {/* About Route */}
                <Route
                    path="/about"
                    element={isAuthenticated ? <AboutPage /> : <Navigate to="/login" />}
                />

                {/* Profile Route */}
                <Route
                    path="/profile"
                    element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />}
                />

                {/* Catch-All for Undefined Routes */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
};

const root = ReactDom.createRoot(document.getElementById('root'));
root.render(
    <App />
);