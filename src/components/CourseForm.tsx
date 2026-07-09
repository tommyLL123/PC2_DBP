import { FormEvent, useState } from 'react';
import type { CourseInput, CourseStatus } from '../types';

const STATUS_OPTIONS: { value: CourseStatus; label: string }[] = [
  { value: 'EN_CURSO', label: 'En curso' },
  { value: 'APROBADO', label: 'Aprobado' },
  { value: 'DESAPROBADO', label: 'Desaprobado' }
];

interface CourseFormProps {
  initialValue?: CourseInput;
  submitLabel: string;
  loading: boolean;
  onSubmit: (input: CourseInput) => void;
}

const EMPTY_FORM: CourseInput = {
  name: '',
  code: '',
  credits: 0,
  grade: 0,
  status: 'EN_CURSO'
};

export function CourseForm({ initialValue, submitLabel, loading, onSubmit }: CourseFormProps) {
  const [form, setForm] = useState<CourseInput>(initialValue ?? EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);

    if (!form.name.trim() || !form.code.trim()) {
      setFormError('El nombre y el codigo del curso son obligatorios.');
      return;
    }
    if (form.grade < 0 || form.grade > 20) {
      setFormError('La nota debe estar entre 0 y 20.');
      return;
    }

    onSubmit({
      ...form,
      name: form.name.trim(),
      code: form.code.trim(),
      credits: Number(form.credits),
      grade: Number(form.grade)
    });
  }

  return (
    <form onSubmit={handleSubmit} className="form-grid">
      <label className="field">
        Nombre del curso
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Base de Datos"
        />
      </label>

      <label className="field">
        Codigo
        <input
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          placeholder="CS2031"
        />
      </label>

      <label className="field">
        Creditos
        <input
          type="number"
          min={0}
          value={form.credits}
          onChange={(e) => setForm({ ...form, credits: Number(e.target.value) })}
        />
      </label>

      <label className="field">
        Nota (0-20)
        <input
          type="number"
          min={0}
          max={20}
          step="0.1"
          value={form.grade}
          onChange={(e) => setForm({ ...form, grade: Number(e.target.value) })}
        />
      </label>

      <label className="field">
        Estado
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value as CourseStatus })}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      {formError && <p className="notice notice-error">{formError}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Guardando...' : submitLabel}
      </button>
    </form>
  );
}
