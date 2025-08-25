import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '@/screens/HomeScreen';
import EditTodoScreen from '@/screens/EditTodoScreen';
import { TodoId } from '@/types/todo';

export type RootStackParamList = {
  Home: undefined;
  EditTodo: { todoId?: TodoId };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="EditTodo" component={EditTodoScreen} />
    </Stack.Navigator>
  );
}
