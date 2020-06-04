import React from 'react';
import PropTypes from 'prop-types';

import Login from '_organisms/Login';

function LoginSection({ setIsLogin }) {
  return (
    <div className="login-section section">
      <Login setIsLogin={setIsLogin} />
    </div>
  );
}

LoginSection.propTypes = {
  setIsLogin: PropTypes.func.isRequired,
};

export default LoginSection;
