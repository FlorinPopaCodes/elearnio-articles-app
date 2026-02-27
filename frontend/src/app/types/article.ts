export interface Article {
  id: number;
  title: string;
  author_name: string;
  comments_count: number;
  created_at: string;
}

export interface ArticleDetail extends Article {
  body: string;
}
