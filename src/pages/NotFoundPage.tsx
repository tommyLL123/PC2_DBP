import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="page">
      <h1>Pagina no encontrada</h1>
      <p>La ruta que buscas no existe.</p>
      <Link to="/dashboard">Ir al panel principal</Link>
    </section>
  );
}

export default NotFoundPage;