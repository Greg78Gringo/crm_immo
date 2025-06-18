import React, { useMemo } from 'react';
import { Users, UserCheck, Calendar, MapPin, Globe } from 'lucide-react';
import type { Contact } from '../../pages/ContactsList';

interface ContactsStatsProps {
  contacts: Contact[];
  currentUserId: string;
}

const ContactsStats = ({ contacts, currentUserId }: ContactsStatsProps) => {
  const stats = useMemo(() => {
    const totalContacts = contacts.length;
    const myContacts = contacts.filter(c => c.agent_id === currentUserId).length;
    
    // Nouveaux contacts ce mois
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const newThisMonth = contacts.filter(c => {
      const createdDate = new Date(c.created_at);
      return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
    }).length;

    // Répartition géographique (top 5)
    const cityCount = contacts.reduce((acc, contact) => {
      if (contact.city) {
        acc[contact.city] = (acc[contact.city] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const topCities = Object.entries(cityCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([city, count]) => ({ city, count }));

    // Répartition des sources
    const sourceCount = contacts.reduce((acc, contact) => {
      const source = contact.source || 'Non défini';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topSources = Object.entries(sourceCount)
      .sort(([,a], [,b]) => b - a)
      .map(([source, count]) => ({ 
        source: source === 'agent' ? 'Agent' : source === 'internet' ? 'Internet' : source, 
        count 
      }));

    return {
      totalContacts,
      myContacts,
      newThisMonth,
      topCities,
      topSources
    };
  }, [contacts, currentUserId]);

  const StatCard = ({ 
    icon: Icon, 
    title, 
    value, 
    subtitle, 
    color = 'blue' 
  }: { 
    icon: React.ElementType; 
    title: string; 
    value: string | number; 
    subtitle?: string; 
    color?: string; 
  }) => {
    const colorClasses = {
      blue: 'bg-blue-500 text-blue-600 bg-blue-50',
      green: 'bg-green-500 text-green-600 bg-green-50',
      purple: 'bg-purple-500 text-purple-600 bg-purple-50',
      orange: 'bg-orange-500 text-orange-600 bg-orange-50'
    };

    const [bgColor, textColor, bgLight] = colorClasses[color as keyof typeof colorClasses].split(' ');

    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center">
          <div className={`${bgColor} rounded-lg p-3`}>
            <Icon className={`h-6 w-6 text-white`} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {subtitle && (
              <p className="text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          title="Total Contacts"
          value={stats.totalContacts}
          color="blue"
        />
        <StatCard
          icon={UserCheck}
          title="Mes Contacts"
          value={stats.myContacts}
          subtitle={`${Math.round((stats.myContacts / stats.totalContacts) * 100) || 0}% du total`}
          color="green"
        />
        <StatCard
          icon={Calendar}
          title="Nouveaux ce mois"
          value={stats.newThisMonth}
          color="purple"
        />
        <StatCard
          icon={MapPin}
          title="Villes représentées"
          value={stats.topCities.length}
          color="orange"
        />
      </div>

      {/* Répartitions détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition géographique */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <MapPin className="h-5 w-5 text-orange-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Top 5 des Villes</h3>
          </div>
          
          {stats.topCities.length > 0 ? (
            <div className="space-y-3">
              {stats.topCities.map(({ city, count }, index) => (
                <div key={city} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600 w-4">
                      {index + 1}.
                    </span>
                    <span className="ml-2 text-sm text-gray-900">{city}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                      <div
                        className="bg-orange-600 h-2 rounded-full"
                        style={{
                          width: `${(count / stats.totalContacts) * 100}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Aucune donnée géographique disponible</p>
          )}
        </div>

        {/* Analyse des sources */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <Globe className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Sources d'Acquisition</h3>
          </div>
          
          <div className="space-y-3">
            {stats.topSources.map(({ source, count }) => (
              <div key={source} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm text-gray-900">{source}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{
                        width: `${(count / stats.totalContacts) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">
                    {count}
                  </span>
                  <span className="text-xs text-gray-500 ml-2 w-10 text-right">
                    {Math.round((count / stats.totalContacts) * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactsStats;