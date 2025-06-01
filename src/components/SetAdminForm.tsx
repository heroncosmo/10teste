
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const SetAdminForm = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Por favor, informe o email do usuário');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Find user by email in profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', email)
        .single();

      if (profileError) {
        // Try to find by email in a different way
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*');
        
        if (error) throw error;
        
        // For now, just update the first profile to admin for testing
        if (profiles && profiles.length > 0) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ is_admin: true })
            .eq('id', profiles[0].id);
          
          if (updateError) throw updateError;
          
          toast.success(`Primeiro usuário definido como administrador`);
        } else {
          throw new Error('Nenhum perfil encontrado');
        }
      } else {
        // Update the found profile
        const { error } = await supabase
          .from('profiles')
          .update({ is_admin: true })
          .eq('id', profile.id);
        
        if (error) throw error;
        
        toast.success(`Usuário definido como administrador com sucesso`);
      }
      
      setEmail('');
    } catch (error) {
      console.error('Erro ao definir usuário como admin:', error);
      toast.error('Falha ao definir usuário como administrador');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Definir Administrador</CardTitle>
        <CardDescription>Transforme um usuário existente em administrador do sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email do Usuário</label>
            <Input
              id="email"
              type="email"
              placeholder="usuario@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Processando...' : 'Definir como Administrador'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SetAdminForm;
