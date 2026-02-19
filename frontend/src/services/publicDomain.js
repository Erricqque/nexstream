// Public domain video sources that work with TMDb metadata
export const publicDomain = {
  // Internet Archive - largest collection
  getInternetArchiveUrl: (title) => {
    // Format title for Internet Archive search
    const searchTerm = encodeURIComponent(title.toLowerCase());
    return `https://archive.org/search.php?query=${searchTerm}`;
  },

  // Direct embed URLs for known public domain films
  getEmbedUrl: (tmdbId, title) => {
    // Map of popular public domain movies
    const publicDomainMap = {
      // Classics
      138: { // Night of the Living Dead (1968)
        url: 'https://archive.org/embed/night_of_the_living_dead',
        source: 'Internet Archive'
      },
      308: { // His Girl Friday (1940)
        url: 'https://archive.org/embed/his-girl-friday_202105',
        source: 'Internet Archive'
      },
      579: { // The Phantom of the Opera (1925)
        url: 'https://archive.org/embed/Phantom-of-the-Opera-1925',
        source: 'Internet Archive'
      },
      968: { // Nosferatu (1922)
        url: 'https://archive.org/embed/Nosferatu1922',
        source: 'Internet Archive'
      },
      265: { // Metropolis (1927)
        url: 'https://archive.org/embed/metropolis-1927',
        source: 'Internet Archive'
      },
      901: { // Safety Last! (1923)
        url: 'https://archive.org/embed/safety-last-1923',
        source: 'Internet Archive'
      }
    };

    // Check if we have a direct match
    if (publicDomainMap[tmdbId]) {
      return publicDomainMap[tmdbId];
    }

    // Try to match by title keywords
    const titleLower = title.toLowerCase();
    
    // Charlie Chaplin films
    if (titleLower.includes('charlie chaplin') || titleLower.includes('chaplin')) {
      return {
        url: `https://archive.org/search.php?query=creator%3A%22Chaplin%2C+Charlie%22`,
        source: 'Internet Archive (Chaplin Collection)'
      };
    }
    
    // Buster Keaton films
    if (titleLower.includes('buster keaton') || titleLower.includes('keaton')) {
      return {
        url: `https://archive.org/search.php?query=creator%3A%22Keaton%2C+Buster%22`,
        source: 'Internet Archive (Keaton Collection)'
      };
    }
    
    // Harold Lloyd films
    if (titleLower.includes('harold lloyd') || titleLower.includes('lloyd')) {
      return {
        url: `https://archive.org/search.php?query=creator%3A%22Lloyd%2C+Harold%22`,
        source: 'Internet Archive (Lloyd Collection)'
      };
    }

    // Generic search
    return {
      url: `https://archive.org/search.php?query=${encodeURIComponent(title)}`,
      source: 'Internet Archive',
      isSearch: true
    };
  },

  // Get multiple source options for a movie
  getSources: (tmdbId, title) => {
    return [
      publicDomain.getEmbedUrl(tmdbId, title),
      {
        url: `https://vidsrc.to/embed/movie/${tmdbId}`,
        source: 'VidSrc'
      },
      {
        url: `https://multiembed.mov/?video_id=${tmdbId}`,
        source: 'MultiEmbed'
      },
      {
        url: `https://embed.su/embed/movie/${tmdbId}`,
        source: 'Embed.su'
      }
    ];
  },

  // Check if a source is likely to work
  isLikelyWorking: (url) => {
    return url && (
      url.includes('archive.org') || 
      url.includes('vidsrc') || 
      url.includes('multiembed') ||
      url.includes('embed.su')
    );
  }
};