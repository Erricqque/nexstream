import React from 'react';
import { Link } from 'react-router-dom';

const Press = () => {
  const pressReleases = [
    {
      id: 1,
      title: 'NexStream Reaches 5 Million Creators',
      date: 'March 15, 2024',
      source: 'TechCrunch',
      excerpt: 'Content platform NexStream announced today that it has surpassed 5 million active creators...',
      link: '#'
    },
    {
      id: 2,
      title: 'NexStream Launches MLM Program for Creators',
      date: 'February 10, 2024',
      source: 'Forbes',
      excerpt: 'The platform introduces multi-level marketing opportunities for content creators...',
      link: '#'
    },
    {
      id: 3,
      title: 'NexStream Expands to 50+ Countries',
      date: 'January 5, 2024',
      source: 'Bloomberg',
      excerpt: 'Global expansion brings creator opportunities to new markets...',
      link: '#'
    }
  ];

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Press Releases</h1>
      <div style={{ display: 'grid', gap: '30px', marginTop: '40px' }}>
        {pressReleases.map(item => (
          <div key={item.id} style={{ padding: '20px', background: '#f5f5f5', borderRadius: '10px' }}>
            <small>{item.source} • {item.date}</small>
            <h2>{item.title}</h2>
            <p>{item.excerpt}</p>
            <a href={item.link} style={{ color: '#FF3366', textDecoration: 'none' }}>Read More →</a>
          </div>
        ))}
      </div>
      <Link to="/">← Back to Home</Link>
    </div>
  );
};

export default Press;