import '../testing/init-test-env';
import { FormGroup, FormControl } from '@angular/forms';
import { applyServerErrors } from './server-errors';

describe('applyServerErrors', () => {
  it('sets server errors on matching form controls', () => {
    const form = new FormGroup({
      title: new FormControl(''),
      body: new FormControl(''),
    });

    applyServerErrors(form, {
      title: ["can't be blank"],
      body: ['is too short'],
    });

    expect(form.get('title')?.errors).toEqual({ server: "can't be blank" });
    expect(form.get('body')?.errors).toEqual({ server: 'is too short' });
  });

  it('ignores fields not present in the form', () => {
    const form = new FormGroup({
      title: new FormControl(''),
    });

    applyServerErrors(form, {
      title: ['required'],
      unknown_field: ['error'],
    });

    expect(form.get('title')?.errors).toEqual({ server: 'required' });
  });

  it('uses the first error message', () => {
    const form = new FormGroup({
      title: new FormControl(''),
    });

    applyServerErrors(form, {
      title: ['first error', 'second error'],
    });

    expect(form.get('title')?.errors).toEqual({ server: 'first error' });
  });
});
