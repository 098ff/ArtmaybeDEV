import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../features/auth/authService';

export default function LoginPage() {
    const [cookies, setCookie] = useCookies(['token']);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const { email, password } = formData;

    const handleChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setIsLoading(true);

        try {
            const responseData = await authService.login({ email, password });

            if (responseData && responseData.token) {
  
                setCookie('token', responseData.token, { 
                    path: '/', 
                });

                const userForStorage = {
                    token: responseData.token,
                };

                localStorage.setItem('user', JSON.stringify(userForStorage));

                toast.success('Login Successful!');
                navigate('/companies');

            } else {
                toast.error(responseData.message || 'Login failed');
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
            toast.error(message);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="login-title">Login</h1>
                <p className="login-subtitle">
                    Access your job fair dashboard
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="login-button" 
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}