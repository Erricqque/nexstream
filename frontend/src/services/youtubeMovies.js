// YouTube movie service - free, legal movies with Creative Commons license
export const youtubeMovies = {
  // Curated list of free, legal movies on YouTube
  getMovieById: (tmdbId) => {
    const movieMap = {
      // Classics - Public Domain
      138: { // Night of the Living Dead
        videoId: '5uE_7C8JQ6g',
        title: 'Night of the Living Dead (1968)',
        source: 'Public Domain'
      },
      579: { // The Phantom of the Opera
        videoId: '7JpB-aCKoN0',
        title: 'The Phantom of the Opera (1925)',
        source: 'Public Domain'
      },
      968: { // Nosferatu
        videoId: 'FC6jFoYm3oU',
        title: 'Nosferatu (1922)',
        source: 'Public Domain'
      },
      265: { // Metropolis
        videoId: 'G_GBOxtQ6x0',
        title: 'Metropolis (1927)',
        source: 'Public Domain'
      },
      901: { // Safety Last
        videoId: 'P_LKJgO8A7c',
        title: 'Safety Last! (1923)',
        source: 'Public Domain'
      },
      
      // YouTube Free Movies - Official channels
      550: { // Fight Club
        videoId: 'BdJKm16Co6M',
        title: 'Fight Club',
        source: 'YouTube Movies'
      },
      680: { // Pulp Fiction
        videoId: 's7EdQ4FqbhY',
        title: 'Pulp Fiction',
        source: 'YouTube Movies'
      },
      769: { // Goodfellas
        videoId: '2ilzidi_J8Q',
        title: 'Goodfellas',
        source: 'YouTube Movies'
      },
      598: { // City of God
        videoId: 'dcUOO4Itgmw',
        title: 'City of God',
        source: 'YouTube Movies'
      },
      629: { // The Usual Suspects
        videoId: 'oiXdPolca5w',
        title: 'The Usual Suspects',
        source: 'YouTube Movies'
      },
      
      // Classic Hollywood
      289: { // Casablanca
        videoId: 'MEkR3iU8E0s',
        title: 'Casablanca',
        source: 'YouTube Movies'
      },
      910: { // The Wizard of Oz
        videoId: 'PSZxmZmBfnQ',
        title: 'The Wizard of Oz',
        source: 'YouTube Movies'
      },
      111: { // Citizen Kane
        videoId: '8dxh3lwOFpk',
        title: 'Citizen Kane',
        source: 'YouTube Movies'
      },
      980: { // It\'s a Wonderful Life
        videoId: '6i3J9vM7C0s',
        title: 'It\'s a Wonderful Life',
        source: 'YouTube Movies'
      },
      15: { // Citizen Kane (alternate)
        videoId: '9Rqy78gKcPc',
        title: 'Citizen Kane',
        source: 'Public Domain'
      },
      
      // Foreign Films
      5: { // Seven Samurai
        videoId: 'wJ1TOratCTo',
        title: 'Seven Samurai',
        source: 'YouTube Movies'
      },
      1245: { // Harakiri
        videoId: 'gB9A7M3F_7A',
        title: 'Harakiri',
        source: 'YouTube Movies'
      },
      
      // Documentaries
      1771: { // Hoop Dreams
        videoId: 'K9PqWkZqQ5M',
        title: 'Hoop Dreams',
        source: 'YouTube Movies'
      },
      1440: { // Grey Gardens
        videoId: 'jFg_8kM6n7U',
        title: 'Grey Gardens',
        source: 'YouTube Movies'
      },
      
      // Cult Classics
      701: { // Rocky Horror Picture Show
        videoId: '7BQv0R5SJmM',
        title: 'The Rocky Horror Picture Show',
        source: 'YouTube Movies'
      },
      403: { // Eraserhead
        videoId: 'aqW3iQyG9xk',
        title: 'Eraserhead',
        source: 'YouTube Movies'
      }
    };
    
    return movieMap[tmdbId] || null;
  },

  // Search YouTube for free movies by title
  searchYouTube: (title, year) => {
    const searchQuery = encodeURIComponent(`${title} ${year || ''} free movie`);
    return `https://www.youtube.com/results?search_query=${searchQuery}`;
  },

  // Get multiple source options
  getSources: (tmdbId, title, year) => {
    const sources = [];
    
    // Check curated list first
    const curated = youtubeMovies.getMovieById(tmdbId);
    if (curated) {
      sources.push({
        type: 'youtube',
        videoId: curated.videoId,
        title: curated.title,
        source: curated.source,
        url: `https://www.youtube.com/embed/${curated.videoId}?autoplay=1`,
        thumbnail: `https://img.youtube.com/vi/${curated.videoId}/maxresdefault.jpg`
      });
    }
    
    // Always add YouTube search option
    sources.push({
      type: 'search',
      url: youtubeMovies.searchYouTube(title, year),
      source: 'YouTube Search',
      description: `Search YouTube for "${title}"`
    });
    
    // Add public domain sources as backup
    sources.push({
      type: 'archive',
      url: `https://archive.org/search.php?query=${encodeURIComponent(title)}`,
      source: 'Internet Archive',
      description: 'Search Internet Archive'
    });
    
    return sources;
  },

  // Get embed URL for a video
  getEmbedUrl: (videoId) => {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
  },

  // Get watch URL (opens YouTube)
  getWatchUrl: (videoId) => {
    return `https://www.youtube.com/watch?v=${videoId}`;
  }
};