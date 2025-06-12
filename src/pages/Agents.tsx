import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { User, UserCog, Phone, Mail, Hash } from 'lucide-react';
import ChangePassword from '../components/ChangePassword';

const AgentsPage = () => {
  const { session } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    sponsor_email: '',
    rsac_number: '',
    role: 'agent'
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (session?.user) {
      const metadata = session.user.user_metadata || {};
      setFormData({
        first_name: metadata.first_name || '',
        last_name: metadata.last_name || '',
        phone: metadata.phone || '',
        sponsor_email: metadata.sponsor_email || '',
        rsac_number: metadata.rsac_number || '',
        role: metadata.role || 'agent'
      });
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Validation
    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
      setError('Le numéro de téléphone doit contenir 10 chiffres');
      return;
    }

    if (formData.rsac_number && !/^[0-9]{6}$/.test(formData.rsac_number)) {
      setError('Le numéro RSAC doit contenir 6 chiffres');
      return;
    }

    if (formData.sponsor_email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.sponsor_email)) {
      setError('Format d\'email invalide pour l\'email du parrain');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        data: formData
      });

      if (error) throw error;

      setMessage('Profil mis à jour avec succès');
      setEditing(false);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const metadata = session?.user?.user_metadata || {};

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Mon Profil</h1>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Modifier le profil
            </button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Prénom</label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <User className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <UserCog className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                <div className="mt-1 relative">
                  <input
                    type="tel"
                    pattern="[0-9]{10}"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="10 chiffres"
                  />
                  <Phone className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email du parrain</label>
                <div className="mt-1 relative">
                  <input
                    type="email"
                    value={formData.sponsor_email}
                    onChange={(e) => setFormData({ ...formData, sponsor_email: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Mail className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Numéro RSAC</label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    pattern="[0-9]{6}"
                    value={formData.rsac_number}
                    onChange={(e) => setFormData({ ...formData, rsac_number: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="6 chiffres"
                  />
                  <Hash className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <div className="mt-1 relative">
                  <input
                    type="email"
                    value={session?.user?.email}
                    disabled
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
                  />
                  <Mail className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}
            {message && <div className="text-green-600 text-sm">{message}</div>}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Enregistrer
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500">Prénom</label>
              <p className="mt-1 text-lg">{metadata.first_name || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Nom</label>
              <p className="mt-1 text-lg">{metadata.last_name || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Téléphone</label>
              <p className="mt-1 text-lg">{metadata.phone || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email du parrain</label>
              <p className="mt-1 text-lg">{metadata.sponsor_email || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Numéro RSAC</label>
              <p className="mt-1 text-lg">{metadata.rsac_number || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="mt-1 text-lg">{session?.user?.email || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Rôle</label>
              <p className="mt-1 text-lg capitalize">{metadata.role || 'agent'}</p>
            </div>
          </div>
        )}
      </div>

      <ChangePassword />
    </div>
  );
};

export default AgentsPage;