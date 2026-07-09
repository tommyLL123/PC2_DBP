import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { isAuthenticated, username, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="nav-bar">
      <Link to={isAuthenticated ? '/dashboard' : '/login'}>
        <strong>StudyTrack</strong>
      </Link>

      {isAuthenticated && (
        <span>
          {username && <span>Hola, {username} </span>}
          <button
            type="button"
            onClick={() => {
              signOut();
              navigate('/login');
            }}
          >
            Cerrar sesion
          </button>
        </span>
      )}
    </nav>
  );
}
