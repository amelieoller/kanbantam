import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ConfirmDeleteItem from '_organisms/ConfirmDeleteItem';

export default function ConfirmModal({ confirm, closeModal, deleteItem }) {
  const modalClasses = classNames({
    modal: true,
    'confirm-modal': true,
    'is-active': confirm,
  });

  return (
    <div className={modalClasses}>
      <div className="modal-background" />
      <div className="modal-content">
        <ConfirmDeleteItem closeModal={closeModal} deleteItem={deleteItem} />
      </div>
      <button
        type="button"
        className="modal-close is-large"
        aria-label="close"
        onClick={closeModal}
      />
    </div>
  );
}

ConfirmModal.propTypes = {
  confirm: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
};
