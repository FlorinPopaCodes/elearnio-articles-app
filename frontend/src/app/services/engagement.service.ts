import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { shareReplay, switchMap } from 'rxjs';
import type { Observable } from 'rxjs';
import type { Engagement } from '../types';

@Injectable({ providedIn: 'root' })
export class EngagementService {
  private http = inject(HttpClient);
  private refreshTrigger = signal(0);
  private stats$ = toObservable(this.refreshTrigger).pipe(
    switchMap(() => this.http.get<Engagement>('/api/engagement')),
    shareReplay(1),
  );

  getStats(): Observable<Engagement> {
    return this.stats$;
  }

  refresh(): void {
    this.refreshTrigger.update((v) => v + 1);
  }
}
