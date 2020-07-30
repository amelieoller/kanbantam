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

import { formatYearMonthDay } from '_utils/dates';
import MinusIcon from '_assets/icons/minus-circle.svg';
import PlusIcon from '_assets/icons/plus-circle.svg';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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

    const getIntroOfPage = (label) => {
      if (label === todayShort) {
        if (payload[1].value >= payload[0].value) {
          return 'Nice Job!';
        } else {
          return 'You can do this!';
        }
      }
    };

    return (
      <Label>
        <p>
          {label} - {payload[0].value}
        </p>
        <p>{getIntroOfPage(label)}</p>
      </Label>
    );
  }

  return null;
};

const TaskGraph = ({ elapsedPomodori, totalPomodori }) => {
  const [goal, setGoal] = useState(totalPomodori);

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

  const renderCustomizedLabel = ({ index, value }) => (index === 4 ? value : null);

  const todaysPomodori = calculateSeries(0);

  let areaColor = '#e6e6e6';

  if (todaysPomodori <= goal / 2) {
    areaColor = '#ffb4ab99';
  } else if (todaysPomodori >= goal) {
    areaColor = '#92d4b787';
  }

  return (
    <GraphWrapper>
      <StyledGraph>
        <ResponsiveContainer>
          <ComposedChart
            data={data}
            animationDuration={0.2}
            margin={{
              top: 10,
              right: 25,
              left: -35,
              bottom: 0,
            }}
          >
            <Area type="monotone" dataKey="base" stroke={areaColor} fill={areaColor} />
            <XAxis dataKey="name" scale="point" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="daily" stroke="#828282" dot={{ stroke: '#6200EE' }}>
              <LabelList content={renderCustomizedLabel} position="right" />
            </Line>
          </ComposedChart>
        </ResponsiveContainer>

        <GoalButton
          className="minus"
          onClick={() => goal > 0 && setGoal((prevGoal) => prevGoal - 1)}
        >
          <MinusIcon />
        </GoalButton>
        <GoalButton
          className="plus"
          onClick={() => goal < 50 && setGoal((prevGoal) => prevGoal + 1)}
        >
          <PlusIcon />
        </GoalButton>
      </StyledGraph>
    </GraphWrapper>
  );
};

const GraphWrapper = styled.div`
  height: 200px;
  padding-top: 30px;
`;

const StyledGraph = styled.div`
  width: 100%;
  height: 150px;
  position: relative;

  svg {
    height: inherit;
  }
`;

const GoalButton = styled.button`
  position: absolute;
  background: transparent;
  border: none;
  color: #6200ee;
  padding: 0;

  svg {
    height: 16px;
  }

  &.minus {
    top: 7px;
    right: 0;
  }

  &.plus {
    bottom: 27px;
    right: 0;
  }
`;

const Label = styled.div`
  background: #fcfcfc;
  padding: 5px;
  border-radius: 3px;
`;

TaskGraph.propTypes = {
  elapsedPomodori: PropTypes.shape({}),
};

export default TaskGraph;
