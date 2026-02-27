import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import type { Comment } from '../../types';

@Component({
  selector: 'app-comment-list',
  imports: [DatePipe],
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (comments().length === 0) {
      <div class="rounded-lg border-2 border-dashed border-gray-300 px-6 py-8 text-center">
        <div class="text-3xl" aria-hidden="true">&#128172;</div>
        <p class="mt-2 text-sm text-gray-500">No comments yet. Be the first to share your thoughts!</p>
      </div>
    } @else {
      <ul class="space-y-4">
        @for (comment of comments(); track comment.id) {
          <li class="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <p class="text-sm text-gray-800">{{ comment.body }}</p>
            <div class="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <span class="font-medium">{{ comment.author_name }}</span>
              <span>&middot;</span>
              <time [attr.datetime]="comment.created_at">{{ comment.created_at | date:'medium' }}</time>
            </div>
          </li>
        }
      </ul>
    }
  `,
})
export class CommentListComponent {
  comments = input.required<Comment[]>();
}
