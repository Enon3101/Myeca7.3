import { Response } from 'express';

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    total: number;
    limit: number;
    offset: number;
  };
}

export function sendSuccess<T>(res: Response, data: T, status = 200): void {
  const response: ApiResponse<T> = { success: true, data };
  res.status(status).json(response);
}

export function sendPaginated<T>(
  res: Response,
  data: T,
  pagination: { total: number; limit: number; offset: number }
): void {
  const response: ApiResponse<T> = { success: true, data, pagination };
  res.status(200).json(response);
}

export function sendError(res: Response, error: string, status = 500): void {
  const response: ApiResponse = { success: false, error };
  res.status(status).json(response);
}

export function sendNotFound(res: Response, entity = 'Resource'): void {
  sendError(res, `${entity} not found`, 404);
}

export function sendUnauthorized(res: Response, message = 'Authentication required'): void {
  sendError(res, message, 401);
}

export function sendForbidden(res: Response, message = 'Access denied'): void {
  sendError(res, message, 403);
}

export function sendValidationError(res: Response, message: string): void {
  sendError(res, message, 400);
}
