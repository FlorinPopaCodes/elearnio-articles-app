# Angular Best Practices

Source: [Angular AI Development Guide](https://angular.dev/ai/develop-with-ai)

You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

**Bad:**
```typescript
let name: string = 'Angular';
```

**Good:**
```typescript
let name = 'Angular';
```

## Angular Best Practices

- Always use standalone components, directives, and pipes. Avoid `NgModules` for new features
- Must NOT set `standalone: true` inside Angular decorators. It's the default since Angular v19
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images (`NgOptimizedImage` does not work for inline base64 images)

**Bad:**
```typescript
@Component({
  standalone: true,
  // ...
})
export class MyComponent {}
```

**Good:**
```typescript
@Component({
  // `standalone: true` is implied
  // ...
})
export class MyComponent {}
```

## Accessibility Requirements

- It MUST pass all AXE checks
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes

## Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file

**Old Decorator Syntax:**
```typescript
@Input() userId!: string;
@Output() userSelected = new EventEmitter<string>();
```

**New Function Syntax:**
```typescript
import { input, output } from '@angular/core';

// ...
userId = input.required<string>();      // required, no default
userName = input<string>('');           // optional with default
userSelected = output<string>();
```

**Bad (ngClass):**
```html
<section [ngClass]="{'active': isActive}"></section>
```

**Good (class bindings):**
```html
<section [class.active]="isActive"></section>
<section [class]="{'active': isActive}"></section>
<section [class]="myClasses"></section>
```

**Bad (ngStyle):**
```html
<section [ngStyle]="{'font-size': fontSize + 'px'}"></section>
```

**Good (style bindings):**
```html
<section [style.font-size.px]="fontSize"></section>
<section [style]="myStyles"></section>
```

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- `signal.mutate()` was removed in Angular 17. Use `set()` for replacement or `update()` for transformations

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- `@for` REQUIRES a `track` expression; use `track item.id` or `track $index` as fallback
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available

**Old Syntax:**
```html
<section *ngIf="isVisible">Content</section>
<section *ngFor="let item of items">{{ item }}</section>
```

**New Syntax:**
```html
@if (isVisible) {
  <section>Content</section>
}
@for (item of items; track item.id) {
  <section>{{ item }}</section>
}
```

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

**Old Constructor Injection:**
```typescript
constructor(private myService: MyService) {}
```

**New `inject()` Function:**
```typescript
import { inject } from '@angular/core';

export class MyComponent {
  private myService = inject(MyService);
  // ...
}
```
