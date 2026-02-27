import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, switchMap } from 'rxjs';
import { ArticleService } from '../../services/article.service';
import { ArticleCardComponent } from '../../components/article-card/article-card.component';
import { ArticleFormComponent } from '../../components/article-form/article-form.component';

@Component({
  selector: 'app-article-list-page',
  imports: [ArticleCardComponent, ArticleFormComponent],
  templateUrl: './article-list.page.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleListPage {
  private svc = inject(ArticleService);
  private refresh$ = new BehaviorSubject<void>(undefined);

  articles = toSignal(
    this.refresh$.pipe(switchMap(() => this.svc.getArticles())),
    { initialValue: [] },
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
        this.refresh$.next();
      },
      error: (err) => {
        this.serverErrors.set(err.error?.errors ?? null);
        this.submitting.set(false);
      },
    });
  }
}
