import { Post } from "../models/Post.js";

export class BlogService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async getPosts(offset, limit) {
    const res = await fetch(
      `${this.baseUrl}/blog-posts?offset=${offset}&limit=${limit}`
    );
    if (!res.ok) throw new Error(res.status);

    const data = await res.json();
    return {
      total: data.total_blogs,
      posts: data.blogs.map(
        (p) =>
          new Post(
            p.id,
            p.title,
            p.category,
            p.content_text,
            p.content_html,
            p.photo_url
          )
      ),
    };
  }

  async getPostById(id) {
    const res = await fetch(`${this.baseUrl}/blog-posts/${id}`);
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    const data = await res.json();
    const p = data.blog;
    return new Post(
      p.id,
      p.title,
      p.category,
      p.content_text,
      p.content_html,
      p.photo_url
    );
  }
}
