// gamesService.js - Professional game integration service
export const gamesService = {
  // Curated list of popular games with direct embed URLs
  games: [
    {
      id: 1,
      title: "Shell Shockers",
      description: "Multiplayer first-person shooter where you play as an egg!",
      thumbnail: "https://images.crazygames.com/shell-shockers/cover.png",
      embedUrl: "https://www.crazygames.com/embed/shell-shockers",
      category: "shooter",
      popularity: 1000000,
      controls: "WASD to move, Left Click to shoot",
      multiplayer: true
    },
    {
      id: 2,
      title: "Paper.io 2",
      description: "Conquer territory and eliminate opponents",
      thumbnail: "https://images.crazygames.com/paperio2/cover.png",
      embedUrl: "https://www.crazygames.com/embed/paper-io-2",
      category: "io",
      popularity: 850000,
      multiplayer: true
    },
    {
      id: 3,
      title: "Krunker.io",
      description: "Fast-paced FPS with parkour elements",
      thumbnail: "https://images.crazygames.com/krunker/cover.png",
      embedUrl: "https://www.crazygames.com/embed/krunker",
      category: "shooter",
      popularity: 950000,
      multiplayer: true
    },
    {
      id: 4,
      title: "Agar.io",
      description: "Grow your cell by consuming smaller players",
      thumbnail: "https://images.crazygames.com/agario/cover.png",
      embedUrl: "https://www.crazygames.com/embed/agario",
      category: "io",
      popularity: 890000,
      multiplayer: true
    },
    {
      id: 5,
      title: "Slither.io",
      description: "Classic snake game with multiplayer",
      thumbnail: "https://images.crazygames.com/slitherio/cover.png",
      embedUrl: "https://www.crazygames.com/embed/slither-io",
      category: "io",
      popularity: 780000,
      multiplayer: true
    },
    {
      id: 6,
      title: "2048",
      description: "Merge numbers to reach 2048",
      thumbnail: "https://images.crazygames.com/2048/cover.png",
      embedUrl: "https://www.crazygames.com/embed/2048",
      category: "puzzle",
      popularity: 670000,
      multiplayer: false
    },
    {
      id: 7,
      title: "Run 3",
      description: "Endless runner in space",
      thumbnail: "https://images.crazygames.com/run3/cover.png",
      embedUrl: "https://www.crazygames.com/embed/run-3",
      category: "runner",
      popularity: 720000,
      multiplayer: false
    },
    {
      id: 8,
      title: "Moto X3M",
      description: "Motorcycle stunt racing game",
      thumbnail: "https://images.crazygames.com/motox3m/cover.png",
      embedUrl: "https://www.crazygames.com/embed/moto-x3m",
      category: "racing",
      popularity: 690000,
      multiplayer: false
    },
    {
      id: 9,
      title: "Subway Surfers",
      description: "Endless runner classic",
      thumbnail: "https://images.crazygames.com/subway-surfers/cover.png",
      embedUrl: "https://www.crazygames.com/embed/subway-surfers",
      category: "runner",
      popularity: 980000,
      multiplayer: false
    },
    {
      id: 10,
      title: "Temple Run 2",
      description: "Run from the demon monkey",
      thumbnail: "https://images.crazygames.com/temple-run-2/cover.png",
      embedUrl: "https://www.crazygames.com/embed/temple-run-2",
      category: "runner",
      popularity: 870000,
      multiplayer: false
    }
  ],

  // Get all games
  getAll: () => gamesService.games,

  // Get games by category
  getByCategory: (category) => {
    if (category === 'all') return gamesService.games;
    return gamesService.games.filter(g => g.category === category);
  },

  // Get game by ID
  getById: (id) => gamesService.games.find(g => g.id === parseInt(id)),

  // Search games
  searchGames: (query) => {
    const q = query.toLowerCase();
    return gamesService.games.filter(g => 
      g.title.toLowerCase().includes(q) || 
      g.description.toLowerCase().includes(q)
    );
  },

  // Get all categories
  getCategories: () => {
    const categories = ['all', ...new Set(gamesService.games.map(g => g.category))];
    return categories;
  },

  // Get featured games (most popular)
  getFeatured: () => {
    return [...gamesService.games].sort((a, b) => b.popularity - a.popularity).slice(0, 6);
  },

  // Get multiplayer games
  getMultiplayer: () => {
    return gamesService.games.filter(g => g.multiplayer);
  }
};