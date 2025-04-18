import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { Note, getNotes, signOut, deleteNote } from './lib/supabase';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

interface NoteCardProps {
  title: string;
  content: string;
  onDelete: () => void;
}

const { width } = Dimensions.get('window');

const NoteCard: React.FC<NoteCardProps> = ({ title, content, onDelete }) => {
  const renderRightActions = () => {
    return (
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={onDelete}
      >
        <Ionicons name="trash-outline" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      rightThreshold={width * 0.3}
    >
      <View style={styles.noteCard}>
        <Text style={styles.noteTitle}>{title}</Text>
        <Text style={styles.notePreview} numberOfLines={2}>
          {content}
        </Text>
      </View>
    </Swipeable>
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotes = useCallback(async () => {
    try {
      const fetchedNotes = await getNotes();
      setNotes(fetchedNotes);
    } catch (error) {
      Alert.alert('Error', 'Failed to load notes');
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadNotes();
  }, []);

  // Refresh on focus
  useFocusEffect(
    useCallback(() => {
      if (!loading) {
        setRefreshing(true);
        loadNotes();
      }
    }, [loading, loadNotes])
  );

  const handleAddNote = () => {
    router.push("/note");
  };

  const handleNotePress = (id: string) => {
    router.push({
      pathname: "/note",
      params: { id }
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/auth");
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDeleteNote = useCallback(async (noteId: string) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteNote(noteId);
              setNotes(currentNotes => 
                currentNotes.filter(note => note.id !== noteId)
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to delete note');
              console.error(error);
            }
          }
        }
      ]
    );
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Notes</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.headerButton} onPress={handleAddNote}>
              <Ionicons name="add" size={28} color="#007AFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={handleSignOut}>
              <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              activeOpacity={1} 
              onPress={() => handleNotePress(item.id)}
            >
              <NoteCard 
                title={item.title} 
                content={item.content}
                onDelete={() => handleDeleteNote(item.id)}
              />
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.notesList}
          refreshing={refreshing}
          onRefresh={loadNotes}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
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
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
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
  deleteButton: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    marginBottom: 12,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
}); 