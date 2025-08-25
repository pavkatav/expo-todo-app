export const validateTodoTitle = (title: string): string | null => {
  const trimmed = title.trim();

  if (!trimmed) {
    return 'Title is required';
  }

  if (trimmed.length > 120) {
    return 'Title must be 120 characters or less';
  }

  return null;
};

export const validateTodoNotes = (notes: string): string | null => {
  if (notes && notes.length > 500) {
    return 'Notes must be 500 characters or less';
  }

  return null;
};

export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};
