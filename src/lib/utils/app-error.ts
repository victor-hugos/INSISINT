export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
  }
}

export function getErrorStatus(error: unknown, fallback = 500) {
  if (error instanceof AppError) {
    return error.statusCode;
  }

  return fallback;
}
