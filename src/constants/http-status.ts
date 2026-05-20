/** HTTP response status codes used across app API routes and clients. */
export enum HttpStatus {
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  Conflict = 409,
  TooManyRequests = 429,
  Created = 201,
  NoContent = 204,
  InternalServerError = 500,
  BadGateway = 502,
  ServiceUnavailable = 503,
}
