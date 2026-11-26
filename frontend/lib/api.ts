const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export type User = {
  id: string;
  fullName: string;
  email: string;
  role: 'USER' | 'ADMIN';
  isVerified: boolean;
  createdAt: string;
};

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    cache: 'no-store',
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = Array.isArray(data.message)
      ? data.message.join(', ')
      : data.message;

    throw new Error(
      message || 'Something went wrong. Please try again.',
    );
  }

  return data as T;
}

export const api = {
  register: (payload: RegisterPayload) =>
    request<{ message: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload: { email: string; password: string }) =>
    request<{ message: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  me: () => request<{ user: User }>('/auth/me'),

  refresh: () =>
    request<{ message: string }>('/auth/refresh', {
      method: 'POST',
    }),

  logout: () =>
    request<{ message: string }>('/auth/logout', {
      method: 'POST',
    }),
};
