import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import * as R from 'ramda';

import Button from '_atoms/Button';
import Input from '_atoms/Input';
import { attemptLogin, attemptRegister } from '_thunks/auth';
import useKeyPress from '_hooks/useKeyPress';
import { validateUsername, validatePassword } from '_utils/validation';
import { postCheckUsername } from '_api/users';

function Login() {
  const dispatch = useDispatch();

  const [remember, setRemember] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  useEffect(() => {
    const username = localStorage.getItem('username');

    if (username) {
      setRemember(true);
      setUsername(username);
    }
  }, []);

  useEffect(() => {
    setUsernameMessage('');
    setPasswordMessage('');
  }, [isLogin]);

  const login = () => {
    const userCredentials = { username, password: password };

    if (remember) {
      localStorage.setItem('username', username);
    }

    dispatch(attemptLogin(userCredentials)).catch(R.identity);
  };

  const signup = () => {
    if (usernameAvailable && passwordValid) {
      const newUser = {
        username,
        password,
      };

      dispatch(attemptRegister(newUser)).catch(R.identity);
    }
  };

  useKeyPress('Enter', isLogin ? login : signup);

  const rememberMe = () => {
    localStorage.removeItem('username');
    setRemember(!remember);
  };

  const checkUsername = (newUsername) => {
    const { valid, message } = validateUsername(newUsername);

    if (valid) {
      setUsernameMessage('Checking username...');
      setUsernameAvailable(false);

      postCheckUsername(newUsername)
        .then((res) => {
          setUsernameAvailable(res.available);
          setUsernameMessage(res.message);
        })
        .catch(R.identity);
    } else {
      setUsernameAvailable(valid);
      setUsernameMessage(message);
    }
  };

  const checkPassword = (newUsername, newPassword) => {
    const { valid, message } = validatePassword(newUsername, newPassword);

    setPasswordValid(valid);
    setPasswordMessage(message);
  };

  const handleUsernameChange = ({ target: { value } }) => {
    setUsername(value);
    if (!isLogin) checkUsername(value);
  };

  const handlePasswordChange = ({ target: { value } }) => {
    setPassword(value);
    if (!isLogin) checkPassword(username, value);
  };

  return (
    <StyledLogin>
      <h1>{isLogin ? 'Login' : 'Signup'}</h1>
      <InputWrapper>
        <Input label="Username" onChange={handleUsernameChange} value={username} />
        {!isLogin && <Message>{usernameMessage}</Message>}
      </InputWrapper>
      <InputWrapper>
        <Input label="Password" type="password" onChange={handlePasswordChange} />
        {!isLogin ? (
          <Message>{passwordMessage}</Message>
        ) : (
          <RememberMe>
            <label>
              <input name="rememberMe" type="checkbox" checked={remember} onChange={rememberMe} />
              Remember me
            </label>
          </RememberMe>
        )}
      </InputWrapper>
      <ButtonWrapper>
        <Button onClick={isLogin ? login : signup} label="Log in">
          {isLogin ? 'Log In' : 'Sign Up'}
        </Button>
      </ButtonWrapper>

      <NoAccountYet>
        {isLogin ? "Don't have an account yet?" : 'Already have an account?'}
        <button onClick={() => setIsLogin((prevLogin) => !prevLogin)}>
          {isLogin ? 'Sign Up' : 'Log In'}
        </button>
      </NoAccountYet>
    </StyledLogin>
  );
}

const StyledLogin = styled.div``;

const InputWrapper = styled.div`
  margin-bottom: 0.8rem;
`;

const Message = styled.div`
  text-align: right;
`;

const ButtonWrapper = styled.div`
  button {
    margin-left: auto;
    margin-top: 1rem;
  }
`;

const RememberMe = styled.div`
  color: ${({ theme }) => theme.colors.disabled('onBackground')};

  label {
    cursor: pointer;
    display: flex;
    justify-content: flex-end;
    margin-top: 0.4rem;

    input {
      margin-right: 3px;
    }
  }
`;

const NoAccountYet = styled.div`
  text-align: center;
  font-style: italic;
  margin-top: 3.5rem;
  color: ${({ theme }) => theme.colors.disabled('onBackground')};

  button {
    border: none;
    padding: 0 4px;
    background: none;
    color: ${({ theme }) => theme.colors.medium('onBackground')};
    cursor: pointer;
  }
`;

Login.propTypes = {};

export default Login;
