import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { isSupabaseConfigured, supabase } from '@/lib/supabase';

type Task = {
  id: string;
  title: string;
  completed: boolean;
  created_at?: string;
};

export default function HomeScreen() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const loadTasks = useCallback(async () => {
    if (!supabase) {
      setMessage('Add your Supabase URL and anon key in lib/supabase.ts.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    setIsLoading(false);

    if (error) {
      console.log('Error loading tasks:', error.message);
      setMessage('Could not load tasks. Check the Expo terminal for details.');
      return;
    }

    setTasks(data ?? []);
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  async function addTask() {
    const title = task.trim();

    if (title === '' || !supabase) {
      return;
    }

    const { error } = await supabase.from('tasks').insert([{ title, completed: false }]);

    if (error) {
      console.log('Error adding task:', error.message);
      setMessage('Could not add task. Check the Expo terminal for details.');
      return;
    }

    setTask('');
    loadTasks();
  }

  async function toggleTask(item: Task) {
    if (!supabase) {
      return;
    }

    const { error } = await supabase
      .from('tasks')
      .update({ completed: !item.completed })
      .eq('id', item.id);

    if (error) {
      console.log('Error updating task:', error.message);
      setMessage('Could not update task. Check the Expo terminal for details.');
      return;
    }

    loadTasks();
  }

  async function deleteTask(id: string) {
    if (!supabase) {
      return;
    }

    const { error } = await supabase.from('tasks').delete().eq('id', id);

    if (error) {
      console.log('Error deleting task:', error.message);
      setMessage('Could not delete task. Check the Expo terminal for details.');
      return;
    }

    loadTasks();
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>TaskFlow</Text>
        <Text style={styles.subtitle}>Today&apos;s tasks</Text>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          placeholder="Enter Task"
          placeholderTextColor="#7C8796"
          value={task}
          onChangeText={setTask}
          onSubmitEditing={addTask}
          returnKeyType="done"
          style={styles.input}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add task"
          onPress={addTask}
          style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}>
          <MaterialIcons name="add" size={22} color="#fff" />
        </Pressable>
      </View>

      {message ? <Text style={styles.messageText}>{message}</Text> : null}

      <FlatList
        contentContainerStyle={styles.taskListContent}
        data={tasks}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {isLoading
              ? 'Loading tasks...'
              : isSupabaseConfigured
                ? 'No tasks yet.'
                : 'Supabase is not connected yet.'}
          </Text>
        }
        renderItem={({ item }) => (
          <Pressable onLongPress={() => deleteTask(item.id)} onPress={() => toggleTask(item)}>
            {({ pressed }) => (
              <View style={[styles.taskRow, pressed && styles.taskRowPressed]}>
                <MaterialIcons
                  name={item.completed ? 'check-box' : 'check-box-outline-blank'}
                  size={20}
                  color={item.completed ? '#2E5BBA' : '#5A6472'}
                />
                <Text style={[styles.taskText, item.completed && styles.taskTextCompleted]}>
                  {item.title}
                </Text>
              </View>
            )}
          </Pressable>
        )}
        style={styles.taskList}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F7FB',
    paddingHorizontal: 20,
    paddingTop: 72,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    color: '#152033',
    fontSize: 34,
    fontWeight: '700',
  },
  subtitle: {
    color: '#5A6472',
    fontSize: 16,
    marginTop: 4,
  },
  inputRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#D8E0EA',
    borderRadius: 8,
    borderWidth: 1,
    color: '#152033',
    flex: 1,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: '#2E5BBA',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  addButtonPressed: {
    backgroundColor: '#244B9D',
  },
  messageText: {
    color: '#9A5B17',
    fontSize: 14,
    marginTop: 12,
  },
  taskList: {
    flex: 1,
    marginTop: 24,
  },
  taskListContent: {
    gap: 10,
    paddingBottom: 24,
  },
  taskRow: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#E1E7F0',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  taskRowPressed: {
    backgroundColor: '#EDF3FF',
  },
  taskText: {
    color: '#152033',
    flex: 1,
    fontSize: 16,
  },
  taskTextCompleted: {
    color: '#7C8796',
    textDecorationLine: 'line-through',
  },
  emptyText: {
    color: '#7C8796',
    fontSize: 15,
  },
});
