import React from 'react';
import PropTypes from 'prop-types';

import Register from '_organisms/Register';

function RegisterSection({ setIsLogin }) {
  return (
    <div className="register-secction section">
      <Register setIsLogin={setIsLogin} />
    </div>
  );
}

RegisterSection.propTypes = {
  setIsLogin: PropTypes.func.isRequired,
};

export default RegisterSection;
