import '../../testing/init-test-env';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ArticleCardComponent } from './article-card.component';
import { ComponentRef } from '@angular/core';

describe('ArticleCardComponent', () => {
  let fixture: ComponentFixture<ArticleCardComponent>;
  let componentRef: ComponentRef<ArticleCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleCardComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleCardComponent);
    componentRef = fixture.componentRef;
    componentRef.setInput('article', {
      id: 1,
      title: 'Test Article',
      author_name: 'John',
      comments_count: 3,
      created_at: '2026-01-15T00:00:00Z',
    });
    fixture.detectChanges();
  });

  it('renders the article title', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Test Article');
  });

  it('renders the author name', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('John');
  });

  it('renders the comments count', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('3 comments');
  });

  it('renders singular comment for count of 1', () => {
    componentRef.setInput('article', {
      id: 2,
      title: 'Single Comment',
      author_name: 'Jane',
      comments_count: 1,
      created_at: '2026-01-15T00:00:00Z',
    });
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('1 comment');
    expect(el.textContent).not.toContain('1 comments');
  });

  it('links to the article detail page', () => {
    const link = fixture.nativeElement.querySelector('a');
    expect(link?.getAttribute('href')).toBe('/articles/1');
  });
});
