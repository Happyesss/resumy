export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          auth_user_id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          subscription_tier: 'free' | 'pro' | 'premium';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          auth_user_id: string;
          email: string;
          full_name: string;
          avatar_url?: string | null;
          subscription_tier?: 'free' | 'pro' | 'premium';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          auth_user_id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string | null;
          subscription_tier?: 'free' | 'pro' | 'premium';
          created_at?: string;
          updated_at?: string;
        };
      };
      resumes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          template_id: string | null;
          content: any;
          is_public: boolean;
          view_count: number;
          download_count: number;
          created_at: string;
          last_modified: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string;
          template_id?: string | null;
          content?: any;
          is_public?: boolean;
          view_count?: number;
          download_count?: number;
          created_at?: string;
          last_modified?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          template_id?: string | null;
          content?: any;
          is_public?: boolean;
          view_count?: number;
          download_count?: number;
          created_at?: string;
          last_modified?: string;
        };
      };
      resume_sections: {
        Row: {
          id: string;
          resume_id: string;
          section_type:
            | 'personal_info'
            | 'summary'
            | 'work_experience'
            | 'education'
            | 'skills'
            | 'projects'
            | 'certifications'
            | 'custom';
          content: any;
          display_order: number;
          is_visible: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          resume_id: string;
          section_type:
            | 'personal_info'
            | 'summary'
            | 'work_experience'
            | 'education'
            | 'skills'
            | 'projects'
            | 'certifications'
            | 'custom';
          content?: any;
          display_order?: number;
          is_visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          resume_id?: string;
          section_type?:
            | 'personal_info'
            | 'summary'
            | 'work_experience'
            | 'education'
            | 'skills'
            | 'projects'
            | 'certifications'
            | 'custom';
          content?: any;
          display_order?: number;
          is_visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      templates: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          category:
            | 'modern'
            | 'creative'
            | 'professional'
            | 'executive'
            | 'technical';
          preview_image: string | null;
          structure: any;
          is_premium: boolean;
          is_active: boolean;
          download_count: number;
          rating: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          category:
            | 'modern'
            | 'creative'
            | 'professional'
            | 'executive'
            | 'technical';
          preview_image?: string | null;
          structure?: any;
          is_premium?: boolean;
          is_active?: boolean;
          download_count?: number;
          rating?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          category?:
            | 'modern'
            | 'creative'
            | 'professional'
            | 'executive'
            | 'technical';
          preview_image?: string | null;
          structure?: any;
          is_premium?: boolean;
          is_active?: boolean;
          download_count?: number;
          rating?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      resume_shares: {
        Row: {
          id: string;
          resume_id: string;
          share_token: string;
          is_active: boolean;
          expires_at: string | null;
          view_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          resume_id: string;
          share_token?: string;
          is_active?: boolean;
          expires_at?: string | null;
          view_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          resume_id?: string;
          share_token?: string;
          is_active?: boolean;
          expires_at?: string | null;
          view_count?: number;
          created_at?: string;
        };
      };
      resume_versions: {
        Row: {
          id: string;
          resume_id: string;
          version_number: number;
          content: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          resume_id: string;
          version_number: number;
          content: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          resume_id?: string;
          version_number?: number;
          content?: any;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
