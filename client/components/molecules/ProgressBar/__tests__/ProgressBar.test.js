import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';

import ProgressBar from '../ProgressBar';
import { ThemeProvider } from 'styled-components';
import { light } from '_styles/Theme';

let handleUpdate;
let progressBarProps;

beforeEach(() => {
  handleUpdate = jest.fn(() => {});
  progressBarProps = {
    type: 'min',
    handleUpdate: handleUpdate,
    incrementBy: 10,
  };
});

afterEach(cleanup);

test('<ProgressBar /> increments and decrements the total time correctly', () => {
  const { getByTestId, rerender } = render(
    <ThemeProvider theme={light}>
      <ProgressBar {...progressBarProps} total={20} />
    </ThemeProvider>,
  );

  const progressText = getByTestId('progress-text');

  expect(progressText.textContent).toBe('20 min left / 20');

  rerender(
    <ThemeProvider theme={light}>
      <ProgressBar {...progressBarProps} total={30} />
    </ThemeProvider>,
  );

  expect(progressText.textContent).toBe('30 min left / 30');
});

test('<ProgressBar /> calculates correct number when elapsed time is passed', () => {
  const { getByTestId } = render(
    <ThemeProvider theme={light}>
      <ProgressBar {...progressBarProps} total={20} elapsed={10} />
    </ThemeProvider>,
  );

  const progressText = getByTestId('progress-text');

  expect(progressText.textContent).toBe('10 min left / 20');
});

test('<ProgressBar /> make sure passed in function gets called when buttons are clicked', () => {
  const { getByTestId } = render(
    <ThemeProvider theme={light}>
      <ProgressBar {...progressBarProps} total={20} />
    </ThemeProvider>,
  );

  const incrementButton = getByTestId('increment-button');
  const decrementButton = getByTestId('decrement-button');

  fireEvent.click(incrementButton);
  expect(handleUpdate).toBeCalledTimes(1);

  fireEvent.click(decrementButton);
  expect(handleUpdate).toBeCalledTimes(2);
});
