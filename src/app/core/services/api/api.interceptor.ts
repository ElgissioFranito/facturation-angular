import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
    // Simple mock for dashboard stats
    if (req.url.endsWith('/api/dashboard/stats') && req.method === 'GET') {
        return of(new HttpResponse({
            status: 200,
            body: {
                totalMonth: 3840,
                totalYear: 42560,
                paidRange: 12,
                pendingRange: 3,
                overdueRange: 2
            }
        })).pipe(delay(500));
    }

    // Pass through if not mocked
    return next(req);
};
