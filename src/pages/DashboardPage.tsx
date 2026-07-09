import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { coursesApi } from '../lib/apiClient';
import { describeError } from '../lib/httpErrors';
import { Alert } from '../components/Alert';
import { CourseStatusBadge } from '../components/CourseStatusBadge';
import { Pagination } from '../components/Pagination';
import type { Course, CoursePage } from '../types';

const PAGE_SIZE = 6;

export function DashboardPage() {
  const [page, setPage] = useState(0);
  const [data, setData] = useState<CoursePage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCourses() {
      setLoading(true);
      setError(null);
      try {
        const result = await coursesApi.list(page, PAGE_SIZE);
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(describeError(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCourses();
    return () => {
      cancelled = true;
    };
  }, [page]);

  const courses: Course[] = data?.content ?? [];

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <h1>Mis cursos</h1>
          <p>Revisa tus notas y el estado de cada curso.</p>
        </div>
        <Link to="/courses/new">
          <button type="button">Nuevo curso</button>
        </Link>
      </div>

      {error && <Alert tone="error">{error}</Alert>}

      {loading && !data && <p>Cargando cursos...</p>}

      {!loading && data && data.empty && (
        <div>
          <p>Aun no tienes cursos registrados.</p>
          <Link to="/courses/new">
            <button type="button">Registrar curso</button>
          </Link>
        </div>
      )}

      {courses.length > 0 && (
        <div className="course-grid">
          {courses.map((course) => (
            <Link key={course.id} to={`/courses/${course.id}`} className="course-card">
              <strong>{course.name}</strong>
              <span>{course.code}</span>
              <CourseStatusBadge status={course.status} />
              <span>{course.credits} creditos</span>
              <span>Nota: {course.grade}</span>
            </Link>
          ))}
        </div>
      )}

      {data && data.totalPages > 0 && (
        <Pagination
          page={data.number}
          totalPages={data.totalPages}
          isFirst={data.first}
          isLast={data.last}
          onPrevious={() => setPage((p) => Math.max(0, p - 1))}
          onNext={() => setPage((p) => p + 1)}
        />
      )}
    </section>
  );
}

export default DashboardPage;