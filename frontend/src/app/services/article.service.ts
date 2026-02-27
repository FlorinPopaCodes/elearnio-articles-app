import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { Article, ArticleDetail, Comment } from '../types';

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private http = inject(HttpClient);

  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>('/api/articles');
  }

  getArticle(id: number): Observable<ArticleDetail> {
    return this.http.get<ArticleDetail>(`/api/articles/${id}`);
  }

  createArticle(payload: {
    article: { title: string; body: string; author_name: string };
  }): Observable<ArticleDetail> {
    return this.http.post<ArticleDetail>('/api/articles', payload);
  }

  getComments(articleId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`/api/articles/${articleId}/comments`);
  }

  createComment(
    articleId: number,
    payload: { comment: { body: string; author_name: string } },
  ): Observable<Comment> {
    return this.http.post<Comment>(
      `/api/articles/${articleId}/comments`,
      payload,
    );
  }
}
