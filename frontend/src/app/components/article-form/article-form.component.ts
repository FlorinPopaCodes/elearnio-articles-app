import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { inject } from '@angular/core';
import { applyServerErrors } from '../../services/server-errors';

@Component({
  selector: 'app-article-form',
  imports: [ReactiveFormsModule],
  templateUrl: './article-form.component.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleFormComponent {
  serverErrors = input<Record<string, string[]> | null>(null);
  submitting = input(false);
  submitted = output<{
    article: { title: string; body: string; author_name: string };
  }>();

  private fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    body: ['', Validators.required],
    author_name: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      const errors = this.serverErrors();
      if (errors) {
        applyServerErrors(this.form, errors);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitted.emit({ article: this.form.getRawValue() });
  }

  hasError(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && control.touched;
  }

  getError(field: string): string {
    const control = this.form.get(field);
    if (!control?.errors) return '';
    if (control.errors['required']) return `${field.replace('_', ' ')} is required`;
    if (control.errors['server']) return control.errors['server'];
    return '';
  }
}
