
import { supabase } from '@/integrations/supabase/client';
import type { MessageCategory, MessageTemplate } from '@/types/database';
import { toast } from 'sonner';

export class MessageService {
  // Métodos para categorias de mensagem
  static async createCategory(categoryData: {
    name: string;
    description?: string;
    segment?: string;
    user_id: string;
  }): Promise<MessageCategory> {
    try {
      const { data, error } = await supabase
        .from('message_categories')
        .insert({
          name: categoryData.name,
          description: categoryData.description,
          segment: categoryData.segment,
          user_id: categoryData.user_id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  static async getCategories(userId: string): Promise<MessageCategory[]> {
    try {
      const { data, error } = await supabase
        .from('message_categories')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  static async deleteCategory(categoryId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('message_categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  // Métodos para templates de mensagem
  static async createTemplate(templateData: {
    category_id: string;
    content: string;
    variables_used?: string[];
  }): Promise<MessageTemplate> {
    try {
      const { data, error } = await supabase
        .from('message_templates')
        .insert({
          category_id: templateData.category_id,
          content: templateData.content,
          variables_used: templateData.variables_used || []
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  }

  static async getTemplatesByCategory(categoryId: string): Promise<MessageTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('message_templates')
        .select('*')
        .eq('category_id', categoryId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
  }

  static async updateTemplate(templateId: string, updates: {
    content: string;
    variables_used?: string[];
  }): Promise<MessageTemplate> {
    try {
      const { data, error } = await supabase
        .from('message_templates')
        .update(updates)
        .eq('id', templateId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  }

  static async deleteTemplate(templateId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('message_templates')
        .delete()
        .eq('id', templateId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  }
}

// Export default for compatibility
export default MessageService;

// Named exports for components that expect them
export type { MessageCategory, MessageTemplate };
export const messageService = MessageService;
