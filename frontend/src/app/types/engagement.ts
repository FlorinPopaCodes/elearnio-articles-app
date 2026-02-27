import type { Article } from './article';

export interface Engagement {
  total_articles: number;
  total_comments: number;
  most_commented: Article[];
}
