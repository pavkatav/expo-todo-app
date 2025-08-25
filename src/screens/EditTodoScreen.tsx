import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/app/navigation/RootNavigator';
import { useTodoStore } from '@/store/useTodoStore';
import { Todo } from '@/types/todo';
import Header from '@/components/Header';
import TodoEditor from '@/components/TodoEditor';

type EditTodoScreenRouteProp = RouteProp<RootStackParamList, 'EditTodo'>;
type EditTodoScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'EditTodo'
>;

interface EditTodoScreenProps {
  route: EditTodoScreenRouteProp;
  navigation: EditTodoScreenNavigationProp;
}

export default function EditTodoScreen({
  route,
  navigation,
}: EditTodoScreenProps) {
  const { todoId } = route.params;
  const { todos, addTodo, updateTodo } = useTodoStore();

  const todo = todoId ? todos.find((t: Todo) => t.id === todoId) : undefined;
  const isEditing = !!todo;

  const handleSave = (todoData: {
    title: string;
    notes?: string;
    dueDate?: string;
  }) => {
    if (isEditing && todo) {
      updateTodo(todo.id, todoData);
    } else {
      addTodo({
        ...todoData,
        completed: false,
      });
    }
    navigation.goBack();
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header
        title={isEditing ? 'Edit Todo' : 'New Todo'}
        showBack
        onBackPress={handleCancel}
      />

      <TodoEditor todo={todo} onSave={handleSave} onCancel={handleCancel} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
