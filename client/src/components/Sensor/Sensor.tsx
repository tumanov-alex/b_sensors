import { memo, useEffect, useMemo, useRef, useState } from 'react';
import HighchartsReact from 'highcharts-react-official';
import * as Highcharts from 'highcharts';

import { NoData } from '../NoData/NoData.tsx';
import type { SensorData } from '../App/App.tsx';
import './Sensor.scss';

interface SensorProps {
    sensors: SensorData[];
    showLast?: number;
    color: string;
    isHidden: boolean;
}

function Sensor({ sensors, showLast = 50, color, isHidden }: SensorProps) {
    const [sensorData, setSensorData] = useState<number[]>([]);
    const lastSensorData = useRef<SensorData | null>(null);
    const chartRef = useRef<any>(null);
    const maxYAxisValue = useRef(0);
    const minYAxisValue = useRef(Infinity);
    const [sensorTitles, setSensorTitles] = useState({
        name: 'Sensor',
        unit: 'Unit',
    });
    const maxValueDelta = useRef(0);
    const yAxis = useRef<any>(null);
    const chartContainerClassName = useMemo(() => `chart-container ${isHidden ? 'hidden' : ''}`, [isHidden]);

    const titleText = useMemo(() => {
        if (sensorTitles.name === sensorTitles.unit) {
            return sensorTitles.name;
        } else {
            return `${sensorTitles.name}, ${sensorTitles.unit}`;
        }
    }, [sensorTitles]);

    useEffect(() => {
        lastSensorData.current = sensors[sensors.length - 1];

        if (sensorTitles.name === 'Sensor') {
            setSensorTitles({
                name: lastSensorData.current.name,
                unit: lastSensorData.current.unit,
            });
        }

        const lastSensorValue = parseFloat(lastSensorData.current.value);

        if (sensorData.length > 0) {
            maxValueDelta.current = Math.max(maxValueDelta.current, Math.abs(lastSensorValue - sensorData[sensorData.length - 1]));
        }

        yAxis.current = yAxis.current || chartRef.current.chart.yAxis[0];
        const ceilLastSensorValue = Math.ceil(lastSensorValue);
        const floorLastSensorValue = Math.floor(lastSensorValue);

        if (ceilLastSensorValue > maxYAxisValue.current) {
            maxYAxisValue.current = ceilLastSensorValue;
            yAxis.current.update({ max: ceilLastSensorValue });
        }

        if (floorLastSensorValue < minYAxisValue.current) {
            minYAxisValue.current = floorLastSensorValue;
            yAxis.current.update({ min: floorLastSensorValue });
        }

        setSensorData((prevState) => {
            const newSensorData = [...prevState, lastSensorValue];
            return newSensorData.length > showLast ? newSensorData.slice(-showLast) : newSensorData;
        });
    }, [sensors, maxYAxisValue, minYAxisValue]);

    const options = {
        title: {
            text: titleText,
            style: {
                color: '#555',
            },
        },
        chart: {
            type: 'area',
        },
        xAxis: {
            labels: {
                enabled: false,
            },
            tickLength: 0,
            lineWidth: 0,
        },
        yAxis: {
            title: {
                text: null,
            },
            type: 'logarithmic',
        },
        plotOptions: {
            area: {
                color: color,
            },
            series: {
                showInLegend: false,
                enableMouseTracking: false,
                marker: {
                    enabled: false,
                },
            },
            line: {
                marker: {
                    enabled: false,
                },
            },
        },
        series: [
            {
                data: sensorData,
            },
        ],
    };

    const hasNumbers = sensorData.some(item => typeof item === 'number' && !isNaN(item));

    return (
        <div className={chartContainerClassName}>
            <div className="chart">
                <HighchartsReact highcharts={Highcharts} options={options}
                                 ref={chartRef}/>
                <NoData hasNumbers={hasNumbers}/>
            </div>
        </div>
    );
}

export default memo(Sensor);
