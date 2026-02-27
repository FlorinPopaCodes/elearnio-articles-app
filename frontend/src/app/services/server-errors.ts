import type { FormGroup } from '@angular/forms';

export function applyServerErrors(
  form: FormGroup,
  errors: Record<string, string[]>,
): void {
  for (const [field, messages] of Object.entries(errors)) {
    const control = form.get(field);
    if (control) {
      control.setErrors({ server: messages[0] });
    }
  }
}
