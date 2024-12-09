/*
 * index.js
 * Put your JavaScript in here
 */

"use strict";

var accelerometerOptions = { frequency: 1000 }; // update every 1000ms = 1 sec
var accelerometerWatcher = null;
var xLabel, yLabel, zLabel, tLabel;
var startButton, stopButton;
var startTime;

var xSmoothie, ySmoothie, zSmoothie;
var xCanvas, yCanvas, zCanvas;
var xLine, yLine, zLine;

document.addEventListener("deviceready", onDeviceReady, false);

// android has a back button, we want to stop when pressed
document.addEventListener("backbutton", stopWatchingAccelerometer, false);

function onDeviceReady() {
    xCanvas = document.getElementById('xCanvasId');
    yCanvas = document.getElementById('yCanvasId');
    zCanvas = document.getElementById('zCanvasId');

    xSmoothie = new SmoothieChart();
    ySmoothie = new SmoothieChart();
    zSmoothie = new SmoothieChart();

    xSmoothie.streamTo(xCanvas, 1000 /* delay for smooth graph */);
    ySmoothie.streamTo(yCanvas, 1000 /* delay for smooth graph */);
    zSmoothie.streamTo(zCanvas, 1000 /* delay for smooth graph */);

    // Initialize TimeSeries objects for each axis
    xLine = new TimeSeries();
    yLine = new TimeSeries();
    zLine = new TimeSeries();

    // Add TimeSeries to the SmoothieChart for X, Y, and Z
    xSmoothie.addTimeSeries(xLine, { strokeStyle: 'rgb(255,0,0)', lineWidth: 3 });
    ySmoothie.addTimeSeries(yLine, { strokeStyle: 'rgb(0,255,0)', lineWidth: 3 });
    zSmoothie.addTimeSeries(zLine, { strokeStyle: 'rgb(0,0,255)', lineWidth: 3 });

    xLabel = document.getElementById('xLabelId');
    yLabel = document.getElementById('yLabelId');
    zLabel = document.getElementById('zLabelId');
    tLabel = document.getElementById('tLabelId');
    startButton = document.getElementById('startButtonId');
    stopButton = document.getElementById('stopButtonId');

    startButton.addEventListener("click", startWatchingAccelerometer, false);
    stopButton.addEventListener("click", stopWatchingAccelerometer, false);

    startButton.disabled = false;
    stopButton.disabled = true;
}

function startWatchingAccelerometer() {
    // Start watching accelerometer data
    accelerometerWatcher = navigator.accelerometer.watchAcceleration(
        accelerometerSuccess,
        accelerometerFailure,
        accelerometerOptions
    );
    startTime = Date.now();
    startButton.disabled = true;
    stopButton.disabled = false;
}

function stopWatchingAccelerometer() {
    if (accelerometerWatcher) {
        navigator.accelerometer.clearWatch(accelerometerWatcher);
        accelerometerWatcher = null;
        startButton.disabled = false;
        stopButton.disabled = true;
    }
}

function accelerometerSuccess(acceleration) {
    // Update labels with accelerometer data
    xLabel.innerHTML = "x: " + (acceleration.x).toPrecision(5);
    yLabel.innerHTML = "y: " + (acceleration.y).toPrecision(5);
    zLabel.innerHTML = "z: " + (acceleration.z).toPrecision(5);
    tLabel.innerHTML = "t: " + Math.round(acceleration.timestamp - startTime);

    // Append accelerometer data to the respective TimeSeries
    xLine.append(new Date().getTime(), acceleration.x);
    yLine.append(new Date().getTime(), acceleration.y);
    zLine.append(new Date().getTime(), acceleration.z);
}

function accelerometerFailure() {
    alert("Error in Accelerometer!");
}
