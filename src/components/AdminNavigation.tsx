
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Settings, Database, MessageSquare } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

const AdminNavigation = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  if (!profile?.is_admin) {
    return null;
  }

  return (
    <div className="mt-6">
      <h2 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Administração
      </h2>
      <ul className="mt-2 space-y-1">
        <li>
          <button
            onClick={() => navigate('/admin/whatsapp')}
            className="flex items-center w-full p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <MessageSquare className="h-5 w-5 mr-3 text-blue-600" />
            <span>WhatsApp Instâncias</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate('/admin/users')}
            className="flex items-center w-full p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Users className="h-5 w-5 mr-3 text-blue-600" />
            <span>Usuários</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate('/admin/database')}
            className="flex items-center w-full p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Database className="h-5 w-5 mr-3 text-blue-600" />
            <span>Banco de Dados</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate('/admin/settings')}
            className="flex items-center w-full p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Settings className="h-5 w-5 mr-3 text-blue-600" />
            <span>Configurações</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default AdminNavigation;
