import { NextResponse } from 'next/server';

type JsonBody = Record<string, unknown> | unknown[];

export class HttpError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export function ok<T extends JsonBody>(body: T, init?: ResponseInit) {
  return withCors(NextResponse.json(body, init));
}

export function fail(message: string, status = 500) {
  return withCors(
    NextResponse.json(
      {
        error: {
          message,
        },
      },
      { status },
    ),
  );
}

export function handleError(error: unknown) {
  const message = error instanceof Error ? error.message : 'Unexpected server error';

  return fail(message, 500);
}

export function withCors(response: NextResponse) {
  const origin = process.env.CORS_ORIGIN ?? '*';

  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response;
}

export function optionsResponse() {
  return withCors(new NextResponse(null, { status: 204 }));
}
