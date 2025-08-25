import { create } from 'zustand';
import { Todo, TodoId, FilterType, SortType, TodoStore } from '@/types/todo';
import { generateId } from '@/utils/validators';
import { createDateString } from '@/utils/date';
import { loadTodos, saveTodos } from '@/storage/todoStorage';

const filterTodos = (
  todos: Todo[],
  query: string,
  filter: FilterType
): Todo[] => {
  let filtered = todos;

  // Apply text search
  if (query.trim()) {
    const searchTerm = query.toLowerCase();
    filtered = filtered.filter(
      todo =>
        todo.title.toLowerCase().includes(searchTerm) ||
        todo.notes?.toLowerCase().includes(searchTerm)
    );
  }

  // Apply status filter
  switch (filter) {
    case 'active':
      filtered = filtered.filter(todo => !todo.completed);
      break;
    case 'completed':
      filtered = filtered.filter(todo => todo.completed);
      break;
    case 'all':
    default:
      break;
  }

  return filtered;
};

const sortTodos = (todos: Todo[], sort: SortType): Todo[] => {
  const sorted = [...todos];

  switch (sort) {
    case 'dueDate':
      return sorted.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    case 'alphabetical':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'default':
    default:
      // Active first, then by createdAt desc; Completed by completedAt asc
      return sorted.sort((a, b) => {
        if (a.completed && !b.completed) return 1;
        if (!a.completed && b.completed) return -1;

        if (!a.completed && !b.completed) {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }

        if (a.completed && b.completed) {
          const aCompletedAt = a.completedAt || a.createdAt;
          const bCompletedAt = b.completedAt || b.createdAt;
          return (
            new Date(aCompletedAt).getTime() - new Date(bCompletedAt).getTime()
          );
        }

        return 0;
      });
  }
};

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  query: '',
  filter: 'all',
  sort: 'default',

  addTodo: (todoData: Omit<Todo, 'id' | 'createdAt'>) => {
    const newTodo: Todo = {
      ...todoData,
      id: generateId(),
      createdAt: createDateString(new Date()),
      completed: false,
    };

    set(state => {
      const newTodos = [...state.todos, newTodo];
      saveTodos(newTodos);
      return { todos: newTodos };
    });
  },

  updateTodo: (id: TodoId, updates: Partial<Todo>) => {
    set(state => {
      const newTodos = state.todos.map(todo =>
        todo.id === id ? { ...todo, ...updates } : todo
      );
      saveTodos(newTodos);
      return { todos: newTodos };
    });
  },

  deleteTodo: (id: TodoId) => {
    set(state => {
      const newTodos = state.todos.filter(todo => todo.id !== id);
      saveTodos(newTodos);
      return { todos: newTodos };
    });
  },

  toggleComplete: (id: TodoId) => {
    set(state => {
      const newTodos = state.todos.map(todo => {
        if (todo.id === id) {
          const completed = !todo.completed;
          return {
            ...todo,
            completed,
            completedAt: completed ? createDateString(new Date()) : undefined,
          };
        }
        return todo;
      });
      saveTodos(newTodos);
      return { todos: newTodos };
    });
  },

  bulkSet: (todos: Todo[]) => {
    set({ todos });
    saveTodos(todos);
  },

  setQuery: (query: string) => {
    set({ query });
  },

  setFilter: (filter: FilterType) => {
    set({ filter });
  },

  setSort: (sort: SortType) => {
    set({ sort });
  },

  visibleTodos: () => {
    const { todos, query, filter, sort } = get();
    const filtered = filterTodos(todos, query, filter);
    return sortTodos(filtered, sort);
  },
}));

// Initialize store with persisted data
export const initializeTodoStore = async () => {
  try {
    const savedTodos = await loadTodos();
    useTodoStore.getState().bulkSet(savedTodos);
  } catch (error) {
    console.error('Failed to initialize todo store:', error);
  }
};
