import React, { useState, useEffect } from 'react';
import { UserPlus, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

interface Buyer {
  id?: string;
  contact_id: string;
  contact?: Contact;
  isNew?: boolean; // Pour identifier les nouveaux éléments non sauvegardés
}

interface DealBuyersProps {
  dealId: string | null;
  buyers: Buyer[];
  setBuyers: (buyers: Buyer[]) => void;
}

const DealBuyers = ({ dealId, buyers, setBuyers }: DealBuyersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);

  // Charger les contacts disponibles
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (user) {
          const { data: contactsData, error: contactsError } = await supabase
            .from('contact')
            .select('id, first_name, last_name, email, phone')
            .eq('agent_id', user.id)
            .order('last_name', { ascending: true });

          if (contactsError) throw contactsError;
          setContacts(contactsData || []);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des contacts:', err);
      }
    };

    fetchContacts();
  }, []);

  // Charger les acheteurs existants
  useEffect(() => {
    const loadBuyers = async () => {
      if (!dealId) return;

      try {
        const { data, error: loadError } = await supabase
          .from('buyers')
          .select(`
            id,
            contact_id,
            contact:contact_id (
              id,
              first_name,
              last_name,
              email,
              phone
            )
          `)
          .eq('deal_id', dealId)
          .order('created_at', { ascending: true });

        if (loadError) throw loadError;

        if (data && data.length > 0) {
          const loadedBuyers = data.map(item => ({
            id: item.id,
            contact_id: item.contact_id,
            contact: item.contact,
            isNew: false
          }));
          setBuyers(loadedBuyers);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des acheteurs:', err);
      }
    };

    if (dealId) {
      setError('');
      loadBuyers();
    }
  }, [dealId]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const addBuyer = () => {
    if (!dealId) {
      setError('Veuillez d\'abord sauvegarder l\'affaire');
      return;
    }

    setError('');
    
    // Ajouter un acheteur temporaire (non sauvegardé)
    const tempId = `temp-${Date.now()}`;
    setBuyers([...buyers, {
      id: tempId,
      contact_id: '',
      contact: undefined,
      isNew: true
    }]);
  };

  const removeBuyer = async (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    setError('');
    const buyerToRemove = buyers[index];
    
    // Si c'est un acheteur sauvegardé en base, le supprimer
    if (buyerToRemove.id && !buyerToRemove.isNew && dealId) {
      try {
        const { error } = await supabase
          .from('buyers')
          .delete()
          .eq('id', buyerToRemove.id);

        if (error) throw error;
        
        console.log(`Acheteur supprimé de la base de données: ${buyerToRemove.id}`);
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        setError('Erreur lors de la suppression de l\'acheteur');
        return;
      }
    }

    // Supprimer de l'état local
    const newBuyers = [...buyers];
    newBuyers.splice(index, 1);
    setBuyers(newBuyers);
    
    console.log(`Acheteur supprimé de l'interface: index ${index}`);
  };

  const updateBuyer = async (index: number, contactId: string) => {
    setError('');
    const buyer = buyers[index];
    
    if (!contactId) {
      // Si aucun contact sélectionné, ne rien faire
      return;
    }

    try {
      // Récupérer les informations du contact sélectionné
      const selectedContact = contacts.find(c => c.id === contactId);
      
      let updatedBuyer: Buyer;

      if (buyer.isNew) {
        // Créer un nouvel acheteur en base
        const { data, error: insertError } = await supabase
          .from('buyers')
          .insert({
            deal_id: dealId,
            contact_id: contactId
          })
          .select()
          .single();

        if (insertError) throw insertError;

        updatedBuyer = {
          id: data.id,
          contact_id: contactId,
          contact: selectedContact,
          isNew: false
        };
      } else {
        // Mettre à jour un acheteur existant
        const { error: updateError } = await supabase
          .from('buyers')
          .update({ contact_id: contactId })
          .eq('id', buyer.id);

        if (updateError) throw updateError;

        updatedBuyer = {
          ...buyer,
          contact_id: contactId,
          contact: selectedContact
        };
      }

      // Mettre à jour l'état local
      const newBuyers = [...buyers];
      newBuyers[index] = updatedBuyer;
      setBuyers(newBuyers);
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      setError('Erreur lors de la mise à jour de l\'acheteur');
    }
  };

  const getContactDisplayName = (contact: Contact) => {
    return `${contact.first_name} ${contact.last_name}`.trim() || contact.email || 'Contact sans nom';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <button
        type="button"
        onClick={handleToggle}
        className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center">
          <UserPlus className="h-6 w-6 text-green-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">
            Acheteurs
            {buyers.length > 0 && (
              <span className="ml-2 text-sm text-gray-500">
                - {buyers.length} acheteur{buyers.length > 1 ? 's' : ''}
              </span>
            )}
          </h2>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="p-6 border-t border-gray-200">
          <div className="space-y-6">
            {buyers.map((buyer, index) => (
              <div key={buyer.id || index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Acheteur {index + 1}
                    {buyer.contact && (
                      <span className="ml-2 text-sm text-gray-500">
                        - {getContactDisplayName(buyer.contact)}
                      </span>
                    )}
                    {buyer.isNew && (
                      <span className="ml-2 text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                        Non sauvegardé
                      </span>
                    )}
                  </h3>
                  <button
                    type="button"
                    onClick={(e) => removeBuyer(e, index)}
                    className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-50 transition-colors"
                    title="Supprimer l'acheteur"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Sélectionner un contact
                  </label>
                  <select
                    value={buyer.contact_id}
                    onChange={(e) => updateBuyer(index, e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sélectionnez un contact</option>
                    {contacts.map((contact) => (
                      <option key={contact.id} value={contact.id}>
                        {getContactDisplayName(contact)}
                        {contact.email && ` (${contact.email})`}
                      </option>
                    ))}
                  </select>
                </div>

                {buyer.contact && (
                  <div className="mt-4 p-3 bg-green-50 rounded-md">
                    <h4 className="text-sm font-medium text-green-900 mb-2">Informations du contact</h4>
                    <div className="text-sm text-green-800">
                      <p><strong>Nom:</strong> {getContactDisplayName(buyer.contact)}</p>
                      {buyer.contact.email && <p><strong>Email:</strong> {buyer.contact.email}</p>}
                      {buyer.contact.phone && <p><strong>Téléphone:</strong> {buyer.contact.phone}</p>}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={addBuyer}
              className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-5 w-5 mr-2" />
              Ajouter Acheteur
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealBuyers;