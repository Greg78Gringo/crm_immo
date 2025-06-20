import React, { useState, useEffect } from 'react';
import { Users, Edit, RotateCcw, Save, X, Filter, ChevronUp, ChevronDown, UserPlus, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import AddUser from '../components/AddUser';

interface Agent {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  phone: string;
  rsac_number: string;
  sponsor_email: string;
  created_at: string;
  last_sign_in_at: string | null;
  status: string;
  contacts_count: number;
  deals_count: number;
}

interface EditingAgent {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  rsac_number: string;
  sponsor_email: string;
  email: string;
  role: string;
}

type SortField = 'first_name' | 'last_name' | 'email' | 'role' | 'created_at' | 'last_sign_in_at' | 'contacts_count' | 'deals_count';
type SortDirection = 'asc' | 'desc';

const AgentsManagement = () => {
  const { isAdmin } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingAgent, setEditingAgent] = useState<EditingAgent | null>(null);
  const [savingAgent, setSavingAgent] = useState(false);
  const [resettingPassword, setResettingPassword] = useState<string | null>(null);
  const [showAddUser, setShowAddUser] = useState(false);
  
  // États pour les filtres
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Vérification d'accès admin
  useEffect(() => {
    if (!isAdmin) {
      // Redirection sera gérée par AdminRoute dans App.tsx
      return;
    }
  }, [isAdmin]);

  // Charger les agents avec leurs statistiques
  useEffect(() => {
    if (isAdmin) {
      loadAgents();
    }
  }, [isAdmin]);

  // Appliquer les filtres et le tri
  useEffect(() => {
    let filtered = [...agents];

    // Filtrer par rôle
    if (roleFilter) {
      filtered = filtered.filter(agent => agent.role === roleFilter);
    }

    // Filtrer par statut
    if (statusFilter) {
      filtered = filtered.filter(agent => agent.status === statusFilter);
    }

    // Trier
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Gérer les valeurs null pour les dates
      if (sortField === 'last_sign_in_at') {
        if (!aValue && !bValue) return 0;
        if (!aValue) return sortDirection === 'asc' ? 1 : -1;
        if (!bValue) return sortDirection === 'asc' ? -1 : 1;
      }

      // Conversion pour les comparaisons
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredAgents(filtered);
  }, [agents, roleFilter, statusFilter, sortField, sortDirection]);

  const loadAgents = async () => {
    setLoading(true);
    setError('');

    try {
      // Charger les agents depuis la vue
      const { data: agentsData, error: agentsError } = await supabase
        .from('agents_view')
        .select('*');

      if (agentsError) throw agentsError;

      // Charger les statistiques pour chaque agent
      const agentsWithStats = await Promise.all(
        (agentsData || []).map(async (agent) => {
          // Compter les contacts
          const { count: contactsCount, error: contactsError } = await supabase
            .from('contact')
            .select('*', { count: 'exact', head: true })
            .eq('agent_id', agent.id);

          if (contactsError) {
            console.warn(`Erreur lors du comptage des contacts pour ${agent.id}:`, contactsError);
          }

          // Compter les affaires
          const { count: dealsCount, error: dealsError } = await supabase
            .from('deals')
            .select('*', { count: 'exact', head: true })
            .eq('agent_id', agent.id);

          if (dealsError) {
            console.warn(`Erreur lors du comptage des affaires pour ${agent.id}:`, dealsError);
          }

          return {
            ...agent,
            contacts_count: contactsCount || 0,
            deals_count: dealsCount || 0
          };
        })
      );

      setAgents(agentsWithStats);
    } catch (err: any) {
      console.error('Erreur lors du chargement des agents:', err);
      setError('Erreur lors du chargement des agents');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronUp className="h-4 w-4 text-gray-400" />;
    }
    return sortDirection === 'asc' 
      ? <ChevronUp className="h-4 w-4 text-blue-600" />
      : <ChevronDown className="h-4 w-4 text-blue-600" />;
  };

  const startEditing = (agent: Agent) => {
    setEditingAgent({
      id: agent.id,
      first_name: agent.first_name,
      last_name: agent.last_name,
      phone: agent.phone,
      rsac_number: agent.rsac_number,
      sponsor_email: agent.sponsor_email,
      email: agent.email,
      role: agent.role
    });
    setError('');
    setSuccess('');
  };

  const cancelEditing = () => {
    setEditingAgent(null);
    setError('');
    setSuccess('');
  };

  const saveAgent = async () => {
    if (!editingAgent) return;

    setSavingAgent(true);
    setError('');
    setSuccess('');

    try {
      // Validation
      if (!editingAgent.first_name.trim() || !editingAgent.last_name.trim()) {
        throw new Error('Le prénom et le nom sont obligatoires');
      }

      if (editingAgent.phone && !/^[0-9]{10}$/.test(editingAgent.phone)) {
        throw new Error('Le numéro de téléphone doit contenir 10 chiffres');
      }

      if (editingAgent.rsac_number && !/^[0-9]{6}$/.test(editingAgent.rsac_number)) {
        throw new Error('Le numéro RSAC doit contenir 6 chiffres');
      }

      if (editingAgent.sponsor_email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(editingAgent.sponsor_email)) {
        throw new Error('Format d\'email invalide pour l\'email du parrain');
      }

      // Mettre à jour les métadonnées utilisateur
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        editingAgent.id,
        {
          email: editingAgent.email,
          user_metadata: {
            first_name: editingAgent.first_name,
            last_name: editingAgent.last_name,
            phone: editingAgent.phone,
            rsac_number: editingAgent.rsac_number,
            sponsor_email: editingAgent.sponsor_email,
            role: editingAgent.role
          }
        }
      );

      if (updateError) throw updateError;

      setSuccess('Agent mis à jour avec succès !');
      setEditingAgent(null);
      await loadAgents(); // Recharger la liste
    } catch (err: any) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError(err.message || 'Erreur lors de la sauvegarde de l\'agent');
    } finally {
      setSavingAgent(false);
    }
  };

  const resetPassword = async (agentId: string, agentEmail: string) => {
    setResettingPassword(agentId);
    setError('');
    setSuccess('');

    try {
      // Réinitialiser le mot de passe à "123456"
      const { error: resetError } = await supabase.auth.admin.updateUserById(
        agentId,
        {
          password: '123456'
        }
      );

      if (resetError) throw resetError;

      setSuccess(`Mot de passe réinitialisé pour ${agentEmail}. Nouveau mot de passe : 123456`);
    } catch (err: any) {
      console.error('Erreur lors de la réinitialisation:', err);
      setError('Erreur lors de la réinitialisation du mot de passe');
    } finally {
      setResettingPassword(null);
    }
  };

  const handleUserAdded = () => {
    setSuccess('Nouvel utilisateur créé avec succès !');
    loadAgents(); // Recharger la liste des agents
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Jamais';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleLabel = (role: string) => {
    return role === 'admin' ? 'Administrateur' : 'Agent';
  };

  const getStatusLabel = (status: string) => {
    return status === 'active' ? 'Actif' : 'En attente';
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
  };

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {getSortIcon(field)}
      </div>
    </th>
  );

  // Affichage d'accès refusé si pas admin (sécurité supplémentaire)
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Accès Refusé</h2>
          <p className="text-gray-600 mb-4">
            Cette page est réservée aux administrateurs.
          </p>
          <p className="text-sm text-gray-500">
            Contactez votre administrateur si vous pensez que c'est une erreur.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* En-tête */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Gestion des Agents
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <Shield className="h-3 w-3 mr-1" />
                    Admin
                  </span>
                </h1>
                <p className="text-sm text-gray-600">
                  {filteredAgents.length} agent{filteredAgents.length > 1 ? 's' : ''} 
                  {roleFilter || statusFilter ? ' (filtré)' : ''}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setShowAddUser(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Ajouter un utilisateur
            </button>
          </div>

          {/* Messages d'erreur et de succès */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
              {success}
            </div>
          )}
        </div>
      </div>

      {/* Contenu principal */}
      <div className="px-6 py-6 space-y-6">
        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rôle
              </label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tous les rôles</option>
                <option value="agent">Agent</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="pending">En attente</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setRoleFilter('');
                  setStatusFilter('');
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        {/* Tableau des agents */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">
              Liste des Agents ({filteredAgents.length})
            </h3>
          </div>

          {filteredAgents.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun agent trouvé</h3>
              <p className="text-gray-600">
                Aucun agent ne correspond aux critères de filtrage sélectionnés.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <SortableHeader field="first_name">Prénom</SortableHeader>
                    <SortableHeader field="last_name">Nom</SortableHeader>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Téléphone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email Parrain
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      RSAC
                    </th>
                    <SortableHeader field="email">Email</SortableHeader>
                    <SortableHeader field="role">Rôle</SortableHeader>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <SortableHeader field="contacts_count">Contacts</SortableHeader>
                    <SortableHeader field="deals_count">Affaires</SortableHeader>
                    <SortableHeader field="created_at">Créé le</SortableHeader>
                    <SortableHeader field="last_sign_in_at">Dernière connexion</SortableHeader>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAgents.map((agent) => (
                    <tr key={agent.id} className="hover:bg-gray-50 transition-colors">
                      {editingAgent?.id === agent.id ? (
                        // Mode édition
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="text"
                              value={editingAgent.first_name}
                              onChange={(e) => setEditingAgent({...editingAgent, first_name: e.target.value})}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder="Prénom"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="text"
                              value={editingAgent.last_name}
                              onChange={(e) => setEditingAgent({...editingAgent, last_name: e.target.value})}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder="Nom"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="tel"
                              value={editingAgent.phone}
                              onChange={(e) => setEditingAgent({...editingAgent, phone: e.target.value})}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder="0123456789"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="email"
                              value={editingAgent.sponsor_email}
                              onChange={(e) => setEditingAgent({...editingAgent, sponsor_email: e.target.value})}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder="parrain@email.com"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="text"
                              value={editingAgent.rsac_number}
                              onChange={(e) => setEditingAgent({...editingAgent, rsac_number: e.target.value})}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder="123456"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="email"
                              value={editingAgent.email}
                              onChange={(e) => setEditingAgent({...editingAgent, email: e.target.value})}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={editingAgent.role}
                              onChange={(e) => setEditingAgent({...editingAgent, role: e.target.value})}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            >
                              <option value="agent">Agent</option>
                              <option value="admin">Administrateur</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                              {getStatusLabel(agent.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {agent.contacts_count}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {agent.deals_count}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(agent.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(agent.last_sign_in_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={saveAgent}
                                disabled={savingAgent}
                                className={`text-green-600 hover:text-green-900 p-1 rounded-md hover:bg-green-50 transition-colors ${
                                  savingAgent ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                title="Sauvegarder"
                              >
                                <Save className="h-4 w-4" />
                              </button>
                              <button
                                onClick={cancelEditing}
                                disabled={savingAgent}
                                className="text-gray-600 hover:text-gray-900 p-1 rounded-md hover:bg-gray-50 transition-colors"
                                title="Annuler"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        // Mode lecture
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {agent.first_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {agent.last_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {agent.phone || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {agent.sponsor_email || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {agent.rsac_number || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {agent.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              agent.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {getRoleLabel(agent.role)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                              {getStatusLabel(agent.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                            <span className="inline-flex items-center justify-center h-6 w-8 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                              {agent.contacts_count}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                            <span className="inline-flex items-center justify-center h-6 w-8 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                              {agent.deals_count}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(agent.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(agent.last_sign_in_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => startEditing(agent)}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50 transition-colors"
                                title="Modifier"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => resetPassword(agent.id, agent.email)}
                                disabled={resettingPassword === agent.id}
                                className={`text-orange-600 hover:text-orange-900 p-1 rounded-md hover:bg-orange-50 transition-colors ${
                                  resettingPassword === agent.id ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                title="Réinitialiser le mot de passe"
                              >
                                <RotateCcw className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal d'ajout d'utilisateur */}
      <AddUser
        isOpen={showAddUser}
        onClose={() => setShowAddUser(false)}
        onUserAdded={handleUserAdded}
      />
    </div>
  );
};

export default AgentsManagement;