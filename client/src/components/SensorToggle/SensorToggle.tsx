import React, { useState, useCallback, useEffect, memo } from 'react';

import { SensorData } from '../App/App.tsx';
import Toggle from '../Toggle/Toggle.tsx';
import './SensorToggle.scss';

interface SensorToggleProps {
    sensorCategoriesList: SensorData[];
    onActiveSensorChange: (activeSensors: string[]) => void;
    onConnectionChange: (action: 'connect' | 'disconnect', id: string) => void;
    onToggleHide: React.Dispatch<React.SetStateAction<boolean>>;
}

function SensorToggle({
                          sensorCategoriesList,
                          onActiveSensorChange,
                          onConnectionChange,
                          onToggleHide,
                      }: SensorToggleProps) {
    const [activeSensors, setActiveSensors] = useState<string[]>([]);

    const handleToggleClick = useCallback((id: string) => {
        const isActive = activeSensors.includes(id);
        onConnectionChange(isActive ? 'disconnect' : 'connect', id);

        setActiveSensors(prevSensors =>
            isActive
                ? prevSensors.filter(sensorId => sensorId !== id)
                : [...prevSensors, id]
        );
    }, [activeSensors, onConnectionChange]);

    useEffect(() => {
        onActiveSensorChange(activeSensors);
    }, [activeSensors, onActiveSensorChange]);

    return (
        <div className="toggle-container">
            <div className="sensor-toggle-container">
                {
                    sensorCategoriesList.map((sensorType) => (
                        <div
                            key={sensorType.name}
                            className={`toggle-box ${activeSensors.includes(sensorType.id) ? 'active' : ''}`}
                            onClick={() => handleToggleClick(sensorType.id)}
                        >
                            {sensorType.name}

                            <img className="icon"
                                 src={`../${sensorType.name.toLowerCase()}.svg`}
                                 alt={sensorType.name}/>
                        </div>
                    ))
                }
            </div>

            <Toggle
                onClick={() => onToggleHide((prevState: boolean) => !prevState)}/>
        </div>
    );
}

export default memo(SensorToggle);
