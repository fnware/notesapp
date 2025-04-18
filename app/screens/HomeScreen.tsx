import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  SafeAreaView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Note, getNotes } from '../../lib/supabase';

interface NoteCardProps {
  title: string;
  content: string;
}

const NoteCard: React.FC<NoteCardProps> = ({ title, content }) => (
  <View style={styles.noteCard}>
    <Text style={styles.noteTitle}>{title}</Text>
    <Text style={styles.notePreview} numberOfLines={2}>
      {content}
    </Text>
  </View>
);

export default function HomeScreen() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const fetchedNotes = await getNotes();
      setNotes(fetchedNotes);
    } catch (error) {
      Alert.alert('Error', 'Failed to load notes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = () => {
    router.push('/(app)/note');
  };

  const handleNotePress = (id: string) => {
    router.push({
      pathname: '/(app)/note',
      params: { id }
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Notes</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddNote}>
          <Ionicons name="add" size={28} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleNotePress(item.id)}>
            <NoteCard title={item.title} content={item.content} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.notesList}
        refreshing={loading}
        onRefresh={loadNotes}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
  },
  addButton: {
    padding: 8,
  },
  notesList: {
    padding: 16,
  },
  noteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000000',
  },
  notePreview: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
}); 