import './Header.css';
function Header() {
  return (
    <header className="header">
      <div className="welcome-text">
        <div className='welcome-header-text'>Bun venit,</div>
        <div className="username">USER</div>
      </div>
      <div className="user-info">
        <div className="user-icon">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png" 
            alt="User icon" 
            className="user-img" />
        </div>
        <div className="user-role">
          The App Developer<br />
          Junior Class
        </div>
      </div>
    </header>
  );
}

export default Header;