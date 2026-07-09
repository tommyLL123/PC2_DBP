import { ApiError, NetworkError } from './httpErrors';
import { clearSession, notifySessionExpired, readStoredToken } from './session';
import type {
  AuthResponse,
  Course,
  CourseInput,
  CoursePage,
  LoginInput,
  RegisterInput
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';
const REQUEST_TIMEOUT_MS = 12000;

const FALLBACK_MESSAGES: Record<number, string> = {
  400: 'Los datos enviados no son validos. Revisa el formulario.',
  401: 'Tu sesion expiro o no es valida. Inicia sesion nuevamente.',
  403: 'No tienes permisos para realizar esta accion.',
  404: 'No encontramos el recurso solicitado.',
  409: 'Ya existe un registro con esos datos.',
  500: 'Ocurrio un error en el servidor. Intenta mas tarde.'
};

function messageForStatus(status: number): string {
  return FALLBACK_MESSAGES[status] ?? `La solicitud fallo con estado ${status}.`;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const token = readStoredToken();

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      throw new NetworkError('El servidor tardo demasiado en responder. Intenta de nuevo.');
    }
    throw new NetworkError('No se pudo conectar con el servidor. Verifica tu conexion.');
  }

  if (response.status === 401) {
    clearSession();
    notifySessionExpired();
  }

  if (!response.ok) {
    let message = messageForStatus(response.status);
    const text = await response.text().catch(() => '');
    if (text) {
      try {
        const body = JSON.parse(text) as { error?: string; message?: string };
        message = body.error ?? body.message ?? message;
      } catch {
        // respuesta no era JSON, se conserva el mensaje por defecto
      }
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

export const authApi = {
  register(input: RegisterInput) {
    return request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(input)
    });
  },
  login(input: LoginInput) {
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(input)
    });
  }
};

export const coursesApi = {
  list(page: number, size: number) {
    return request<CoursePage>(`/courses?page=${page}&size=${size}`);
  },
  get(id: number) {
    return request<Course>(`/courses/${id}`);
  },
  create(input: CourseInput) {
    return request<Course>('/courses', {
      method: 'POST',
      body: JSON.stringify(input)
    });
  },
  update(id: number, input: CourseInput) {
    return request<Course>(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input)
    });
  },
  remove(id: number) {
    return request<void>(`/courses/${id}`, { method: 'DELETE' });
  }
};
