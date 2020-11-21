import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

export const ProgressBarWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;

  & > *:not(:last-child) {
    margin-right: 3px;
  }
`;

export const ProgressWrapper = styled.div`
  position: relative;
  height: 8px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.lighter(1, 'surfaceVariant')};
  width: 100%;
`;

export const ProgressFiller = styled.div`
  background: ${({ theme, percentage }) =>
    percentage < 40
      ? theme.colors.lighter(75, 'onSurface')
      : theme.colors.lighter(parseInt(1000 / percentage), 'success')};
  height: 100%;
  border-radius: inherit;
  transition: width 0.2s ease-in;
  display: flex;
  align-items: center;
  width: ${({ percentage }) => percentage}%;
`;

export const TextLeft = styled.span`
  color: ${({ theme, percentage }) =>
    percentage < 40 ? theme.colors.lighter(2, 'onSurface') : theme.colors.onSurfaceVariant};
  font-size: 0.75rem;
  font-style: italic;
  white-space: nowrap;
  padding-left: 4px;
`;
