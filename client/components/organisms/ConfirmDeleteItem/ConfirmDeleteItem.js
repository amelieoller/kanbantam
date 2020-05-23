import React from 'react';
import PropTypes from 'prop-types';

export default function ConfirmDeleteItem({ closeModal, deleteItem }) {
  return (
    <div className="card">
      <div className="card-content">
        <div className="content has-text-centered">
          Are you sure you wanted to delete this item?
        </div>
      </div>
      <footer className="card-footer">
        <a className="card-footer-item" onClick={closeModal} onKeyPress={closeModal}>
          Cancel
        </a>
        <a className="card-footer-item" onClick={deleteItem} onKeyPress={deleteItem}>
          Delete
        </a>
      </footer>
    </div>
  );
}

ConfirmDeleteItem.propTypes = {
  closeModal: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
};
