import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Form.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/');
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      navigate('/');
    } else {
      alert(data.message || 'Eroare la autentificare');
    }
  };

  return (
    <div className="form-box">
      <h2>Autentificare</h2>
      <form className='form-group' onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Parola"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        <div style={{ marginTop: '20px', fontSize: '14px' }}>
          Nu ai cont?{' '}
          <Link to="/register" style={{ color: '#656879', textDecoration: 'none', padding: '0 4px' }}>
            Înregistrează-te aici
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
