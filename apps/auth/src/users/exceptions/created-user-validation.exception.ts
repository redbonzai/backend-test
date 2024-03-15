import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorType } from '@app/common/enums';

export class CreatedUserValidationException extends HttpException {
  constructor(message: string, errorType: ErrorType, statusCode: HttpStatus) {
    const responseBody = {
      error: message,
      errorType,
      statusCode,
    };
    super(responseBody, statusCode);
  }
}
