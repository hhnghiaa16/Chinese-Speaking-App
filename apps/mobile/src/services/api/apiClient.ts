import { supabase } from '../auth/supabaseClient';

type ApiSuccessResponse<T> = {
  data: T;
};

const API_TIMEOUT_MS = 60000;

function getBaseUrl() {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error('Missing EXPO_PUBLIC_API_URL. Set it in apps/mobile/.env.');
  }

  return baseUrl.replace(/\/$/, '');
}

export function getApiUrl(path: string) {
  return `${getBaseUrl()}${path}`;
}

async function apiRequest<T>(path: string, init: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    const headers = new Headers(init.headers);
    if (session?.access_token) {
      headers.set('Authorization', `Bearer ${session.access_token}`);
    }

    const response = await fetch(getApiUrl(path), {
      ...init,
      headers,
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `API ${init.method ?? 'GET'} ${path} failed with status ${response.status}: ${errorText}`,
      );
    }

    const json = (await response.json()) as ApiSuccessResponse<T>;

    return json.data;
  } finally {
    clearTimeout(timeout);
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  return apiRequest<T>(path, {
    method: 'GET',
  });
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return apiRequest<T>(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export async function apiPut<T>(path: string, body?: unknown): Promise<T> {
  return apiRequest<T>(path, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}
