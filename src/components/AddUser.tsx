import React, { useState } from 'react';
import { UserPlus, Save, X, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AddUserProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: () => void;
}

interface NewUser {
  first_name: string;
  last_name: string;
  phone: string;
  sponsor_email: string;
  rsac_number: string;
  email: string;
  role: string;
}

const AddUser = ({ isOpen, onClose, onUserAdded }: AddUserProps) => {
  const [newUser, setNewUser] = useState<NewUser>({
    first_name: '',
    last_name: '',
    phone: '',
    sponsor_email: '',
    rsac_number: '',
    email: '',
    role: 'agent'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [generatedPassword] = useState('123456'); // Mot de passe par défaut

  const resetForm = () => {
    setNewUser({
      first_name: '',
      last_name: '',
      phone: '',
      sponsor_email: '',
      rsac_number: '',
      email: '',
      role: 'agent'
    });
    setError('');
    setSuccess('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = (): string | null => {
    // Champs obligatoires
    if (!newUser.email.trim()) {
      return 'L\'email est obligatoire';
    }

    if (!newUser.role) {
      return 'Le rôle est obligatoire';
    }

    // Validation format email
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(newUser.email)) {
      return 'Format d\'email invalide';
    }

    // Validation téléphone (optionnel mais si renseigné, doit être valide)
    if (newUser.phone && !/^[0-9]{10}$/.test(newUser.phone)) {
      return 'Le numéro de téléphone doit contenir 10 chiffres';
    }

    // Validation RSAC (optionnel mais si renseigné, doit être valide)
    if (newUser.rsac_number && !/^[0-9]{6}$/.test(newUser.rsac_number)) {
      return 'Le numéro RSAC doit contenir 6 chiffres';
    }

    // Validation email parrain (optionnel mais si renseigné, doit être valide)
    if (newUser.sponsor_email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(newUser.sponsor_email)) {
      return 'Format d\'email invalide pour l\'email du parrain';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      // Créer l'utilisateur avec Supabase Auth Admin
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newUser.email,
        password: generatedPassword,
        email_confirm: true, // Confirmer automatiquement l'email
        user_metadata: {
          first_name: newUser.first_name || '',
          last_name: newUser.last_name || '',
          phone: newUser.phone || '',
          sponsor_email: newUser.sponsor_email || '',
          rsac_number: newUser.rsac_number || '',
          role: newUser.role
        }
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          throw new Error('Un utilisateur avec cet email existe déjà');
        }
        throw authError;
      }

      setSuccess(`Utilisateur créé avec succès ! Email: ${newUser.email}, Mot de passe: ${generatedPassword}`);
      
      // Notifier le parent que l'utilisateur a été ajouté
      onUserAdded();
      
      // Réinitialiser le formulaire après un délai
      setTimeout(() => {
        resetForm();
      }, 3000);

    } catch (err: any) {
      console.error('Erreur lors de la création de l\'utilisateur:', err);
      setError(err.message || 'Erreur lors de la création de l\'utilisateur');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <UserPlus className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Ajouter un nouvel utilisateur</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Contenu */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Messages d'erreur et de succès */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
                {success}
              </div>
            )}

            {/* Champs obligatoires */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-3">Informations obligatoires</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="utilisateur@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rôle <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="agent">Agent</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>
              </div>

              {/* Mot de passe généré */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe par défaut
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={generatedPassword}
                    readOnly
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  L'utilisateur pourra changer ce mot de passe lors de sa première connexion
                </p>
              </div>
            </div>

            {/* Champs optionnels */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Informations optionnelles</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={newUser.first_name}
                    onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Jean"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={newUser.last_name}
                    onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Dupont"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0123456789"
                    pattern="[0-9]{10}"
                  />
                  <p className="text-xs text-gray-500 mt-1">10 chiffres</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email du parrain
                  </label>
                  <input
                    type="email"
                    value={newUser.sponsor_email}
                    onChange={(e) => setNewUser({ ...newUser, sponsor_email: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="parrain@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro RSAC
                  </label>
                  <input
                    type="text"
                    value={newUser.rsac_number}
                    onChange={(e) => setNewUser({ ...newUser, rsac_number: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="123456"
                    pattern="[0-9]{6}"
                  />
                  <p className="text-xs text-gray-500 mt-1">6 chiffres</p>
                </div>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center px-4 py-2 rounded-md text-white font-medium transition-colors ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Création...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Créer l'utilisateur
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;