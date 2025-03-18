import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Check, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

// Categories for digital art
const categories = [
  "Digital Painting",
  "3D Art",
  "Pixel Art",
  "Vector Art",
  "AI Generated",
  "Photography",
  "NFT",
  "Concept Art",
  "Game Art",
  "Other"
];

// License options
const licenseOptions = [
  { id: "personal", name: "Personal Use", description: "For personal, non-commercial use only" },
  { id: "commercial", name: "Commercial License", description: "For commercial projects with limited distribution" },
  { id: "extended", name: "Extended Commercial", description: "Unlimited commercial usage rights" },
];

const UploadArtwork = () => {
  const { user, isSeller } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [selectedLicenses, setSelectedLicenses] = useState<string[]>(['personal']);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Check if user is authenticated and is a seller
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!isSeller) {
      // If user is not a seller, redirect to profile page
      navigate('/profile');
    }
  }, [user, isSeller, navigate]);

  // If user is not authenticated or not a seller, don't render the form
  if (!user || !isSeller) {
    return null;
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file type
      const validFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validFileTypes.includes(selectedFile.type)) {
        setError('Please upload a valid image file (JPEG, PNG, GIF, WEBP)');
        return;
      }
      
      // Check file size (limit to 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      
      // Check file type
      const validFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validFileTypes.includes(droppedFile.type)) {
        setError('Please upload a valid image file (JPEG, PNG, GIF, WEBP)');
        return;
      }
      
      // Check file size (limit to 10MB)
      if (droppedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      setFile(droppedFile);
      setFilePreview(URL.createObjectURL(droppedFile));
      setError(null);
    }
  };

  const toggleLicense = (licenseId: string) => {
    setSelectedLicenses(prev => {
      if (prev.includes(licenseId)) {
        return prev.filter(id => id !== licenseId);
      } else {
        return [...prev, licenseId];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please upload an artwork file');
      return;
    }
    
    if (!title || !description || !price || !category || selectedLicenses.length === 0) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    try {
      // 1. Upload image to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${user!.id}/${fileName}`;
      
      // Example upload to Supabase Storage (commented out for now)
      /*
      const { error: uploadError } = await supabase.storage
        .from('artworks')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // 2. Get the public URL
      const { data: urlData } = supabase.storage
        .from('artworks')
        .getPublicUrl(filePath);
        
      const publicUrl = urlData.publicUrl;
      
      // 3. Save artwork metadata to database
      const { error: insertError } = await supabase
        .from('artworks')
        .insert({
          title,
          description,
          price: parseFloat(price),
          category,
          tags: tags.split(',').map(tag => tag.trim()),
          user_id: user.id,
          image_url: publicUrl,
          license_options: selectedLicenses
        });
        
      if (insertError) throw insertError;
      */
      
      // For now, just simulate a successful upload
      console.log('Uploaded artwork:', {
        title,
        description,
        price,
        category,
        tags: tags.split(',').map(tag => tag.trim()),
        licenses: selectedLicenses,
        filePath
      });
      
      // Navigate to the user profile or artwork page
      setTimeout(() => {
        navigate('/profile');
      }, 1000);
      
    } catch (error: any) {
      console.error('Error uploading artwork:', error);
      setError(error.message || 'Error uploading artwork');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8">Upload Artwork</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Artwork Upload Area */}
          <div 
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dragActive 
                ? 'border-white bg-white/5' 
                : filePreview 
                  ? 'border-green-500/50 bg-green-500/5' 
                  : 'border-white/30 hover:border-white/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/jpeg,image/png,image/gif,image/webp"
            />
            
            {filePreview ? (
              <div className="relative">
                <img 
                  src={filePreview} 
                  alt="Artwork preview" 
                  className="max-h-80 mx-auto rounded-lg object-contain"
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setFilePreview(null);
                    }}
                    className="p-2 bg-black/70 rounded-full hover:bg-black transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-center text-green-400">
                  <Check className="w-5 h-5 mr-2" />
                  <span>File selected: {file?.name}</span>
                </div>
              </div>
            ) : (
              <div className="py-12">
                <Upload className="w-12 h-12 mx-auto mb-4 text-white/70" />
                <h3 className="text-xl font-medium mb-2">Drag and drop your artwork</h3>
                <p className="text-gray-400 mb-4">Supported formats: JPEG, PNG, GIF, WEBP (max 10MB)</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  Browse Files
                </button>
              </div>
            )}
          </div>
          
          {/* Artwork Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  Title *
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/40"
                  placeholder="Give your artwork a title"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/40 resize-none"
                  placeholder="Describe your artwork"
                />
              </div>
              
              <div>
                <label htmlFor="price" className="block text-sm font-medium mb-2">
                  Base Price (USD) *
                </label>
                <input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/40"
                  placeholder="Set a base price"
                />
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/40"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="tags" className="block text-sm font-medium mb-2">
                  Tags (comma separated)
                </label>
                <input
                  id="tags"
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/40"
                  placeholder="abstract, colorful, landscape"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-3">
                  License Options *
                </label>
                <div className="space-y-2">
                  {licenseOptions.map((license) => (
                    <div 
                      key={license.id}
                      className="flex items-center p-3 border border-white/20 rounded-lg cursor-pointer hover:border-white/40 transition-colors"
                      onClick={() => toggleLicense(license.id)}
                    >
                      <div className={`w-5 h-5 rounded-sm mr-3 flex items-center justify-center ${
                        selectedLicenses.includes(license.id) ? 'bg-white' : 'border border-white/40'
                      }`}>
                        {selectedLicenses.includes(license.id) && (
                          <Check className="w-4 h-4 text-black" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{license.name}</h4>
                        <p className="text-xs text-gray-400">{license.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-6">
            <div className="flex items-center text-gray-400 text-sm">
              <Info className="w-4 h-4 mr-2" />
              Fields marked with * are required
            </div>
            <button
              type="submit"
              disabled={isUploading}
              className={`px-8 py-3 bg-white text-black rounded-lg font-medium transition-opacity ${isUploading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}
            >
              {isUploading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </span>
              ) : (
                'Upload Artwork'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default UploadArtwork; 