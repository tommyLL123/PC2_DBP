import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../lib/apiClient';
import { describeError } from '../lib/httpErrors';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/Alert';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError('Ingresa tu usuario/correo y tu contrasena.');
      return;
    }

    try {
      setLoading(true);
      const response = await authApi.login({ username: username.trim(), password });
      signIn(response.token, username.trim());
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(describeError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page">
      <h1>Iniciar sesion</h1>
      <p>Ingresa a tu cuenta para ver tu progreso academico.</p>

      <form onSubmit={handleSubmit} className="form-grid">
        <label className="field">
          Usuario o correo
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </label>

        <label className="field">
          Contrasena
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      {error && <Alert tone="error">{error}</Alert>}

      <p>
        No tienes cuenta? <Link to="/register">Registrate aqui</Link>
      </p>
    </section>
  );
}

export default LoginPage;