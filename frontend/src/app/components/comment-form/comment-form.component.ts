import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { applyServerErrors } from '../../services/server-errors';

@Component({
  selector: 'app-comment-form',
  imports: [ReactiveFormsModule],
  templateUrl: './comment-form.component.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentFormComponent {
  serverErrors = input<Record<string, string[]> | null>(null);
  submitting = input(false);
  submitted = output<{ comment: { body: string; author_name: string } }>();

  private fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    body: ['', Validators.required],
    author_name: ['', Validators.required],
  });

  private _applyErrors = effect(() => {
    const errors = this.serverErrors();
    if (errors) {
      applyServerErrors(this.form, errors);
    }
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitted.emit({ comment: this.form.getRawValue() });
    this.form.reset();
  }

  hasError(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && control.touched;
  }

  getError(field: string): string {
    const control = this.form.get(field);
    if (!control?.errors) return '';
    if (control.errors['required'])
      return `${field.replace('_', ' ')} is required`;
    if (control.errors['server']) return control.errors['server'];
    return '';
  }
}
