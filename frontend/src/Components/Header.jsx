import './Header.css';
import useCurrentUser from '../Hooks/useCurrentUser';
import { useLocation } from 'react-router-dom';

const handleLogout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

function Header() {
  const user = useCurrentUser();
    const location = useLocation();
  const currentPath = location.pathname;
  return (
    <header className="header">
      <div className="welcome-text">
        <div className='welcome-header-text'>{currentPath === '/' ? 'Bun venit' : currentPath == '/settings' ? 'Setări pentru': 'Bun venit'}</div>
        <div className="username">{user ? user.username : ' '}</div>
        <div className='logout-text'>
        Ai terminat?
        <button className="logout-button" onClick={handleLogout}>
          Deconectează-te
        </button>
        </div>
      </div>
      <div className="user-info">
        <div className="user-icon">
          <img
            src={user ? user.profile_picture ? user.profile_picture : "https://cdn-icons-png.flaticon.com/512/149/149071.png" : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
            alt="User icon"
            className="user-img" />
        </div>
        <div className="user-role">
          {user ? user.role : 'Necunoscut'}
          <br></br>
          {user ? user.status ? user.status : 'Status necunoscut' : 'Necunoscut'}
        </div>
      </div>
    </header>
  );
}

export default Header;
