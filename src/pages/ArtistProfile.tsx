import React from 'react';
import { useParams } from 'react-router-dom';
import { Instagram, Twitter, Globe } from 'lucide-react';
import ArtworkCard from '../components/ArtworkCard';

function ArtistProfile() {
  const { id } = useParams();

  // Mock data - in a real app, fetch based on id
  const artist = {
    id: 1,
    name: "Elena Chen",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
    bio: "Digital artist specializing in abstract and surreal artwork. Based in San Francisco, CA.",
    followers: 1200,
    following: 245,
    artworks: 24,
    socialLinks: {
      instagram: "https://instagram.com",
      twitter: "https://twitter.com",
      website: "https://example.com",
    },
  };

  const artworks = [
    {
      id: 1,
      title: "Digital Dreams",
      artist: "Elena Chen",
      price: 299,
      image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 2,
      title: "Neon Nights",
      artist: "Elena Chen",
      price: 199,
      image: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 3,
      title: "Abstract Flow",
      artist: "Elena Chen",
      price: 349,
      image: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=800",
    },
  ];

  return (
    <div className="pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Artist Header */}
        <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
          <img
            src={artist.image}
            alt={artist.name}
            className="w-32 h-32 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2">{artist.name}</h1>
                <p className="text-gray-400 mb-4">{artist.bio}</p>
                <div className="flex gap-4">
                  <a href={artist.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href={artist.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href={artist.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                    <Globe className="w-5 h-5" />
                  </a>
                </div>
              </div>
              <button className="px-6 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors">
                Follow
              </button>
            </div>
            
            <div className="flex gap-8 mt-6">
              <div>
                <p className="text-2xl font-bold">{artist.artworks}</p>
                <p className="text-gray-400">Artworks</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{artist.followers}</p>
                <p className="text-gray-400">Followers</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{artist.following}</p>
                <p className="text-gray-400">Following</p>
              </div>
            </div>
          </div>
        </div>

        {/* Artist's Artworks */}
        <h2 className="text-2xl font-bold mb-8">Latest Artworks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artworks.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ArtistProfile;