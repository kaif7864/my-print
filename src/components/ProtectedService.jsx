import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiAlertTriangle, FiClock, FiX } from 'react-icons/fi';

function ProtectedService({ children }) {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // 🔒 PRO VERSION PASSWORD (Aap ise badal sakte hain)
    const SECRET_PASSWORD = "marksheet@2002";
    const [timeLeft, setTimeLeft] = useState(90); // 5 minutes session

    useEffect(() => {
        if (!isAuthenticated) return;

        if (timeLeft <= 0) {
            handleClose(); // Time khatam, wapas dashboard
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [isAuthenticated, timeLeft]);


    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (password === SECRET_PASSWORD) {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Incorrect Password! Redirecting...');
            setTimeout(() => {
                navigate('/'); // Wrong password pr wapas dashboard
            }, 1500);
        }
    };

    const handleClose = () => {
        navigate('/');
    };

    if (isAuthenticated) {
        return (
            <div className="relative">
                {/* ⏱️ TIMER DISPLAY IN CORNER */}
                <div className="fixed top-20 right-10 bg-white border border-red-200 text-red-600 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 pl-2.5  font-mono">
                    <FiClock /> Session Ends in: {timeLeft}s
                </div>
                {children}
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center border border-gray-100">
                <button onClick={handleClose} className="  mx-auto text-5xl text-indigo-600 bg-indigo-50 p-4 rounded-full mb-6 absolute top-4 right-4 hover:bg-red-50 hover:text-red-600 transition">
                    <FiX size={24} />
                </button>
                <FiLock className="mx-auto text-6xl text-indigo-600 bg-indigo-50 p-4 rounded-full mb-6" />
                <h2 className="text-2xl font-bold text-gray-900">Pro Feature</h2>
                <p className="text-gray-500 mt-2 mb-6">Enter password to access Secret Documents</p>
                
                <form onSubmit={handlePasswordSubmit}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Password"
                        className="w-full border border-gray-200 rounded-xl py-3 px-4 mb-4 focus:ring-2 focus:ring-indigo-200"
                        required
                    />
                    {error && (
                        <div className="flex items-center gap-2 text-red-600 text-sm mb-4 justify-center">
                            <FiAlertTriangle /> {error}
                        </div>
                    )}
                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition">
                        Access Service
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ProtectedService;