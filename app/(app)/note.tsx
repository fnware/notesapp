import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { createNote, getNote, updateNote } from '../lib/supabase';

export default function NoteScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const isEditing = Boolean(id);

  useEffect(() => {
    if (id) {
      loadNote();
    }
  }, [id]);

  const loadNote = async () => {
    try {
      setLoading(true);
      const note = await getNote(id as string);
      if (note) {
        setTitle(note.title);
        setContent(note.content);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load note');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Title is required');
      return;
    }

    try {
      setSaving(true);
      if (isEditing) {
        await updateNote(id as string, { title, content });
      } else {
        await createNote({ title, content });
      }
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to save note');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.titleInput}
            placeholder="Note Title"
            value={title}
            onChangeText={setTitle}
            maxLength={120}
          />
          <TextInput
            style={styles.contentInput}
            placeholder="Start typing..."
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Saving...' : 'Save Note'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  inputContainer: {
    padding: 16,
    flex: 1,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000000',
  },
  contentInput: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
    minHeight: 200,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 