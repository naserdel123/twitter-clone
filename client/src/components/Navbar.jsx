import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav style={{ padding: '1rem', display: 'flex', gap: '1rem', borderBottom: '1px solid #ccc' }}>
      <Link to="/">Home</Link>
      {user ? (
        <>
          <Link to={`/profile/${user._id}`}>Profile</Link>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
