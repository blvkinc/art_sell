import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Share2, Download } from 'lucide-react';

// Mock artwork data - would be fetched from an API in a real application
const mockArtwork = {
  id: '1',
  title: 'Cosmic Wanderer',
  description: 'A journey through the cosmos, exploring the beauty of distant nebulae and star systems.',
  price: 0.85,
  artist: {
    id: 'artist1',
    name: 'Elena Cosmos',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    bio: 'Digital artist specializing in cosmic and space-themed digital art'
  },
  imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
  createdAt: '2023-05-15',
  medium: 'Digital Art',
  tags: ['space', 'cosmos', 'digital', 'nebula'],
  edition: '1 of 10',
  dimensions: '4000 x 3000 px',
  licenseOptions: [
    { id: '1', name: 'Personal Use', price: 0.85, description: 'Use for personal, non-commercial purposes' },
    { id: '2', name: 'Commercial', price: 3.5, description: 'Use for commercial projects with attribution' },
    { id: '3', name: 'Exclusive', price: 12.0, description: 'Full exclusive rights to the artwork' }
  ]
};

const ArtworkDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedLicense, setSelectedLicense] = useState(mockArtwork.licenseOptions[0].id);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // This would fetch artwork data based on ID in a real application
  const artwork = mockArtwork;
  
  const handleLicenseChange = (licenseId: string) => {
    setSelectedLicense(licenseId);
  };

  const selectedLicenseOption = artwork.licenseOptions.find(option => option.id === selectedLicense);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div className="pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <Link 
          to="/explore" 
          className="inline-flex items-center text-gray-400 hover:text-white mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Explore
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Artwork Image */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative aspect-square overflow-hidden rounded-2xl"
          >
            <img 
              src={artwork.imageUrl} 
              alt={artwork.title} 
              className="w-full h-full object-cover" 
            />
            
            {/* Image protective overlay to prevent easy saving */}
            <div className="absolute inset-0 bg-transparent pointer-events-none"></div>
          </motion.div>
          
          {/* Artwork Details */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-4xl font-bold text-white">{artwork.title}</h1>
              <Link to={`/artists/${artwork.artist.name.toLowerCase().replace(' ', '-')}`} className="text-gray-300 hover:text-white text-lg">
                by {artwork.artist.name}
              </Link>
            </div>
            
            <p className="text-gray-300 leading-relaxed">
              {artwork.description}
            </p>
            
            <div className="grid grid-cols-2 gap-y-4">
              <div>
                <p className="text-gray-400 text-sm">Creation Date</p>
                <p className="text-white">{new Date(artwork.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Medium</p>
                <p className="text-white">{artwork.medium}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Dimensions</p>
                <p className="text-white">{artwork.dimensions}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Edition</p>
                <p className="text-white">{artwork.edition}</p>
              </div>
            </div>
            
            <div className="pt-6 border-t border-white/10">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-gray-400 text-sm">Current Price</p>
                  <p className="text-3xl font-bold text-white">${artwork.price}</p>
                </div>
                <div className="flex space-x-3">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLike}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isLiked 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                    } border border-white/10 transition-colors duration-300`}
                  >
                    <Heart className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} />
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10 transition-colors duration-300"
                  >
                    <Share2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
              
              <div className="flex gap-4">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 backdrop-blur-md bg-white/90 text-black rounded-lg font-medium hover:bg-white transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                >
                  Buy Now
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 flex items-center justify-center backdrop-blur-md bg-white/5 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Preview
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Additional sections could be added here: reviews, similar artwork, etc. */}
    </div>
  );
};

export default ArtworkDetail; 