export default function status(state = { writing: false, error: null }, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return { writing: true, error: null };
    case 'ADD_TODO_REJECTED':
      return { writing: true, error: null };
    case 'ADD_TODO_RESOLVED':
      return { writing: true, error: null };
    default:
      return state;
  }
}
