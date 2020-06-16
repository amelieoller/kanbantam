import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Swipe from 'react-easy-swipe';
import clsx from 'clsx';

const StyledCheeseburger = styled.div`
  visibility: ${(props) => (props.isOpen ? 'visible' : 'hidden')};
`;

const overlayStyle = () => ({
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 1001,
  background: 'rgba(0, 0, 0, 0.3)',
  opacity: 0,
  transition: `opacity 0.4s, transform 0s 0.4s`,
  transform: `translate3d(-100%, 0px, 0px)`,
});

const overlayActiveStyle = (options) => ({
  ...overlayStyle(options),
  opacity: 1,
  transition: `opacity 0.4s`,
  transform: 'none',
});

const menuOuterStyle = (options) => ({
  position: 'fixed',
  left: 'inherit',
  right: 0,
  top: 0,
  bottom: 0,
  zIndex: 1002,
  width: options.width,
  maxWidth: '80%',
  transition: `transform 0.4s`,
  transform: `translate3d(100%, 0px, 0px)`,
  transformOrigin: 'left',
  backgroundColor: 'white',
});

const menuOuterActiveStyle = (options) => ({
  ...menuOuterStyle(options),
  transform: `translate3d(0px, 0px, 0px)`,
});

const menuShadowStyle = () => ({
  position: 'absolute',
  zIndex: -1,
  width: '100%',
  height: '100%',
  transition: `opacity 0.4s`,
  boxShadow: '0 0 15px 0 rgba(0, 0, 0, .2)',
  opacity: 0,
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
});

const menuShadowActiveStyle = (options) => ({
  ...menuShadowStyle(options),
  opacity: 1,
});

const menuInnerStyle = () => ({
  height: '100%',
  paddingBottom: 0,
  overflowY: 'auto',
});

const IDLE = 'idle';
const VERTICAL = 'vertical';
const HORIZONTAL = 'horizontal';

const SlideOutMenu = ({
  isOpen,
  closeCallback,
  className,
  outerClassName,
  innerClassName,
  shadowClassName,
  children,
  right,
}) => {
  const [state, setState] = useState({
    swiping: false,
    direction: IDLE,
    swipePosition: { x: 0, y: 0 },
    menuExtraStyle: {},
  });

  const onSwipeStart = () => {
    if (isOpen) {
      setState({
        ...state,
        swiping: true,
      });
    }
  };

  const getOptions = () => ({
    width: 350,
  });

  const onSwipeMove = (position, e) => {
    if (state.swiping) {
      const options = getOptions();
      let { direction } = state;

      if (direction === IDLE) {
        const swipeThreshold = options.width / 15;
        const pastThreshold =
          Math.abs(position.x) > swipeThreshold || Math.abs(position.y) > swipeThreshold;

        if (pastThreshold) {
          if (
            ((!right && position.x < 0) || (right && position.x > 0)) &&
            Math.abs(position.x) > Math.abs(position.y)
          ) {
            direction = HORIZONTAL;
          } else {
            direction = VERTICAL;
          }
        }
      }

      if (direction === HORIZONTAL) {
        const swipeClosing = (!right && position.x < 0) || (right && position.x > 0);

        const translateX = swipeClosing ? position.x : 0;

        setState({
          ...state,
          direction,
          swipePosition: position,
          menuExtraStyle: {
            transform: `translate3d(${translateX}px, 0px, 0px)`,
            transition: 'transform 0s',
          },
        });

        e.preventDefault();
      }

      if (direction === VERTICAL) {
        setState({
          ...state,
          direction,
          swipePosition: { x: 0, y: 0 },
          menuExtraStyle: {},
        });
      }
    }
  };

  const onSwipeEnd = () => {
    const swipeCloseThreshold = getOptions().width / 3;
    if (
      (!right && state.swipePosition.x < -swipeCloseThreshold) ||
      (right && state.swipePosition.x > swipeCloseThreshold)
    ) {
      closeCallback();
    }
    setState({
      ...state,
      swiping: false,
      direction: IDLE,
      swipePosition: { x: 0, y: 0 },
      menuExtraStyle: {},
    });
  };

  const options = getOptions();

  const baseMenuOuterStyle = isOpen ? menuOuterActiveStyle(options) : menuOuterStyle(options);
  const currentMenuOuterStyle = {
    ...baseMenuOuterStyle,
    ...state.menuExtraStyle,
  };

  return (
    <StyledCheeseburger
      className={clsx('cheeseburger-menu', className, { open: isOpen })}
      isOpen={isOpen}
    >
      <div
        className="cheeseburger-menu-overlay"
        style={isOpen ? overlayActiveStyle(options) : overlayStyle(options)}
        onClick={closeCallback}
        onKeyDown={closeCallback}
        role="button"
        tabIndex={0}
      />
      <Swipe onSwipeStart={onSwipeStart} onSwipeMove={onSwipeMove} onSwipeEnd={onSwipeEnd}>
        <div
          className={clsx('cheeseburger-menu-outer', outerClassName)}
          style={currentMenuOuterStyle}
        >
          <div
            className={clsx('cheeseburger-menu-inner', innerClassName)}
            style={menuInnerStyle(options)}
          >
            {children}
          </div>
          <div
            className={clsx('cheeseburger-menu-shadow', shadowClassName)}
            style={isOpen ? menuShadowActiveStyle(options) : menuShadowStyle(options)}
          />
        </div>
      </Swipe>
    </StyledCheeseburger>
  );
};

SlideOutMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeCallback: PropTypes.func.isRequired,
  right: PropTypes.bool,
  className: PropTypes.string,
  outerClassName: PropTypes.string,
  innerClassName: PropTypes.string,
  shadowClassName: PropTypes.string,
  children: PropTypes.node,
};

export default SlideOutMenu;
