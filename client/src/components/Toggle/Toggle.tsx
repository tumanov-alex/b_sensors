import React, { useState, memo, useCallback } from 'react';
import './Toggle.scss';

interface ToggleProps {
  onClick: () => void;
}
const Toggle: React.FC<ToggleProps> = ({ onClick }) => {
  const [active, setActive] = useState<'see all' | 'see active'>('see all');

  const onSeeAllClick = useCallback(() => {
    setActive('see all');
    onClick();
  }, []);
  const onSeeActiveClick = useCallback(() => {
    setActive('see active');
    onClick();
  }, []);

  return (
    <div className="toggle">
      <button
        className={active === 'see all' ? 'active' : ''}
        onClick={onSeeAllClick}
      >
        See
        <br />
        All
      </button>

      <button
        className={active === 'see active' ? 'active' : ''}
        onClick={onSeeActiveClick}
      >
        See
        <br />
        Active
      </button>
    </div>
  );
};

export default memo(Toggle);
