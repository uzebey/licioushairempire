import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthService } from '../services/auth';

/**
 * An interceptor is like a middleware for outgoing HTTP requests.
 * Every request the Angular app makes passes through here first.
 *
 * We check if we have a JWT stored. If yes, we clone the request and
 * add the Authorization header before sending it on to the server.
 * This means no controller or service has to manually add the header.
 */
export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getToken();

  if (!token) {
    return next(req); // no token — send the request as-is (e.g. login/register calls)
  }

  const authedReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });

  return next(authedReq);
};
