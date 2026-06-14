export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

export class AIConfigError extends AppError {
  constructor(message: string) {
    super(message, 500);
    this.name = 'AIConfigError';
  }
}

export class AIServiceError extends AppError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, 503);
    this.name = 'AIServiceError';
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}
