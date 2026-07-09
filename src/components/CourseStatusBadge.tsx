import type { CourseStatus } from '../types';

const STATUS_LABEL: Record<CourseStatus, string> = {
  EN_CURSO: 'En curso',
  APROBADO: 'Aprobado',
  DESAPROBADO: 'Desaprobado'
};

const STATUS_CLASSES: Record<CourseStatus, string> = {
  EN_CURSO: 'badge badge-en-curso',
  APROBADO: 'badge badge-aprobado',
  DESAPROBADO: 'badge badge-desaprobado'
};

export function CourseStatusBadge({ status }: { status: CourseStatus }) {
  return <span className={STATUS_CLASSES[status]}>{STATUS_LABEL[status]}</span>;
}
