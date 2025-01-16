import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { useAuth } from '../AuthContext';
import { setCookie } from '../api/cookie';
import '../styles/Form.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { setAuthData } = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const userData = await login(username, password);
            const { role, id, token } = userData;;
            localStorage.setItem('token', token);

            
            setAuthData({ role, id });

            setCookie('username', username, 7);

            if (role.includes('ADMIN')) {
                console.log(role);
                navigate('/StartPage');
            } else {
                console.log(role);
                navigate(`/person/${id}/devices`);
            }
        } catch (error) {
            setError('Invalid username or password');
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <div className="container-form">
                <form className="form-1" onSubmit={handleSubmit}>
                    <div>
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
}

export default Login;
