import '../testing/init-test-env';
import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { EngagementService } from './engagement.service';

describe('EngagementService', () => {
  let service: EngagementService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(EngagementService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('fetches engagement stats', () => {
    const mockStats = {
      total_articles: 5,
      total_comments: 12,
      most_commented: [
        {
          id: 1,
          title: 'Popular',
          author_name: 'Author',
          comments_count: 8,
          created_at: '2026-01-01',
        },
      ],
    };

    service.getStats().subscribe((stats) => {
      expect(stats).toEqual(mockStats);
    });

    TestBed.flushEffects();

    const req = httpMock.expectOne('/api/engagement');
    expect(req.request.method).toBe('GET');
    req.flush(mockStats);
  });
});
