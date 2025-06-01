import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Pricing from '@/pages/Pricing';
import Onboarding from '@/pages/Onboarding';
import Dashboard from '@/pages/Dashboard';
import Prospection from '@/pages/Prospection';
import Messages from '@/pages/Messages';
import Campaigns from '@/pages/Campaigns';
import NewCampaign from '@/pages/NewCampaign';
import Reports from '@/pages/Reports';
import Team from '@/pages/Team';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import WhatsAppAdmin from '@/pages/WhatsAppAdmin';
import AdminDashboard from '@/pages/AdminDashboard';
import PrivateRoute from '@/components/PrivateRoute';
import SuperAdminDashboard from '@/pages/SuperAdminDashboard';
import SuperAdminInstances from '@/pages/SuperAdminInstances';
import SuperAdminUsers from '@/pages/SuperAdminUsers';
import SuperAdminMonitoring from '@/pages/SuperAdminMonitoring';
import { useAuth } from "./providers/AuthProvider";
import { LogOut, Search } from "lucide-react";
import MessageLibrary from "@/pages/MessageLibrary";
import WhatsAppConnections from '@/pages/Messages';
import Feed from "@/pages/Feed";
import Profile from "@/pages/Profile";

function App() {
  const { signOut } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const handleEmergencySignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Erro ao fazer logout de emergência:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality here
    console.log("Searching for:", searchTerm);
  };

  return (
    <div className="App">
      <Toaster position="top-center" />
      
      <Routes>
        <Route path="/" element={<Navigate to="/feed" replace />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/onboarding" element={
          <PrivateRoute>
            <Onboarding />
          </PrivateRoute>
        } />
        
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/prospection" element={
          <PrivateRoute>
            <Prospection />
          </PrivateRoute>
        } />
        <Route path="/whatsapp-connections" element={
          <PrivateRoute>
            <WhatsAppConnections />
          </PrivateRoute>
        } />
        <Route path="/messages/library" element={
          <PrivateRoute>
            <MessageLibrary />
          </PrivateRoute>
        } />
        <Route path="/campaigns" element={
          <PrivateRoute>
            <Campaigns />
          </PrivateRoute>
        } />
        <Route path="/campaigns/new" element={
          <PrivateRoute>
            <NewCampaign />
          </PrivateRoute>
        } />
        <Route path="/reports" element={
          <PrivateRoute>
            <Reports />
          </PrivateRoute>
        } />
        <Route path="/team" element={
          <PrivateRoute>
            <Team />
          </PrivateRoute>
        } />
        <Route path="/settings" element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        } />
        <Route path="/admin/whatsapp" element={
          <PrivateRoute>
            <WhatsAppAdmin />
          </PrivateRoute>
        } />
        
        {/* Super Admin Routes */}
        <Route path="/superadmin" element={
          <PrivateRoute requireSuperAdmin>
            <SuperAdminDashboard />
          </PrivateRoute>
        } />
        <Route path="/superadmin/instances" element={
          <PrivateRoute requireSuperAdmin>
            <SuperAdminInstances />
          </PrivateRoute>
        } />
        <Route path="/superadmin/users" element={
          <PrivateRoute requireSuperAdmin>
            <SuperAdminUsers />
          </PrivateRoute>
        } />
        <Route path="/superadmin/monitoring" element={
          <PrivateRoute requireSuperAdmin>
            <SuperAdminMonitoring />
          </PrivateRoute>
        } />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {/* Botão de logout de emergência - sempre visível mas discreto */}
      <div className="fixed bottom-5 right-5 z-40 md:bottom-8 md:right-8">
        <button 
          className="bg-white text-gray-700 hover:bg-gray-100 rounded-full p-2 shadow-lg flex items-center justify-center"
          onClick={handleEmergencySignOut}
          title="Sair da conta"
        >
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );
}

export default App;
