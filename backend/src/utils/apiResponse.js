export class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  static success(res, statusCode, data, message = 'Success') {
    return res.status(statusCode).json(new ApiResponse(statusCode, data, message));
  }
}

