import { SensorData, SensorState } from '../components/App/App.tsx';

export const getSorted = (sensors: SensorState) =>
    Object.entries(sensors).sort((a, b) => {
        const sensorDataA = a[1] as SensorData[];
        const sensorDataB = b[1] as SensorData[];

        const sensorConnectedA = sensorDataA[sensorDataA.length - 1].connected;
        const sensorConnectedB = sensorDataB[sensorDataB.length - 1].connected;

        if (sensorConnectedA === sensorConnectedB) return 0;
        if (sensorConnectedA) return -1;
        if (sensorConnectedB) return 1;

        return 0;
    });
