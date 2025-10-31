export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          company: string | null;
          role: 'admin' | 'customer';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at'> & {
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      services: {
        Row: {
          id: string;
          name: string;
          description: string;
          status: 'draft' | 'published' | 'archived';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['services']['Row'], 'created_at' | 'id'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['services']['Insert']>;
      };
      subscriptions: {
        Row: {
          id: string;
          profile_id: string;
          plan: 'launch' | 'scale' | 'enterprise';
          status: 'active' | 'canceled' | 'trialing';
          current_period_end: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['subscriptions']['Row'], 'created_at' | 'id'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['subscriptions']['Insert']>;
      };
      invoices: {
        Row: {
          id: string;
          profile_id: string;
          amount: number;
          currency: string;
          status: 'paid' | 'open' | 'uncollectible';
          invoice_url: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['invoices']['Row'], 'created_at' | 'id'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['invoices']['Insert']>;
      };
      tickets: {
        Row: {
          id: string;
          profile_id: string;
          subject: string;
          status: 'open' | 'in_progress' | 'resolved';
          priority: 'low' | 'medium' | 'high';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['tickets']['Row'], 'created_at' | 'id'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['tickets']['Insert']>;
      };
      messages: {
        Row: {
          id: string;
          profile_id: string;
          role: 'user' | 'assistant' | 'system';
          content: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['messages']['Row'], 'created_at' | 'id'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['messages']['Insert']>;
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          cover_image: string | null;
          language: 'en' | 'es';
          published_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['blog_posts']['Row'], 'created_at' | 'id'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['blog_posts']['Insert']>;
      };
      contact_requests: {
        Row: {
          id: string;
          name: string;
          email: string;
          company: string;
          message: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['contact_requests']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['contact_requests']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
