import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define database types inline
type Database = {
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
          user_id?: string;
        };
        Update: {
          title?: string;
          content?: string;
          tags?: string[] | null;
        };
      };
    };
  };
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface NoteInput {
  title: string;
  content: string;
  tags?: string[];
}

// Auth functions
export const signIn = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
};

export const signUp = async (email: string, password: string) => {
  // For development, we'll use auto-confirm
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // This will automatically confirm the email
      emailRedirectTo: `${supabaseUrl}/auth/v1/callback`,
      data: {
        // You can add additional user metadata here
        confirmed_at: new Date().toISOString(),
      },
    },
  });

  if (error) throw error;
  
  // If we have a user, they're automatically confirmed
  if (data.user) {
    // Sign them in immediately
    await signIn(email, password);
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Updated note functions to work with authenticated user
export const getNotes = async (): Promise<Note[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getNote = async (id: string): Promise<Note | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const createNote = async (note: NoteInput): Promise<Note> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('notes')
    .insert([{ ...note, user_id: user.id }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateNote = async (id: string, note: Partial<NoteInput>): Promise<Note> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('notes')
    .update(note)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteNote = async (id: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;
}; 