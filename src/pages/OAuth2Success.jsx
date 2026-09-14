import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuth2Success = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get('token');
    const email = params.get('email');
    const role = params.get('role');

    if (token && email && role) {

      // Create the logged-in user object
      const userData = {
        token: token,
        email: email,
        role: role
      };

      // Save token separately
      localStorage.setItem('token', token);

      // Save complete user information
      localStorage.setItem(
        'user',
        JSON.stringify(userData)
      );

      // IMPORTANT:
      // Update AuthContext immediately.
      // This fixes the "Email - Not available" problem.
      setUser(userData);

      setStatus('Login successful! Redirecting...');

      // Redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 500);

    } else {

      setStatus('Login failed! Redirecting...');

      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1000);
    }

  }, [navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-lg shadow text-center">

        <div className="text-4xl mb-4">
          ⏳
        </div>

        <p className="text-gray-600">
          {status}
        </p>

      </div>

    </div>
  );
};

export default OAuth2Success;