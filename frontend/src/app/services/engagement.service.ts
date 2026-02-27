import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, shareReplay, switchMap } from 'rxjs';
import type { Observable } from 'rxjs';
import type { Engagement } from '../types';

@Injectable({ providedIn: 'root' })
export class EngagementService {
  private http = inject(HttpClient);
  private refresh$ = new BehaviorSubject<void>(undefined);
  private stats$ = this.refresh$.pipe(
    switchMap(() => this.http.get<Engagement>('/api/engagement')),
    shareReplay(1),
  );

  getStats(): Observable<Engagement> {
    return this.stats$;
  }

  refresh(): void {
    this.refresh$.next();
  }
}
