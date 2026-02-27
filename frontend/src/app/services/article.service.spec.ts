import '../testing/init-test-env';
import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ArticleService } from './article.service';

describe('ArticleService', () => {
  let service: ArticleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ArticleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('fetches articles list', () => {
    const mockArticles = [
      {
        id: 1,
        title: 'Test',
        author_name: 'Author',
        comments_count: 0,
        created_at: '2026-01-01',
      },
    ];

    service.getArticles().subscribe((articles) => {
      expect(articles).toEqual(mockArticles);
    });

    const req = httpMock.expectOne('/api/articles');
    expect(req.request.method).toBe('GET');
    req.flush(mockArticles);
  });

  it('fetches a single article', () => {
    const mockArticle = {
      id: 1,
      title: 'Test',
      body: 'Content',
      author_name: 'Author',
      comments_count: 0,
      created_at: '2026-01-01',
    };

    service.getArticle(1).subscribe((article) => {
      expect(article).toEqual(mockArticle);
    });

    const req = httpMock.expectOne('/api/articles/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockArticle);
  });

  it('creates an article', () => {
    const payload = {
      article: { title: 'New', body: 'Body', author_name: 'Me' },
    };

    service.createArticle(payload).subscribe((article) => {
      expect(article.title).toBe('New');
    });

    const req = httpMock.expectOne('/api/articles');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ id: 1, ...payload.article, comments_count: 0, created_at: '2026-01-01' });
  });

  it('fetches comments for an article', () => {
    const mockComments = [
      { id: 1, body: 'Nice!', author_name: 'Reader', created_at: '2026-01-01' },
    ];

    service.getComments(5).subscribe((comments) => {
      expect(comments).toEqual(mockComments);
    });

    const req = httpMock.expectOne('/api/articles/5/comments');
    expect(req.request.method).toBe('GET');
    req.flush(mockComments);
  });

  it('creates a comment', () => {
    const payload = { comment: { body: 'Great post!', author_name: 'Reader' } };

    service.createComment(5, payload).subscribe((comment) => {
      expect(comment.body).toBe('Great post!');
    });

    const req = httpMock.expectOne('/api/articles/5/comments');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({ id: 1, ...payload.comment, created_at: '2026-01-01' });
  });
});
