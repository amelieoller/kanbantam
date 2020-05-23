import update from 'immutability-helper';

import { SET_BOARD, REMOVE_BOARD } from '_actions/board';

// import { LOGOUT_USER } from '_actions/user';

// export function board(state = {}, action) {
//   switch (action.type) {
//     case ADD_BOARD:
//       return update(state, {
//         id: { $set: action.id },
//         title: { $set: action.title },
//         createdAt: { $set: action.createdAt },
//       });
//     case UPDATE_BOARD:
//       return update(state, {
//         title: { $set: action.title },
//         updatedAt: { $set: action.updatedAt },
//       });
//     default:
//       return state;
//   }
// }

export default function boards(state = {}, action) {
  switch (action.type) {
    case SET_BOARD:
      return update(state, { $set: action.board });
    case REMOVE_BOARD:
      return {};
    default:
      return state;
  }
}
