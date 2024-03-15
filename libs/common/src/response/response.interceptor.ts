import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { readPackageVersion } from '@app/common';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const version = readPackageVersion();

    // Check if the response has already been processed
    if (response.locals && response.locals.alreadyWrapped) {
      // Response has already been wrapped, so just pass the data through
      return next.handle();
    }

    // Mark the response as processed
    if (response.locals) {
      response.locals.alreadyWrapped = true;
    } else {
      response['locals'] = { alreadyWrapped: true }; // For non-express platforms, ensure compatibility
    }

    // Wrap the response with data and version
    return next.handle().pipe(map((data) => ({ data, version })));
  }
}
