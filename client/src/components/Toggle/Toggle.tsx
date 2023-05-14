import React, { useState } from 'react';
import './Toggle.scss';

interface ToggleProps {
    onClick: () => void;
}
const Toggle: React.FC<ToggleProps> = ({ onClick }) => {
    const [active, setActive] = useState<'see all' | 'see active'>('see all');

    const onSeeAllClick = () => {
        setActive('see all');
        onClick();
    };
    const onSeeActiveClick = () => {
        setActive('see active');
        onClick();
    };

    return (
        <div className="toggle">
            <button
                className={active === 'see all' ? 'active' : ''}
                onClick={onSeeAllClick}
            >
                See
                <br/>
                All
            </button>
            <button
                className={active === 'see active' ? 'active' : ''}
                onClick={onSeeActiveClick}
            >
                See
                <br/>
                Active
            </button>
        </div>
    );
};

export default Toggle;
