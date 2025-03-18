import React, { useState, useRef } from 'react';
import { Settings, Grid, Heart, Clock, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ArtworkCard from '../components/ArtworkCard';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence, useInView } from 'framer-motion';

function UserProfile() {
  const { user, signOut, isAdmin, isSeller, isBuyer } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('collection');
  
  const contentRef = useRef<HTMLDivElement>(null);
  const contentInView = useInView(contentRef, { once: true, amount: 0.1 });
  
  // If no user is authenticated, redirect to login
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  if (!user) {
    return null; // Don't render anything while redirecting
  }

  // Determine collections based on user type
  const collections = isSeller ? [
    {
      id: 1,
      title: "Digital Dreams",
      artist: user.full_name || user.username || 'Unknown Artist',
      price: 299,
      image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 2,
      title: "Neon Nights",
      artist: user.full_name || user.username || 'Unknown Artist',
      price: 199,
      image: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&q=80&w=800",
    },
  ] : [
    {
      id: 3,
      title: "Abstract Flow",
      artist: "Sarah Johnson",
      price: 349,
      image: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 4,
      title: "Cyberpunk City",
      artist: "James Wilson",
      price: 499,
      image: "https://images.unsplash.com/photo-1620064916958-605375619af8?auto=format&fit=crop&q=80&w=800",
    },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  // Get user role badge text based on user type
  const getUserRoleBadge = () => {
    if (isAdmin) return 'Admin';
    if (isSeller) return 'Artist';
    if (isBuyer) return 'Collector';
    return '';
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const tabVariants = {
    inactive: { opacity: 0.7, y: 0 },
    active: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    hover: { 
      opacity: 1, 
      y: -2,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="pt-20 bg-black text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-start justify-between mb-16 backdrop-blur-md bg-white/5 rounded-2xl p-8 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
        >
          <div className="flex items-center gap-8 mb-8 md:mb-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.full_name || user.username || user.email}&background=000&color=fff`}
                alt={user.full_name || user.username || user.email}
                className="w-28 h-28 rounded-full object-cover border-2 border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.15)]"
              />
            </motion.div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <motion.h1 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-4xl font-bold"
                >
                  {user.full_name || user.username || user.email.split('@')[0]}
                </motion.h1>
                <motion.span 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="px-3 py-1 backdrop-blur-md bg-white/10 rounded-full text-sm font-medium"
                >
                  {getUserRoleBadge()}
                </motion.span>
              </div>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-gray-300 mb-2"
              >
                {user.email}
              </motion.p>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-sm text-gray-400"
              >
                Member since {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </motion.p>
            </div>
          </div>
          <div className="flex gap-3">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-3 backdrop-blur-md bg-white/5 border border-white/20 rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              <Settings className="w-5 h-5" />
              <span>Edit Profile</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignOut}
              className="flex items-center gap-2 px-5 py-3 backdrop-blur-md bg-white/5 border border-white/20 rounded-lg hover:bg-white/10 text-red-400 hover:text-red-300 transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex gap-8 mb-12 border-b border-white/10 overflow-x-auto pb-1"
        >
          <motion.button 
            variants={tabVariants}
            initial="inactive"
            animate={activeTab === 'collection' ? "active" : "inactive"}
            whileHover="hover"
            className={`px-4 py-3 ${activeTab === 'collection' ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('collection')}
          >
            <Grid className="w-5 h-5 inline-block mr-2" />
            {isSeller ? 'My Artworks' : 'My Gallery'}
          </motion.button>
          <motion.button 
            variants={tabVariants}
            initial="inactive"
            animate={activeTab === 'favorites' ? "active" : "inactive"}
            whileHover="hover"
            className={`px-4 py-3 ${activeTab === 'favorites' ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('favorites')}
          >
            <Heart className="w-5 h-5 inline-block mr-2" />
            Favorites
          </motion.button>
          <motion.button 
            variants={tabVariants}
            initial="inactive"
            animate={activeTab === 'activity' ? "active" : "inactive"}
            whileHover="hover"
            className={`px-4 py-3 ${activeTab === 'activity' ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('activity')}
          >
            <Clock className="w-5 h-5 inline-block mr-2" />
            Activity
          </motion.button>
          
          {isAdmin && (
            <motion.button 
              variants={tabVariants}
              initial="inactive"
              animate={activeTab === 'admin' ? "active" : "inactive"}
              whileHover="hover"
              className={`px-4 py-3 ${activeTab === 'admin' ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('admin')}
            >
              <span className="font-medium text-white/80">Admin Panel</span>
            </motion.button>
          )}
        </motion.div>

        {/* Content Area */}
        <div ref={contentRef}>
          <AnimatePresence mode="wait">
            {/* Collection/Artwork Grid */}
            {activeTab === 'collection' && (
              <motion.div
                key="collection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-semibold">
                    {isSeller ? 'My Artworks' : 'My Gallery'}
                  </h2>
                  {isSeller && (
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/upload')}
                      className="px-5 py-3 backdrop-blur-md bg-white/90 text-black rounded-lg font-medium hover:bg-white transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                    >
                      Upload New Artwork
                    </motion.button>
                  )}
                </div>
                
                {collections.length > 0 ? (
                  <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    animate={contentInView ? "visible" : "hidden"}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  >
                    {collections.map((artwork, index) => (
                      <motion.div
                        key={artwork.id}
                        variants={fadeInUpVariants}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <ArtworkCard key={artwork.id} artwork={artwork} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div 
                    variants={fadeInUpVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-center py-16 backdrop-blur-md border border-white/10 rounded-lg bg-white/5 shadow-[0_5px_20px_rgba(0,0,0,0.2)]"
                  >
                    <p className="text-lg text-gray-300 mb-4">
                      {isSeller 
                        ? "You haven't uploaded any artwork yet." 
                        : "You haven't collected any artwork yet."}
                    </p>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => isSeller ? navigate('/upload') : navigate('/explore')}
                      className="px-6 py-3 backdrop-blur-md bg-white/90 text-black rounded-lg font-medium hover:bg-white transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                    >
                      {isSeller ? 'Upload Your First Artwork' : 'Explore Artwork'}
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            )}
            
            {/* Favorites Tab Content */}
            {activeTab === 'favorites' && (
              <motion.div
                key="favorites"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center py-16 backdrop-blur-md border border-white/10 rounded-lg bg-white/5 shadow-[0_5px_20px_rgba(0,0,0,0.2)]"
              >
                <p className="text-lg text-gray-300 mb-4">You haven't favorited any artwork yet.</p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/explore')}
                  className="px-6 py-3 backdrop-blur-md bg-white/90 text-black rounded-lg font-medium hover:bg-white transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                >
                  Explore Artwork
                </motion.button>
              </motion.div>
            )}
            
            {/* Activity Tab Content */}
            {activeTab === 'activity' && (
              <motion.div
                key="activity"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <motion.div 
                  variants={fadeInUpVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 }}
                  className="p-6 backdrop-blur-md border border-white/10 rounded-lg bg-white/5 shadow-[0_5px_20px_rgba(0,0,0,0.15)] hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="text-white font-medium">
                        {isSeller ? 'Artwork sold' : 'Artwork purchased'}: Digital Dreams
                      </p>
                      <p className="text-gray-400 text-sm">Price: $299</p>
                    </div>
                    <p className="text-gray-500 text-sm">Today</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  variants={fadeInUpVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                  className="p-6 backdrop-blur-md border border-white/10 rounded-lg bg-white/5 shadow-[0_5px_20px_rgba(0,0,0,0.15)] hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="text-white font-medium">Profile updated</p>
                      <p className="text-gray-400 text-sm">You changed your profile information</p>
                    </div>
                    <p className="text-gray-500 text-sm">Yesterday</p>
                  </div>
                </motion.div>
              </motion.div>
            )}
            
            {/* Admin Panel Tab Content */}
            {activeTab === 'admin' && isAdmin && (
              <motion.div
                key="admin"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <motion.div 
                  variants={fadeInUpVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 }}
                  className="p-8 backdrop-blur-md border border-white/10 rounded-lg bg-white/5 shadow-[0_5px_20px_rgba(0,0,0,0.15)]"
                >
                  <h3 className="text-xl font-semibold mb-6">Platform Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.div 
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="p-6 backdrop-blur-md bg-white/10 rounded-lg border border-white/5 shadow-[0_5px_15px_rgba(0,0,0,0.1)]"
                    >
                      <p className="text-gray-300 text-sm mb-2">Total Users</p>
                      <p className="text-3xl font-bold">148</p>
                    </motion.div>
                    <motion.div 
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="p-6 backdrop-blur-md bg-white/10 rounded-lg border border-white/5 shadow-[0_5px_15px_rgba(0,0,0,0.1)]"
                    >
                      <p className="text-gray-300 text-sm mb-2">Total Artworks</p>
                      <p className="text-3xl font-bold">527</p>
                    </motion.div>
                    <motion.div 
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="p-6 backdrop-blur-md bg-white/10 rounded-lg border border-white/5 shadow-[0_5px_15px_rgba(0,0,0,0.1)]"
                    >
                      <p className="text-gray-300 text-sm mb-2">Total Sales</p>
                      <p className="text-3xl font-bold">$24,860</p>
                    </motion.div>
                  </div>
                </motion.div>
                
                <motion.div 
                  variants={fadeInUpVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                  className="p-8 backdrop-blur-md border border-white/10 rounded-lg bg-white/5 shadow-[0_5px_20px_rgba(0,0,0,0.15)]"
                >
                  <h3 className="text-xl font-semibold mb-6">User Management</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">User</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Email</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Role</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <motion.tr 
                          variants={fadeInUpVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: 0.3 }}
                          className="border-b border-white/10"
                        >
                          <td className="py-4 px-4">John Doe</td>
                          <td className="py-4 px-4">user@example.com</td>
                          <td className="py-4 px-4">Collector</td>
                          <td className="py-4 px-4">
                            <motion.button 
                              whileHover={{ scale: 1.05 }}
                              className="text-sm text-white/70 hover:text-white px-3 py-1 backdrop-blur-md bg-white/10 rounded-md hover:bg-white/20 transition-all duration-300"
                            >
                              Edit
                            </motion.button>
                          </td>
                        </motion.tr>
                        <motion.tr 
                          variants={fadeInUpVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: 0.4 }}
                          className="border-b border-white/10"
                        >
                          <td className="py-4 px-4">Jane Artist</td>
                          <td className="py-4 px-4">artist@example.com</td>
                          <td className="py-4 px-4">Artist</td>
                          <td className="py-4 px-4">
                            <motion.button 
                              whileHover={{ scale: 1.05 }}
                              className="text-sm text-white/70 hover:text-white px-3 py-1 backdrop-blur-md bg-white/10 rounded-md hover:bg-white/20 transition-all duration-300"
                            >
                              Edit
                            </motion.button>
                          </td>
                        </motion.tr>
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;