import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Database } from './database.types';

// Replace these with your Supabase project credentials
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

export const getNotes = async (): Promise<Note[]> => {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getNote = async (id: string): Promise<Note | null> => {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const createNote = async (note: NoteInput): Promise<Note> => {
  const { data, error } = await supabase
    .from('notes')
    .insert([note])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateNote = async (id: string, note: Partial<NoteInput>): Promise<Note> => {
  const { data, error } = await supabase
    .from('notes')
    .update(note)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteNote = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id);

  if (error) throw error;
}; 