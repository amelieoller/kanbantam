import { SET_CURRENT_TODO, CLEAR_CURRENT_TODO } from '_actions/currentTodo';
import { CLEAR_DATA } from '_actions/user';

function currentTodo(state = {}, action) {
  switch (action.type) {
    case SET_CURRENT_TODO:
      return action.todo;
    case CLEAR_CURRENT_TODO:
      return {};
    case CLEAR_DATA:
      return {};
    default:
      return state;
  }
}

export default currentTodo;
