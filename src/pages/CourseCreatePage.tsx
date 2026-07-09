import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { coursesApi } from '../lib/apiClient';
import { describeError } from '../lib/httpErrors';
import { Alert } from '../components/Alert';
import { CourseForm } from '../components/CourseForm';
import type { CourseInput } from '../types';

export function CourseCreatePage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleCreate(input: CourseInput) {
    setError(null);
    try {
      setLoading(true);
      await coursesApi.create(input);
      navigate('/dashboard');
    } catch (err) {
      setError(describeError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page">
      <Link to="/dashboard">Volver a mis cursos</Link>

      <h1>Registrar curso</h1>
      <p>Completa los datos del curso que quieres hacer seguimiento.</p>

      <CourseForm submitLabel="Crear curso" loading={loading} onSubmit={handleCreate} />

      {error && <Alert tone="error">{error}</Alert>}
    </section>
  );
}

export default CourseCreatePage;