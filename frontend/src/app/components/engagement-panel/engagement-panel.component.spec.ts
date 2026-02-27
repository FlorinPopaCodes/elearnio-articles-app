import '../../testing/init-test-env';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EngagementPanelComponent } from './engagement-panel.component';
import { ComponentRef } from '@angular/core';

describe('EngagementPanelComponent', () => {
  let fixture: ComponentFixture<EngagementPanelComponent>;
  let componentRef: ComponentRef<EngagementPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EngagementPanelComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(EngagementPanelComponent);
    componentRef = fixture.componentRef;
    componentRef.setInput('stats', {
      total_articles: 10,
      total_comments: 25,
      most_commented: [
        { id: 1, title: 'Popular Post', author_name: 'Author', comments_count: 8, created_at: '2026-01-01' },
        { id: 2, title: 'Another Post', author_name: 'Writer', comments_count: 5, created_at: '2026-01-02' },
      ],
    });
    fixture.detectChanges();
  });

  it('displays total articles', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('10');
    expect(el.textContent).toContain('Articles');
  });

  it('displays total comments', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('25');
    expect(el.textContent).toContain('Comments');
  });

  it('lists most commented articles', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Popular Post');
    expect(el.textContent).toContain('Another Post');
  });

  it('shows comment counts for most commented articles', () => {
    const items = fixture.nativeElement.querySelectorAll('li');
    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain('8');
    expect(items[1].textContent).toContain('5');
  });
});
