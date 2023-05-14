"use strict";

const { Observable, of } = require("rxjs");
const { concatMap, delay } = require("rxjs/operators");
const WebSocket = require("ws");

const PORT = 5000;

const sensors = [
  { id: "0", name: "Temperature", connected: false, unit: "°C", value: "15" },
  {
    id: "1",
    name: "Pressure",
    connected: false,
    unit: "kPa",
    value: "101.325"
  },
  { id: "2", name: "Humidity", connected: false, unit: "%", value: "45" },
  { id: "3", name: "PM2.5", connected: false, unit: "PM2.5", value: "50" },
  { id: "4", name: "PM10", connected: false, unit: "PM10", value: "43" },
  { id: "5", name: "Wind", connected: false, unit: "m/s", value: "7" }
];

let connectedSensors = [];
let initialized = false;

const wss = new WebSocket.Server({ port: PORT });

const isSensorConnected = id => connectedSensors.includes(id);

const generateSensor = sensor => ({
  id: sensor.id,
  name: sensor.name,
  connected: isSensorConnected(sensor.id),
  unit: sensor.unit,
  value: isSensorConnected(sensor.id)
    ? (Math.random() + Number(sensor.value)).toFixed(3).toString()
    : null
});

wss.on("connection", ws => {
  ws.send(JSON.stringify({ sensorCategories: sensors }));

  ws.on("message", message => {
    let data;
    try {
      data = JSON.parse(message);
    } catch (e) {
      data = message;
    }
    console.log("Client -> Server: ", data);
    if (data && data.command === "disconnect" && data.id !== undefined) {
      connectedSensors = connectedSensors.filter(id => id !== data.id);
      const sensor = sensors.find(sensor => sensor.id === data.id);
      ws.send(JSON.stringify(generateSensor(sensor)));
    } else if (data && data.command === "connect" && data.id !== undefined) {
      if (!connectedSensors.includes(data.id)) {
        connectedSensors.push(data.id);
      }
    } else {
      console.log("Unhandled message");
    }
  });

  sensors.forEach(sensor => {
    ws.send(JSON.stringify(generateSensor(sensor)));
  });

  if (!initialized) {
    new Observable(observer => {
      const interval = setInterval(() => {
        sensors.forEach(sensor => {
          observer.next(generateSensor(sensor));
        });
      }, 100);
      return () => {
        clearInterval(interval);
      };
    })
      .pipe(
        concatMap(sensorData => {
          return of(sensorData).pipe(delay(5 + 5 * Math.random()));
        })
      )
      .subscribe(sensorData => {
        if (connectedSensors.includes(sensorData.id)) {
          wss.clients.forEach(client => {
            client.send(JSON.stringify(sensorData));
          });
        }
      });

    initialized = true;
  }
});

console.log("Server started on: ws://localhost:" + PORT);
