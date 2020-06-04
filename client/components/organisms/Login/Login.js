import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as R from 'ramda';

import useKeyPress from '_hooks/useKeyPress';
import { attemptLogin } from '_thunks/auth';
import Input from '_atoms/Input';
import Button from '_atoms/Button';

function Login({ setIsLogin }) {
  const dispatch = useDispatch();

  const [remember, setRemember] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username) {
      setRemember(true);
      setUsername(username);
    }
  }, []);

  const login = () => {
    const userCredentials = { username, password };

    if (remember) {
      localStorage.setItem('username', username);
    }

    dispatch(attemptLogin(userCredentials)).catch(R.identity);
  };

  // useKeyPress('Enter', login);

  const rememberMe = () => {
    localStorage.removeItem('username');
    setRemember(!remember);
  };

  return (
    <StyledLogin>
      <InputWrapper>
        <Input label="Username" handleOnBlur={setUsername} defaultValue={username} />
        <Input
          label="Password"
          handleOnBlur={setPassword}
          defaultValue={password}
          type="password"
        />
      </InputWrapper>
      <ForgotPassword>
        <Link to="/recovery">Forgot your password?</Link>
      </ForgotPassword>
      <ButtonWrapper>
        <Button onClick={login}>Log In</Button>
        <RememberMe>
          <label>
            <input
              name="rememberMe"
              type="checkbox"
              checked={remember}
              onChange={rememberMe}
            />
            Remember me
          </label>
        </RememberMe>
      </ButtonWrapper>

      <NoAccountYet>
        Don't have an account yet?
        <button onClick={() => setIsLogin(false)}>Sign Up</button>
      </NoAccountYet>
    </StyledLogin>
  );
}

const StyledLogin = styled.div``;

const InputWrapper = styled.div`
  & > *:first-child {
    margin-bottom: 1.5rem;
  }
`;

const ButtonWrapper = styled.div`
  margin-top: 1.8rem;
  button {
    width: 100%;
  }
`;

const ForgotPassword = styled.div`
  text-align: right;
  margin-top: 3px;

  a {
    color: ${({ theme }) => theme.colors.medium('onBackground')};
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

export default Login;
