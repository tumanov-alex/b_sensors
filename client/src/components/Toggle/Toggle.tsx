import React, { useState, memo, useCallback } from 'react';
import './Toggle.scss';

interface ToggleProps {
  onClick: () => void;
}
const Toggle: React.FC<ToggleProps> = ({ onClick }) => {
  const [isLeftActive, setIsLeftActive] = useState(true);

  const onToggle = useCallback(() => {
    setIsLeftActive(prevState => !prevState);
    onClick();
  }, []);

  return (
    <div className="toggle">
      <button className={isLeftActive ? 'active' : ''} onClick={onToggle}>
        See
        <br />
        All
      </button>

      <button className={isLeftActive ? '' : 'active'} onClick={onToggle}>
        See
        <br />
        Active
      </button>
    </div>
  );
};

export default memo(Toggle);
