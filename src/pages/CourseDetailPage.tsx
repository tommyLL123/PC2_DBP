import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { coursesApi } from '../lib/apiClient';
import { ApiError, describeError } from '../lib/httpErrors';
import { Alert } from '../components/Alert';
import { CourseForm } from '../components/CourseForm';
import type { Course, CourseInput } from '../types';

export function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const courseId = Number(id);
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCourse() {
      setLoading(true);
      setLoadError(null);
      setNotFound(false);
      try {
        const result = await coursesApi.get(courseId);
        if (!cancelled) setCourse(result);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
        } else {
          setLoadError(describeError(err));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (Number.isInteger(courseId)) {
      loadCourse();
    } else {
      setNotFound(true);
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [courseId]);

  async function handleUpdate(input: CourseInput) {
    setSaveError(null);
    setSaveSuccess(false);
    try {
      setSaving(true);
      const updated = await coursesApi.update(courseId, input);
      setCourse(updated);
      setSaveSuccess(true);
    } catch (err) {
      setSaveError(describeError(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm('Seguro que quieres eliminar este curso? Esta accion no se puede deshacer.')) {
      return;
    }
    setDeleteError(null);
    try {
      setDeleting(true);
      await coursesApi.remove(courseId);
      navigate('/dashboard');
    } catch (err) {
      setDeleteError(describeError(err));
      setDeleting(false);
    }
  }

  return (
    <section className="page">
      <Link to="/dashboard">Volver a mis cursos</Link>

      {loading && <p>Cargando curso...</p>}

      {!loading && notFound && <Alert tone="error">El curso que buscas no existe o fue eliminado.</Alert>}

      {!loading && !notFound && loadError && <Alert tone="error">{loadError}</Alert>}

      {!loading && course && (
        <div>
          <div className="page-heading">
            <div>
              <h1>{course.name}</h1>
              <p>Actualiza los datos o elimina este curso.</p>
            </div>
            <button type="button" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Eliminando...' : 'Eliminar curso'}
            </button>
          </div>

          <CourseForm
            initialValue={{
              name: course.name,
              code: course.code,
              credits: course.credits,
              grade: course.grade,
              status: course.status
            }}
            submitLabel="Guardar cambios"
            loading={saving}
            onSubmit={handleUpdate}
          />

          {saveError && <Alert tone="error">{saveError}</Alert>}
          {saveSuccess && <Alert tone="success">Los cambios se guardaron correctamente.</Alert>}
          {deleteError && <Alert tone="error">{deleteError}</Alert>}
        </div>
      )}
    </section>
  );
}

export default CourseDetailPage;