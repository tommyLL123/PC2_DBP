import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../lib/apiClient';
import { describeError } from '../lib/httpErrors';
import { Alert } from '../components/Alert';

const EMPTY_FORM = { username: '', email: '', password: '', fullName: '' };

export function RegisterPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    if (!form.username.trim() || !form.email.trim() || !form.password || !form.fullName.trim()) {
      setError('Completa todos los campos para crear tu cuenta.');
      return;
    }

    try {
      setLoading(true);
      await authApi.register({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        fullName: form.fullName.trim()
      });
      setSuccess(true);
      window.setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(describeError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page">
      <h1>Crear cuenta</h1>
      <p>Registrate para empezar a llevar tu progreso academico.</p>

      <form onSubmit={handleSubmit} className="form-grid">
        <label className="field">
          Nombre completo
          <input
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
        </label>

        <label className="field">
          Usuario
          <input
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            autoComplete="username"
          />
        </label>

        <label className="field">
          Correo electronico
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            autoComplete="email"
          />
        </label>

        <label className="field">
          Contrasena
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            autoComplete="new-password"
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>

      {error && <Alert tone="error">{error}</Alert>}
      {success && <Alert tone="success">Cuenta creada correctamente. Redirigiendo al login...</Alert>}

      <p>
        Ya tienes cuenta? <Link to="/login">Inicia sesion</Link>
      </p>
    </section>
  );
}


export default RegisterPage;