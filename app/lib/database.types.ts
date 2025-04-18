export interface Database {
  public: {
    Tables: {
      notes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          tags: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          content: string;
          tags?: string[] | null;
        };
        Update: {
          title?: string;
          content?: string;
          tags?: string[] | null;
        };
      };
    };
  };
} 