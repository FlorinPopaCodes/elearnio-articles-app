import type { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'articles', pathMatch: 'full' },
  {
    path: 'articles',
    loadComponent: () =>
      import('./pages/article-list/article-list.page').then(
        (m) => m.ArticleListPage,
      ),
  },
  {
    path: 'articles/:id',
    loadComponent: () =>
      import('./pages/article-detail/article-detail.page').then(
        (m) => m.ArticleDetailPage,
      ),
  },
  { path: '**', redirectTo: 'articles' },
];
