import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { parseISO, formatDistanceToNow } from 'date-fns';
import styled from 'styled-components';
import * as R from 'ramda';
import { Droppable, Draggable } from 'react-beautiful-dnd';

import { attemptUpdateList, attemptDeleteList } from '_thunks/lists';
import ConfirmModal from '_organisms/ConfirmModal';
import Todo from '_molecules/Todo';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  transition: background-color 0.2s ease, opacity 0.1s ease;
  user-select: none;
  background-color: rgb(235, 236, 240);
  padding-bottom: 0;
  border-bottom-right-radius: ${({ theme }) => theme.sizes.borderRadius};
  border-bottom-left-radius: ${({ theme }) => theme.sizes.borderRadius};
`;

const DropZone = styled.div`
  /* stop the list collapsing when empty */
  min-height: 100px;
  /* not relying on the items for a margin-bottom as it will collapse when the list is empty */
  margin: 5px;
`;

const ScrollContainer = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  max-height: ${({ listHeight }) => listHeight}px;
`;

const fromNow = (date) => formatDistanceToNow(parseISO(date), { addSuffix: true });

const List = ({ listId, todos, title, boardId, listHeight }) => {
  const id = listId;

  const dispatch = useDispatch();

  const [currentTitle, setCurrentTitle] = useState(title);
  const [edit, setEdit] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const openModal = () => setConfirm(true);
  const closeModal = () => setConfirm(false);
  const updateTitle = (e) => setCurrentTitle(e.target.value);
  const editList = () => setEdit(true);

  const cancelEdit = () => {
    setEdit(false);
    setCurrentTitle(title);
  };

  const handleUpdateList = () => {
    if (currentTitle) {
      dispatch(attemptUpdateList(id, currentTitle)).then(() => setEdit(false));
    }
  };

  return (
    <Droppable
      droppableId={listId}
      isCombineEnabled={false} // if set to true makes it possible to combine cards (it removes the item that was dragging)
    >
      {(dropProvided, dropSnapshot) => (
        <Wrapper
          isDraggingOver={dropSnapshot.isDraggingOver}
          isDraggingFrom={Boolean(dropSnapshot.draggingFromThisWith)}
          {...dropProvided.droppableProps}
        >
          <ScrollContainer listHeight={listHeight}>
            <>
              {title}
              <DropZone ref={dropProvided.innerRef}>
                {todos.map((todo, index) => (
                  <Draggable
                    key={todo.id}
                    draggableId={todo.id}
                    index={index}
                    shouldRespectForceTouch={false}
                  >
                    {(dragProvided, dragSnapshot) => (
                      <Todo
                        key={todo.id}
                        todo={todo}
                        isDragging={dragSnapshot.isDragging}
                        provided={dragProvided}
                      />
                    )}
                  </Draggable>
                ))}
                {dropProvided.placeholder}
              </DropZone>
            </>
          </ScrollContainer>
        </Wrapper>
      )}
    </Droppable>
  );
};

// List.propTypes = {
//   id: PropTypes.string.isRequired,
//   title: PropTypes.string.isRequired,
//   createdAt: PropTypes.string.isRequired,
//   updatedAt: PropTypes.string,
//   boardId: PropTypes.string.isRequired,
// };

// List.defaultProps = {
//   updatedAt: null,
// };

export default List;

// function List({ id, title, createdAt, updatedAt, boardId }) {
//   const dispatch = useDispatch();
//   const { todos } = useSelector(R.pick(['todos']));

//   const [currentTitle, setCurrentTitle] = useState(title);
//   const [edit, setEdit] = useState(false);
//   const [confirm, setConfirm] = useState(false);
//   const [updatedMessage, setUpdatedMessage] = useState('');
//   const [createdMessage, setCreatedMessage] = useState('');

//   const updateMessages = () => {
//     setUpdatedMessage(updatedAt ? fromNow(updatedAt) : '');
//     setCreatedMessage(fromNow(createdAt));
//   };

//   useEffect(() => {
//     updateMessages();
//     const interval = window.setInterval(updateMessages, 1000);

//     return () => clearInterval(interval);
//   }, [updatedAt]);

//   const openModal = () => setConfirm(true);
//   const closeModal = () => setConfirm(false);
//   const updateTitle = (e) => setCurrentTitle(e.target.value);
//   const editList = () => setEdit(true);

//   const cancelEdit = () => {
//     setEdit(false);
//     setCurrentTitle(title);
//   };

//   const handleUpdateList = () => {
//     if (currentTitle) {
//       dispatch(attemptUpdateList(id, currentTitle)).then(() => setEdit(false));
//     }
//   };

//   const deleteList = () => dispatch(attemptDeleteList(id));

//   return (
//     <Draggable draggableId={id} disableInteractiveElementBlocking>
//       {(provided, snapshot) => (
//         <StyledList>
//           {title}
//           {todos
//             .filter((todo) => todo.list === id)
//             .map((todo) => (
//               <Todo key={todo.id} todo={todo} />
//             ))}

//           <AddTodo boardId={boardId} listId={id} />
//         </StyledList>
//       )}
//     </Draggable>
//   );
// }

// List.propTypes = {
//   id: PropTypes.string.isRequired,
//   title: PropTypes.string.isRequired,
//   createdAt: PropTypes.string.isRequired,
//   updatedAt: PropTypes.string,
//   boardId: PropTypes.string.isRequired,
// };

// List.defaultProps = {
//   updatedAt: null,
// };

// export default List;

//  {/* <li className="list box">
//       <article className="media">
//         <div className="media-content">
//           <div className="content">
//             <p>
//               <small>{`created ${createdMessage}`}</small>
//             </p>
//             {edit ? (
//               <textarea
//                 className="textarea"
//                 value={currentTitle}
//                 onChange={updateTitle}
//               />
//             ) : (
//               <p>{title}</p>
//             )}
//           </div>

//           <nav className="level is-mobile">
//             <div className="level-left">
//               {!!updatedAt && <small>{`edited ${updatedMessage}`}</small>}
//             </div>
//             <div className="level-right">
//               {edit ? (
//                 <span
//                   className="icon space-right"
//                   onClick={handleUpdateList}
//                   onKeyPress={handleUpdateList}
//                 >
//                   <FontAwesomeIcon icon={faSave} size="lg" />
//                 </span>
//               ) : (
//                 <span
//                   className="icon space-right"
//                   onClick={editList}
//                   onKeyPress={editList}
//                 >
//                   <FontAwesomeIcon icon={faPencilAlt} size="lg" />
//                 </span>
//               )}
//               {edit ? (
//                 <span className="icon" onClick={cancelEdit} onKeyPress={cancelEdit}>
//                   <FontAwesomeIcon icon={faBan} size="lg" />
//                 </span>
//               ) : (
//                 <span className="icon" onClick={openModal} onKeyPress={cancelEdit}>
//                   <FontAwesomeIcon icon={faTrashAlt} size="lg" />
//                 </span>
//               )}
//             </div>
//           </nav>
//         </div>
//       </article>

//       <h2>Add new Todo:</h2>
//       <AddTodo boardId={boardId} listId={id} />

//       <h2>All todos for this list:</h2>
//       <TodoPage boardId={boardId} listId={id} />

//       <ConfirmModal confirm={confirm} closeModal={closeModal} deleteItem={deleteList} /> */}
//     // </>
