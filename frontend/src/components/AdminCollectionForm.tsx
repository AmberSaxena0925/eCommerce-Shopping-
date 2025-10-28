import { useState } from 'react';
import { X } from 'lucide-react';

interface AdminCollectionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5001';

export default function AdminCollectionForm({ isOpen, onClose, onSuccess }: AdminCollectionFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    featured: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData({ ...formData, slug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const collectionData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        image_url: formData.image_url,
        featured: formData.featured,
      };

      const res = await fetch(`${API_BASE}/api/admin/collections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(collectionData),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to create collection');
      }

      setSuccess('Collection created successfully!');
      
      // Reset form
      setFormData({
        name: '',
        slug: '',
        description: '',
        image_url: '',
        featured: false,
      });

      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to create collection');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50">
        <div className="bg-zinc-950 border border-zinc-800 p-8 m-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-light tracking-widest text-white">
              ADD COLLECTION
            </h2>
            <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-900 text-red-400 px-4 py-3 mb-6 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-900/20 border border-green-900 text-green-400 px-4 py-3 mb-6 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-zinc-400 text-sm mb-2 tracking-wider">
                COLLECTION NAME *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-black border border-zinc-800 px-4 py-3 text-white focus:border-white focus:outline-none transition-colors"
                placeholder="Luxury Collection"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-zinc-400 text-sm mb-2 tracking-wider">
                SLUG * (URL-friendly name)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  className="flex-1 bg-black border border-zinc-800 px-4 py-3 text-white focus:border-white focus:outline-none transition-colors"
                  placeholder="luxury-collection"
                />
                <button
                  type="button"
                  onClick={generateSlug}
                  className="bg-zinc-900 text-white px-4 py-3 border border-zinc-800 hover:border-white transition-colors"
                >
                  Generate
                </button>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-zinc-400 text-sm mb-2 tracking-wider">
                DESCRIPTION
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full bg-black border border-zinc-800 px-4 py-3 text-white focus:border-white focus:outline-none transition-colors resize-none"
                placeholder="Collection description..."
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-zinc-400 text-sm mb-2 tracking-wider">
                IMAGE URL *
              </label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                required
                className="w-full bg-black border border-zinc-800 px-4 py-3 text-white focus:border-white focus:outline-none transition-colors"
                placeholder="https://example.com/collection-image.jpg"
              />
            </div>

            {/* Featured Checkbox */}
            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-5 h-5 bg-black border border-zinc-800 text-white focus:ring-0"
                />
                <span className="text-zinc-400 text-sm tracking-wider">FEATURED COLLECTION</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black py-4 tracking-widest hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'CREATING...' : 'CREATE COLLECTION'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}