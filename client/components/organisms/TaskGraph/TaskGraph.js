import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import { useDispatch } from 'react-redux';
import * as R from 'ramda';

import { formatYearMonthDay } from '_utils/dates';
import MinusIcon from '_assets/icons/minus-circle.svg';
import PlusIcon from '_assets/icons/plus-circle.svg';
import { attemptUpdateBoard } from '_actions/boards';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const fullDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const getPreviousDate = (daysToSubtract) => {
  const date = new Date();
  date.setDate(date.getDate() - daysToSubtract);

  return date;
};

const calculateLabel = (num) => {
  const previousDate = getPreviousDate(num);
  const weekdayShort = days[previousDate.getDay()];

  return weekdayShort;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active) {
    const date = new Date();
    const todayShort = days[date.getDay()];

    const getIntroOfPage = () => {
      const pomodoriFinished = payload[1].value;
      const totalPomodori = payload[0].value;

      if (pomodoriFinished >= totalPomodori) {
        return "Nice Job, You're Done!";
      } else if (pomodoriFinished >= totalPomodori / 2) {
        return `Almost, Only ${totalPomodori - pomodoriFinished} More to Go!`;
      } else {
        return `You Can Do This, ${totalPomodori - pomodoriFinished} More!`;
      }
    };

    return (
      <Label>
        <p>
          {fullDays[days.indexOf(label)]} - <span className="completed">{payload[1].value}</span>
        </p>
        {label === todayShort && <p className="message">{getIntroOfPage()}</p>}
      </Label>
    );
  }

  return null;
};

const TaskGraph = ({ boardId, elapsedPomodori, totalPomodori, isSidebarOpen }) => {
  const [goal, setGoal] = useState(totalPomodori);

  const dispatch = useDispatch();

  const calculateSeries = (num) => {
    const previousDate = getPreviousDate(num);
    const date = formatYearMonthDay(previousDate);

    return elapsedPomodori[date] ? elapsedPomodori[date] : 0;
  };

  const data = [
    {
      name: calculateLabel(4),
      base: goal,
      daily: calculateSeries(4),
    },
    {
      name: calculateLabel(3),
      base: goal,
      daily: calculateSeries(3),
    },
    {
      name: calculateLabel(2),
      base: goal,
      daily: calculateSeries(4),
    },
    {
      name: calculateLabel(1),
      base: goal,
      daily: calculateSeries(1),
    },
    {
      name: calculateLabel(0),
      base: goal,
      daily: calculateSeries(0),
    },
  ];

  const todaysPomodori = calculateSeries(0);

  let areaColor = '#ffb4ab99';

  if (todaysPomodori >= goal) {
    areaColor = '#92d4b787';
  } else if (todaysPomodori >= goal / 2) {
    areaColor = '#e6e6e6';
  }

  const renderCustomizedLabel = (props) => {
    const { x, y, value, index } = props;

    return index === 4 ? (
      <LabelToRight x={x + 4} y={y + 4} fill="#898989">
        {value}
      </LabelToRight>
    ) : null;
  };

  const updateChangeGoal = (changeByNum) => {
    const newGoal = goal + changeByNum;
    setGoal(newGoal);
    dispatch(attemptUpdateBoard({ id: boardId, totalPomodori: newGoal }));
  };

  return (
    <GraphWrapper>
      <StyledGraph isSidebarOpen={isSidebarOpen}>
        {isSidebarOpen && (
          <ResponsiveContainer>
            <ComposedChart
              data={data}
              animationDuration={0.2}
              margin={{
                top: 10,
                right: 33,
                left: -35,
                bottom: 0,
              }}
            >
              <Area
                type="monotone"
                dataKey="base"
                stroke={areaColor}
                fill={areaColor}
                isAnimationActive={false}
              >
                <LabelList dataKey="base" content={renderCustomizedLabel} position="right" />
              </Area>
              <XAxis dataKey="name" scale="point" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="daily"
                stroke="#828282"
                dot={{ stroke: '#6200EE' }}
                isAnimationActive={false}
              >
                <LabelList content={renderCustomizedLabel} position="right" />
              </Line>
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {!isSidebarOpen && (
          <SlimView>
            {todaysPomodori} out of {totalPomodori} done
          </SlimView>
        )}

        <GoalButtons isSidebarOpen={isSidebarOpen}>
          <GoalButton
            isSidebarOpen={isSidebarOpen}
            className="plus"
            onClick={() => goal < 50 && updateChangeGoal(1)}
          >
            <PlusIcon />
          </GoalButton>

          <GoalButton
            isSidebarOpen={isSidebarOpen}
            className="minus"
            onClick={() => goal > 0 && updateChangeGoal(-1)}
          >
            <MinusIcon />
          </GoalButton>
        </GoalButtons>
      </StyledGraph>
    </GraphWrapper>
  );
};

const SlimView = styled.div`
  font-family: 'Pacifico', cursive;
  font-size: 16px;
  text-align: center;
  color: #7c7c7c;
`;

const GoalButtons = styled.div`
  text-align: center;
  margin-top: ${({ isSidebarOpen }) => !isSidebarOpen && '15px'};
`;

const GraphWrapper = styled.div``;

const LabelToRight = styled.text`
  background: blue;
`;

const StyledGraph = styled.div`
  width: 100%;
  height: ${({ isSidebarOpen }) => (isSidebarOpen ? '160px' : '140px')};
  position: relative;

  svg {
    height: inherit;
  }
`;

const GoalButton = styled.button`
  position: ${({ isSidebarOpen }) => (isSidebarOpen ? 'absolute' : 'inherit')};
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  padding: 0;
  cursor: pointer;
  padding-top: ${({ isSidebarOpen }) => !isSidebarOpen && '5px'};

  svg {
    height: ${({ isSidebarOpen }) => (isSidebarOpen ? '16px' : '25px')};
  }

  &.minus {
    bottom: 27px;
    right: 0;
  }

  &.plus {
    top: 7px;
    right: 0;
  }

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.lighter(3, 'primary')};
    outline: none;
  }
`;

const Label = styled.div`
  background: #fff;
  padding: 5px;
  border-radius: 3px;
  text-align: center;
  color: #656565;

  .completed {
    font-weight: bold;
  }

  .message {
    font-family: 'Pacifico', cursive;
    font-size: 12px;
    margin-top: 5px;
    color: #121212;
  }
`;

TaskGraph.propTypes = {
  elapsedPomodori: PropTypes.shape({}),
};

export default React.memo(TaskGraph);
