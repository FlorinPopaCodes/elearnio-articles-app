import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { ArticleService } from '../../services/article.service';
import { EngagementService } from '../../services/engagement.service';
import { ArticleCardComponent } from '../../components/article-card/article-card.component';
import { ArticleFormComponent } from '../../components/article-form/article-form.component';

@Component({
  selector: 'app-article-list-page',
  imports: [ArticleCardComponent, ArticleFormComponent, RouterLink],
  templateUrl: './article-list.page.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleListPage {
  private svc = inject(ArticleService);
  private engagementSvc = inject(EngagementService);
  engagementStats = toSignal(this.engagementSvc.getStats());
  private refreshTrigger = signal(0);

  articles = toSignal(
    toObservable(this.refreshTrigger).pipe(
      switchMap(() => this.svc.getArticles()),
    ),
  );

  showForm = signal(false);
  submitting = signal(false);
  serverErrors = signal<Record<string, string[]> | null>(null);

  toggleForm(): void {
    this.showForm.update((v) => !v);
    this.serverErrors.set(null);
  }

  onArticleSubmit(payload: {
    article: { title: string; body: string; author_name: string };
  }): void {
    this.submitting.set(true);
    this.serverErrors.set(null);

    this.svc.createArticle(payload).subscribe({
      next: () => {
        this.showForm.set(false);
        this.submitting.set(false);
        this.refreshTrigger.update((v) => v + 1);
        this.engagementSvc.refresh();
      },
      error: (err) => {
        this.serverErrors.set(err.error?.errors ?? null);
        this.submitting.set(false);
      },
    });
  }
}
