import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { attemptUpdatePassword } from '_thunks/user';
import { validatePassword } from '_utils/validation';
import Button from '_atoms/Button';
import Input from '_atoms/Input';

const ChangePassword = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(R.pick(['user']));

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [valid, setValid] = useState(false);

  const match = newPassword === confirmPassword;

  const updateOldPassword = (e) => setOldPassword(e.target.value);
  const updateConfirmPassword = (e) => setConfirmPassword(e.target.value);

  const handleValidatePassword = (username, password) => {
    const { valid, message } = validatePassword(username, password);
    setValid(valid);
    setMessage(message);
  };

  const updateNewPassword = (e) => {
    setNewPassword(e.target.value);
    handleValidatePassword(user.username, e.target.value);
  };

  const save = () => {
    if (valid && newPassword === confirmPassword && oldPassword) {
      dispatch(attemptUpdatePassword({ oldPassword, newPassword }))
        .then(() => {
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');
          setMessage('');
          setValid(false);
        })
        .catch(R.identity);
    }
  };

  return (
    <FormWrapper>
      <InputWrapper>
        <Input
          label="Old Password"
          type="password"
          value={oldPassword}
          onChange={updateOldPassword}
        />
        <ForgotPassword>
          <Link to="/recovery">Forgot your password?</Link>
        </ForgotPassword>
      </InputWrapper>

      <InputWrapper>
        <Input
          label="New Password"
          type="password"
          value={newPassword}
          onChange={updateNewPassword}
        />

        {newPassword && <AlertMessage valid={valid}>{message}</AlertMessage>}
      </InputWrapper>

      <InputWrapper>
        <Input
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={updateConfirmPassword}
        />

        {confirmPassword && (
          <AlertMessage match={match}>
            {match ? 'Passwords match' : 'Passwords must match'}
          </AlertMessage>
        )}
      </InputWrapper>

      <Button onClick={save} disabled={!match || !valid || !oldPassword} label="Update Password">
        Update Password
      </Button>
    </FormWrapper>
  );
};

const FormWrapper = styled.div``;

const InputWrapper = styled.div`
  margin-bottom: 1rem;
`;

const AlertMessage = styled.div`
  color: ${({ valid, match }) => (valid || match ? 'green' : 'red')};
  text-align: right;
  font-size: 1rem;
`;

const ForgotPassword = styled.div`
  text-align: right;
  font-size: 1rem;
`;

export default ChangePassword;
