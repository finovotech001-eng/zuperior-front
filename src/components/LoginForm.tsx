// zuperior-dashboard/client/src/components/LoginForm.tsx (Example)

'use client';

import { useState } from 'react';
import { authService } from '../services/api.service';
import { useRouter } from 'next/navigation';

const LoginForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authService.login(formData);

      // 1. Store Auth Data (Token & Client ID)
      authService.setAuthData(data.token, data.clientId);

      // 2. Update Redux/Context (Mocked - replace with your actual state update)
      console.log(`User logged in. ClientID: ${data.clientId}`);

      // 3. Redirect to the Dashboard
      router.push('/dashboard');

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed. Check your credentials.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Client Login</h2>

      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="mb-3 p-2 border w-full"/>
      <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="mb-3 p-2 border w-full"/>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white p-3 rounded w-full hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Authenticating...' : 'Login'}
      </button>

      <p className="mt-4 text-center">
        Don't have an account? <a href="/signup" className="text-blue-600 hover:underline">Register now</a>
      </p>
    </form>
  );
};

export default LoginForm;