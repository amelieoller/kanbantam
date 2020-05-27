import React from 'react';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { format } from 'date-fns';

import { attemptUpdateTodo, attemptDeleteTodo } from '_thunks/todos';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#app');

function TodoModal({ todo }) {
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = React.useState(false);
  const [updatedTodo, setUpdatedTodo] = React.useState({
    text: '',
    minutes: 0,
    category: '',
    dueDate: '',
    difficulty: 0,
    completed: false,
    ...todo,
  });

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const updateTodo = (e) => {
    const { name, value } = e.target;

    setUpdatedTodo((prevTodo) => ({ ...prevTodo, [name]: value }));
  };

  const setDate = (e) => {
    const { value } = e.target;
    let newValue = new Date(value.replace(/-/g, '/').replace(/T.+/, ''));

    setUpdatedTodo((prevTodo) => ({ ...prevTodo, dueDate: newValue }));
  };

  const toggleCompleted = () => {
    setUpdatedTodo((prevTodo) => ({ ...prevTodo, completed: !prevTodo.completed }));
  };

  const handleUpdateTodo = () => {
    if (updatedTodo.text) {
      dispatch(attemptUpdateTodo(updatedTodo)).then(closeModal);
    }
  };

  const deleteTodo = () => dispatch(attemptDeleteTodo(todo.id));

  return (
    <div>
      <button onClick={openModal}>Edit</button>
      <Modal isOpen={isOpen} onRequestClose={closeModal} style={customStyles}>
        <input
          type="text"
          name="text"
          value={updatedTodo.text}
          onChange={updateTodo}
          placeholder="Edit Todo"
        />
        <br />
        <input
          type="number"
          name="minutes"
          value={updatedTodo.minutes}
          onChange={updateTodo}
          placeholder="Minutes"
        />
        <br />
        <input
          type="text"
          name="category"
          value={updatedTodo.category}
          onChange={updateTodo}
          placeholder="Category"
        />
        <br />
        <input
          type="date"
          name="dueDate"
          value={
            updatedTodo.dueDate && format(new Date(updatedTodo.dueDate), 'yyyy-MM-dd')
          }
          onChange={setDate}
          placeholder="Due Date"
        />
        <br />
        <input
          type="number"
          name="difficulty"
          value={updatedTodo.difficulty}
          onChange={updateTodo}
          placeholder="Difficulty"
          max="3"
        />
        <br />
        {updatedTodo.completed ? (
          <button name="completed" onClick={toggleCompleted}>
            Undo Done
          </button>
        ) : (
          <button name="completed" onClick={toggleCompleted}>
            Done
          </button>
        )}
        <button onClick={deleteTodo}>Delete</button>
        <button onClick={handleUpdateTodo}>Save</button>
      </Modal>
    </div>
  );
}

export default TodoModal;
