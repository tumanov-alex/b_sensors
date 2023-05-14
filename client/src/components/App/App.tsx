import { useEffect, useRef, useState, useCallback, useMemo } from 'react';

import SensorToggle from '../SensorToggle/SensorToggle.tsx';
import Sensor from '../Sensor/Sensor.tsx';
import { getColor } from '../../utils/getColor.ts';

import './App.css';
import { getSorted } from '../../utils/getSortedSensors.ts';

export interface SensorData {
    id: string;
    name: string;
    connected: boolean;
    unit: string;
    value: string;
}
export type SensorState = { [key: string]: SensorData[] };
type SensorCategories = { sensorCategories: SensorData[]; };
type ColorMapping = { [key: string]: string };

const colorMapping: ColorMapping = {};

export default function App() {
    const [sensorDataState, setSensorDataState] = useState<SensorState>({});
    const [sensorCategoriesList, setSensorCategoriesList] = useState<SensorData[]>([]);
    const webSocket = useRef<WebSocket | null>(null);
    const [activeSensorIds, setActiveSensorIds] = useState<string[]>([]);
    const [hideDisconnectedSensors, setHideDisconnectedSensors] = useState(false);

    const changeSensorConnection = useCallback((command: 'connect' | 'disconnect', id: string) => {
        webSocket.current?.send(JSON.stringify({
            command,
            id,
        }));
    }, []);

    const renderSensorCharts = useCallback(([sensorId, sensors]: [string, SensorData[]]) => {
        const isHidden = hideDisconnectedSensors && !activeSensorIds.includes(sensorId);

        return (
            <Sensor key={sensorId} sensors={sensors} color={colorMapping[sensorId]}
                    isHidden={isHidden}/>
        );
    }, [hideDisconnectedSensors, activeSensorIds]);

    const assignColorsToCategories = useCallback((sensorCategories: SensorData[]) => {
        sensorCategories.forEach((sensorCategory) => {
            colorMapping[sensorCategory.id] = getColor(sensorCategory.id);
        });
    }, []);

    useEffect(() => {
        webSocket.current = new WebSocket('ws://localhost:3000');

        webSocket.current.onopen = () => {
            console.log('Connected to server');
        };
        webSocket.current.onerror = (error) => {
            console.log(`WebSocket error: ${JSON.stringify(error, ['message', 'arguments', 'type', 'name'])}`);
        };
        webSocket.current.onmessage = (e) => {
            const sensorCategoriesOrData: SensorCategories | SensorData = JSON.parse(e.data);

            if ('sensorCategories' in sensorCategoriesOrData) {
                setSensorCategoriesList(sensorCategoriesOrData.sensorCategories);

                assignColorsToCategories(sensorCategoriesOrData.sensorCategories);
            } else {
                setSensorDataState((prevState) => ({
                    ...prevState,
                    [sensorCategoriesOrData.id]: [
                        ...(prevState[sensorCategoriesOrData.id] || []),
                        sensorCategoriesOrData,
                    ],
                }));
            }
        };

        return () => {
            webSocket.current?.close();
        };
    }, []);

    const sortedSensorDataState = useMemo(() => getSorted(sensorDataState), [sensorDataState]);

    return (
        <>
            <SensorToggle
                sensorCategoriesList={sensorCategoriesList}
                onActiveSensorChange={setActiveSensorIds}
                onConnectionChange={changeSensorConnection}
                onToggleHide={setHideDisconnectedSensors}
            />

            <div className="sensor-container">
                {sortedSensorDataState.map(renderSensorCharts)}
            </div>
        </>
    );
}