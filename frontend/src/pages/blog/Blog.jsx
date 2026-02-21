import React from 'react';
import { Link } from 'react-router-dom';

const Blog = () => {
  const posts = [
    {
      id: 1,
      title: '10 Tips to Grow Your Audience',
      date: 'March 20, 2024',
      author: 'Sarah Johnson',
      excerpt: 'Learn proven strategies to build and engage your audience on NexStream...'
    },
    {
      id: 2,
      title: 'Understanding MLM Commissions',
      date: 'March 18, 2024',
      author: 'Mike Wilson',
      excerpt: 'A complete guide to how our MLM program works and how you can maximize earnings...'
    },
    {
      id: 3,
      title: 'Content Creation Best Practices',
      date: 'March 15, 2024',
      author: 'Alex Chen',
      excerpt: 'Tips from top creators on producing engaging content that resonates...'
    }
  ];

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>NexStream Blog</h1>
      <div style={{ display: 'grid', gap: '30px', marginTop: '40px' }}>
        {posts.map(post => (
          <div key={post.id} style={{ padding: '20px', background: '#f5f5f5', borderRadius: '10px' }}>
            <small>{post.date} • By {post.author}</small>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
            <Link to={`/blog/${post.id}`} style={{ color: '#FF3366', textDecoration: 'none' }}>Read More →</Link>
          </div>
        ))}
      </div>
      <Link to="/">← Back to Home</Link>
    </div>
  );
};

export default Blog;