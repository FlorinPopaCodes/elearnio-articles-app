import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { shareReplay } from 'rxjs';
import type { Observable } from 'rxjs';
import type { Engagement } from '../types';

@Injectable({ providedIn: 'root' })
export class EngagementService {
  private http = inject(HttpClient);
  private stats$ = this.http
    .get<Engagement>('/api/engagement')
    .pipe(shareReplay(1));

  getStats(): Observable<Engagement> {
    return this.stats$;
  }
}
