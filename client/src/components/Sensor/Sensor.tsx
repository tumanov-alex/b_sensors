import { memo, useMemo } from 'react';
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
  unit: string;
  name: string;
}

function Sensor({
  sensors,
  showLast = 50,
  color,
  isHidden,
  unit,
  name,
}: SensorProps) {
  const chartContainerClassName = useMemo(
    () => `chart-container ${isHidden ? 'hidden' : ''}`,
    [isHidden]
  );

  const titleText = useMemo(() => {
    if (name === unit) {
      return name;
    } else {
      return `${name}, ${unit}`;
    }
  }, [unit, name]);

  const sensorValues = useMemo(
    () =>
      Object.values(sensors)
        .map(item => parseFloat(item.value))
        .slice(-showLast),
    [sensors, showLast]
  );

  const options = useMemo(
    () => ({
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
          data: sensorValues,
        },
      ],
    }),
    [sensorValues]
  );

  const hasNumbers = sensorValues.some(
    item => typeof item === 'number' && !isNaN(item)
  );

  return (
    <div className={chartContainerClassName}>
      <div className="chart">
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
        <NoData hasNumbers={hasNumbers} />
      </div>
    </div>
  );
}

export default memo(Sensor);
