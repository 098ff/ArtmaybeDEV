import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, resetAuthState } from '@/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function LoginPage() {
    const [form, setForm] = useState({ email: '', password: '' });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const auth = useSelector((state) => state.auth);
    const { user, isLoading, isError, isSuccess, message } = auth;

    useEffect(() => {
        if (isError && message) {
            toast.error(message);
        }

        if (isSuccess && user) {
            toast.success('Login successful');
            navigate('/companies');
        }

        return () => {
            dispatch(resetAuthState());
        };
    }, [isError, isSuccess, message, user, navigate, dispatch]);

    const onChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(login(form)).unwrap();
        } catch (err) {
            const msg = err || 'Login failed';
            toast.error(msg);
        }
    };


    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="login-title">Login</h1>
                <p className="login-subtitle">
                    Access your job fair dashboard
                </p>

                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={form.password}
                            onChange={onChange}
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