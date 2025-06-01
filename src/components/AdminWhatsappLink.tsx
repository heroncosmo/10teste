
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

const AdminWhatsappLink = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  if (!profile?.is_admin) {
    return null;
  }

  return (
    <li>
      <button
        onClick={() => navigate('/admin')}
        className="flex items-center w-full p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
      >
        <ShieldCheck className="h-5 w-5 mr-3 text-blue-600" />
        <span>Painel Admin</span>
      </button>
    </li>
  );
};

export default AdminWhatsappLink;
