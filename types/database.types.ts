export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          phone: string | null;
          user_type: "client" | "lawyer";
          location: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          phone?: string | null;
          user_type: "client" | "lawyer";
          location?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          phone?: string | null;
          user_type?: "client" | "lawyer";
          location?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      lawyers: {
        Row: {
          id: string;
          bar_number: string;
          specializations: string[];
          wilayas: string[];
          experience_years: number;
          hourly_rate: number | null;
          bio: string | null;
          is_verified: boolean;
          is_available: boolean;
          total_consultations: number;
          average_rating: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          bar_number: string;
          specializations: string[];
          wilayas: string[];
          experience_years?: number;
          hourly_rate?: number | null;
          bio?: string | null;
          is_verified?: boolean;
          is_available?: boolean;
          total_consultations?: number;
          average_rating?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          bar_number?: string;
          specializations?: string[];
          wilayas?: string[];
          experience_years?: number;
          hourly_rate?: number | null;
          bio?: string | null;
          is_verified?: boolean;
          is_available?: boolean;
          total_consultations?: number;
          average_rating?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      consultations: {
        Row: {
          id: string;
          client_id: string;
          lawyer_id: string;
          title: string;
          description: string;
          specialization: string;
          status:
            | "pending"
            | "accepted"
            | "in_progress"
            | "completed"
            | "cancelled";
          consultation_type: "chat" | "video" | "phone";
          scheduled_at: string | null;
          duration_minutes: number;
          price: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          lawyer_id: string;
          title: string;
          description: string;
          specialization: string;
          status?:
            | "pending"
            | "accepted"
            | "in_progress"
            | "completed"
            | "cancelled";
          consultation_type: "chat" | "video" | "phone";
          scheduled_at?: string | null;
          duration_minutes?: number;
          price: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          lawyer_id?: string;
          title?: string;
          description?: string;
          specialization?: string;
          status?:
            | "pending"
            | "accepted"
            | "in_progress"
            | "completed"
            | "cancelled";
          consultation_type?: "chat" | "video" | "phone";
          scheduled_at?: string | null;
          duration_minutes?: number;
          price?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          consultation_id: string;
          sender_id: string;
          content: string;
          message_type: "text" | "file" | "image";
          file_url: string | null;
          file_name: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          consultation_id: string;
          sender_id: string;
          content: string;
          message_type?: "text" | "file" | "image";
          file_url?: string | null;
          file_name?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          consultation_id?: string;
          sender_id?: string;
          content?: string;
          message_type?: "text" | "file" | "image";
          file_url?: string | null;
          file_name?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          consultation_id: string;
          client_id: string;
          lawyer_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          consultation_id: string;
          client_id: string;
          lawyer_id: string;
          rating: number;
          comment?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          consultation_id?: string;
          client_id?: string;
          lawyer_id?: string;
          rating?: number;
          comment?: string | null;
          created_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          consultation_id: string;
          client_id: string;
          lawyer_id: string;
          amount: number;
          platform_fee: number;
          lawyer_earning: number;
          payment_method: string;
          payment_status: "pending" | "completed" | "failed" | "refunded";
          stripe_payment_intent_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          consultation_id: string;
          client_id: string;
          lawyer_id: string;
          amount: number;
          platform_fee: number;
          lawyer_earning: number;
          payment_method: string;
          payment_status?: "pending" | "completed" | "failed" | "refunded";
          stripe_payment_intent_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          consultation_id?: string;
          client_id?: string;
          lawyer_id?: string;
          amount?: number;
          platform_fee?: number;
          lawyer_earning?: number;
          payment_method?: string;
          payment_status?: "pending" | "completed" | "failed" | "refunded";
          stripe_payment_intent_id?: string | null;
          created_at?: string;
        };
      };
      // NOUVELLES TABLES POUR LES NOTIFICATIONS
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          email_notifications: boolean;
          push_notifications: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email_notifications?: boolean;
          push_notifications?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email_notifications?: boolean;
          push_notifications?: boolean;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: "email" | "push";
          status: "sent" | "failed" | "pending";
          sent_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          type: "email" | "push";
          status?: "sent" | "failed" | "pending";
          sent_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string;
          type?: "email" | "push";
          status?: "sent" | "failed" | "pending";
          sent_at?: string | null;
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
