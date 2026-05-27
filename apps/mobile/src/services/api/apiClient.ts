type ApiSuccessResponse<T> = {
  data: T;
};

const API_TIMEOUT_MS = 10000;

function getBaseUrl() {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error('Missing EXPO_PUBLIC_API_URL. Set it in apps/mobile/.env.');
  }

  return baseUrl.replace(/\/$/, '');
}

export async function apiGet<T>(path: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(`${getBaseUrl()}${path}`, {
      method: 'GET',
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`API GET ${path} failed with status ${response.status}.`);
    }

    const json = (await response.json()) as ApiSuccessResponse<T>;

    return json.data;
  } finally {
    clearTimeout(timeout);
  }
}
