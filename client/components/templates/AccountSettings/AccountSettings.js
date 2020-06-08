import React from 'react';

import ChangePassword from '_organisms/ChangePassword';
import ChangeUsername from '_organisms/ChangeUsername';

function Account() {
  return (
    <div className="account-settings">
      <ChangeUsername />
      <ChangePassword />
    </div>
  );
}

export default Account;
