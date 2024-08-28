import React, { useState } from "react";
import { FaUser, FaLock, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

interface LoginScreenProps {
  onLogin: (username: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password === "Jerry") {
      onLogin(username);
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <div className="text-center z-10 relative bg-black bg-opacity-80 p-6 rounded-lg border border-green-500 shadow-lg shadow-green-500/50">
      <h2 className="text-3xl mb-6 font-bold flex items-center justify-center">
        <FaUser className="mr-2 text-green-500" />Login
      </h2>
      <p className="mb-4 text-yellow-400">
        <FaExclamationTriangle className="inline mr-2" />
        For demo purposes, the password is &quot;Jerry&quot;
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <div className="mb-4 flex items-center">
          <FaUser className="mr-2 text-green-500" />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="bg-black border-2 border-green-500 text-green-500 px-4 py-2 text-xl rounded"
            required
          />
        </div>
        <div className="mb-6 flex items-center">
          <FaLock className="mr-2 text-green-500" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="bg-black border-2 border-green-500 text-green-500 px-4 py-2 text-xl rounded"
            required
          />
        </div>
        {error && (
          <div className="mb-4 text-red-500 flex items-center">
            <FaExclamationTriangle className="mr-2" />
            {error}
          </div>
        )}
        <button type="submit" className="px-6 py-2 border-2 border-green-500 hover:bg-green-500 hover:text-black transition-colors text-xl rounded flex items-center">
          <FaCheck className="mr-2" />Login
        </button>
      </form>
    </div>
  );
};

export default LoginScreen;