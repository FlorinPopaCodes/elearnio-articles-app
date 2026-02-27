import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { combineLatest, of, switchMap } from 'rxjs';
import { RouterLink } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { EngagementService } from '../../services/engagement.service';
import { CommentListComponent } from '../../components/comment-list/comment-list.component';
import { CommentFormComponent } from '../../components/comment-form/comment-form.component';
import { MarkdownPipe } from '../../pipes/markdown.pipe';
import { DatePipe } from '@angular/common';
import type { Comment } from '../../types';

@Component({
  selector: 'app-article-detail-page',
  imports: [
    RouterLink,
    DatePipe,
    CommentListComponent,
    CommentFormComponent,
    MarkdownPipe,
  ],
  templateUrl: './article-detail.page.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleDetailPage {
  id = input.required<string>();

  private svc = inject(ArticleService);
  private engagementSvc = inject(EngagementService);
  private articleId = computed(() => {
    const n = Number(this.id());
    return Number.isFinite(n) && n > 0 ? n : null;
  });

  article = toSignal(
    toObservable(this.articleId).pipe(
      switchMap((id) => (id ? this.svc.getArticle(id) : of(undefined))),
    ),
  );

  private commentsRefreshTrigger = signal(0);
  private newComments = signal<Comment[]>([]);

  loadedComments = toSignal(
    combineLatest([
      toObservable(this.articleId),
      toObservable(this.commentsRefreshTrigger),
    ]).pipe(
      switchMap(([id]) =>
        id ? this.svc.getComments(id) : of([] as Comment[]),
      ),
    ),
    { initialValue: [] as Comment[] },
  );

  comments = computed(() => [...this.newComments(), ...this.loadedComments()]);

  commentSubmitting = signal(false);
  commentErrors = signal<Record<string, string[]> | null>(null);

  onCommentSubmit(payload: {
    comment: { body: string; author_name: string };
  }): void {
    const id = this.articleId();
    if (!id) return;

    this.commentSubmitting.set(true);
    this.commentErrors.set(null);

    this.svc.createComment(id, payload).subscribe({
      next: (saved) => {
        this.newComments.update((c) => [saved, ...c]);
        this.commentSubmitting.set(false);
        this.engagementSvc.refresh();
      },
      error: (err) => {
        this.commentErrors.set(err.error?.errors ?? null);
        this.commentSubmitting.set(false);
      },
    });
  }
}
