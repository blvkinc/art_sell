import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';

interface Artist {
  id: number;
  name: string;
  image: string;
  artworks: number;
  followers: number;
}

function Artists() {
  const artistsRef = useRef<HTMLDivElement>(null);
  const artistsInView = useInView(artistsRef, { once: true, amount: 0.1 });

  const artists: Artist[] = [
    {
      id: 1,
      name: "Elena Chen",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
      artworks: 24,
      followers: 1200,
    },
    {
      id: 2,
      name: "Marcus Rivera",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
      artworks: 18,
      followers: 850,
    },
    {
      id: 3,
      name: "Sarah Johnson",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400",
      artworks: 32,
      followers: 2100,
    },
    {
      id: 4,
      name: "James Wilson",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
      artworks: 27,
      followers: 1850,
    },
    {
      id: 5,
      name: "Mai Takahashi",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
      artworks: 19,
      followers: 975,
    },
    {
      id: 6,
      name: "David Rodriguez",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400",
      artworks: 15,
      followers: 720,
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="pt-20 bg-black text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h1 className="text-5xl font-bold tracking-tight mb-6">Featured Artists</h1>
          <p className="text-gray-300 text-xl max-w-3xl">
            Discover the talented artists behind our collection of unique digital artwork, each bringing their own style and vision to the platform.
          </p>
        </motion.div>
        
        <div ref={artistsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artists.map((artist, index) => (
            <motion.div
              key={artist.id}
              variants={cardVariants}
              initial="hidden"
              animate={artistsInView ? "visible" : "hidden"}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={`/artists/${artist.id}`}
                className="block backdrop-blur-md bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300 shadow-[0_5px_15px_rgba(0,0,0,0.2)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.3)] group"
              >
                <div className="relative h-48 overflow-hidden">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      src={artist.image}
                      alt={artist.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white/30 shadow-[0_0_10px_rgba(255,255,255,0.15)]"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-white group-hover:text-white transition-colors">
                        {artist.name}
                      </h3>
                      <p className="text-gray-300 text-sm">Digital Artist</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm border-t border-white/10 pt-4">
                    <div>
                      <p className="text-gray-400 mb-1">Artworks</p>
                      <p className="font-semibold text-white text-lg">{artist.artworks}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Followers</p>
                      <p className="font-semibold text-white text-lg">{artist.followers}</p>
                    </div>
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 backdrop-blur-md bg-white/10 rounded-full text-white text-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
                    >
                      View
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Artists;