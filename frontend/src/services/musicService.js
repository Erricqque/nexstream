export const musicService = {
  // Free music from various sources
  tracks: [
    {
      id: 1,
      title: "Inspiring Acoustic Guitar",
      artist: "Creative Commons",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      thumbnail: "https://via.placeholder.com/300x300?text=Music",
      genre: "Acoustic"
    },
    {
      id: 2,
      title: "Electronic Dreams",
      artist: "FMA",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      thumbnail: "https://via.placeholder.com/300x300?text=Electronic",
      genre: "Electronic"
    },
    {
      id: 3,
      title: "Jazz Relaxation",
      artist: "Free Music Archive",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      thumbnail: "https://via.placeholder.com/300x300?text=Jazz",
      genre: "Jazz"
    },
    {
      id: 4,
      title: "Lo-Fi Study Beats",
      artist: "Chillhop",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      thumbnail: "https://via.placeholder.com/300x300?text=Lo-Fi",
      genre: "Lo-Fi"
    },
    {
      id: 5,
      title: "Classical Piano",
      artist: "Musopen",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      thumbnail: "https://via.placeholder.com/300x300?text=Classical",
      genre: "Classical"
    },
    {
      id: 6,
      title: "Ambient Soundscapes",
      artist: "Freesound",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
      thumbnail: "https://via.placeholder.com/300x300?text=Ambient",
      genre: "Ambient"
    }
  ],

  getAll: () => musicService.tracks,

  search: (query) => {
    const q = query.toLowerCase();
    return musicService.tracks.filter(t => 
      t.title.toLowerCase().includes(q) ||
      t.artist.toLowerCase().includes(q) ||
      t.genre.toLowerCase().includes(q)
    );
  },

  getByGenre: (genre) => {
    if (genre === 'all') return musicService.tracks;
    return musicService.tracks.filter(t => t.genre === genre);
  },

  getGenres: () => {
    return ['all', ...new Set(musicService.tracks.map(t => t.genre))];
  }
};