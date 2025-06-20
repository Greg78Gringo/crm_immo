import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard,
  Database,
  UserCog,
  FilePlus,
  UserPlus,
  FileText,
  List,
  Camera,
  Users
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Sidebar = () => {
  const { isAdmin } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Tableau de bord', path: '/dashboard' },
    { icon: FilePlus, label: 'Nouvelle Affaire', path: '/new-deal' },
    { icon: UserPlus, label: 'Nouveau Contact', path: '/new-contact' },
    { icon: List, label: 'Liste Contacts', path: '/contacts' },
    { icon: FileText, label: 'Liste des Documents', path: '/documents-list' },
    { icon: Camera, label: 'Photothèque', path: '/phototheque' },
    // Afficher "Gestion des Agents" seulement pour les admins
    ...(isAdmin ? [{ icon: Users, label: 'Gestion des Agents', path: '/agents-management' }] : []),
    { icon: UserCog, label: 'Mon Profil', path: '/agent-profile' }
  ];

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen px-4 py-6">
      <div className="flex items-center mb-8 px-2">
        <Database className="w-8 h-8 mr-2" />
        <span className="text-xl font-bold">CRM Immobilier</span>
      </div>
      <nav>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 mb-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar