import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export default function HomeScreen() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);

  function handleAddTask() {
    const title = task.trim();

    if (title === '') {
      return;
    }

    setTasks([
      ...tasks,
      {
        id: Date.now().toString(),
        title,
        completed: false,
      },
    ]);
    setTask('');
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
          onSubmitEditing={handleAddTask}
          returnKeyType="done"
          style={styles.input}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add task"
          onPress={handleAddTask}
          style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}>
          <MaterialIcons name="add" size={22} color="#fff" />
        </Pressable>
      </View>

      <View style={styles.taskList}>
        {tasks.length === 0 ? (
          <Text style={styles.emptyText}>No tasks yet.</Text>
        ) : (
          tasks.map((item) => (
            <View key={item.id} style={styles.taskRow}>
              <MaterialIcons
                name={item.completed ? 'check-box' : 'check-box-outline-blank'}
                size={20}
                color={item.completed ? '#2E5BBA' : '#5A6472'}
              />
              <Text style={styles.taskText}>{item.title}</Text>
            </View>
          ))
        )}
      </View>
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
  taskList: {
    marginTop: 24,
    gap: 10,
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
  taskText: {
    color: '#152033',
    flex: 1,
    fontSize: 16,
  },
  emptyText: {
    color: '#7C8796',
    fontSize: 15,
  },
});
