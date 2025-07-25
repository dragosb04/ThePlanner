import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Form.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/');
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Înregistrare reușită! Te poți conecta acum.');
      navigate('/login');
    } else {
      alert(data.message || 'Eroare la înregistrare');
    }
  };

  return (
    <div className="form-box">
      <h2>Înregistrează-te</h2>
      <form className='form-group' onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nume utilizator"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
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
        <button type="submit">Înregistrare</button>
                <div style={{ marginTop: '20px', fontSize: '14px' }}> Ai deja cont?{' '}
          <Link to="/login" style={{ color: '#656879', textDecoration: 'none', padding: '0 4px' }}>
            Autentifică-te aici
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
