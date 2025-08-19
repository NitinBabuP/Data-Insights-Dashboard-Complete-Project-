import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/api/register', { username, password });
            navigate('/login');
        } catch (err) {
            setError('Failed to register. Username might already be taken.');
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
                <input className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200" type="submit">Register</button>
            </form>
            {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
            <p className="mt-6 text-center text-sm">Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login here</Link></p>
        </div>
    );
}

export default Register;