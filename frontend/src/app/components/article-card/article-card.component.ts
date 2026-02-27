import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import type { Article } from '../../types';

@Component({
  selector: 'app-article-card',
  imports: [RouterLink, DatePipe],
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a [routerLink]="['/articles', article().id]"
       class="block rounded-lg border border-gray-200 border-l-2 border-l-gray-200 bg-white p-4 transition hover:border-l-teal-500 hover:shadow-md">
      <div class="flex items-start justify-between gap-3">
        <h3 class="text-lg font-semibold text-gray-900">{{ article().title }}</h3>
        <span class="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-teal-700">
          {{ article().comments_count }} {{ article().comments_count === 1 ? 'comment' : 'comments' }}
        </span>
      </div>
      <div class="mt-1 flex items-center gap-3 text-sm text-gray-500">
        <span>{{ article().author_name }}</span>
        <span>&middot;</span>
        <time [attr.datetime]="article().created_at">{{ article().created_at | date:'mediumDate' }}</time>
      </div>
    </a>
  `,
})
export class ArticleCardComponent {
  article = input.required<Article>();
}
