/**
 * Created by danielabrao on 9/21/16.
 */
(function() {
    'use strict';

    module.exports = function (mqtt, io) {

        io.on('connection', function (socket) {
            console.log('socket connected');
            socket.once('disconnect', function () {
                console.log([io.engine.clientsCount, 'Clients connected after this exit'].join(' '));
            });
        });

        return {
            createConnection: function () {
                return new Promise(function (resolve, reject) {
                    var appClientConfig = {
                        "org": "70aie6",
                        "id": "a2g6k39sl6r5",
                        "auth-method" : "token",
                        "auth-key": process.env.IOTF_KEY || JSON.parse(process.env.VCAP_SERVICES)["iotf-service"][0].credentials.apiKey,
                        "auth-token": process.env.IOTF_TOKEN || JSON.parse(process.env.VCAP_SERVICES)["iotf-service"][0].credentials.apiToken
                    };

                    var mqttApp = new mqtt.IotfApplication(appClientConfig);
                    mqttApp.log.setLevel('trace');
                    mqttApp.connect();

                    mqttApp.on('connect', function () {
                        mqttApp.subscribeToDeviceEvents();

                        console.log("connected");

                        resolve(mqttApp);
                    });

                    mqttApp.on("deviceEvent", function (deviceType, deviceId, eventType, format, payload) {
                        io.emit("payloadReceived", JSON.parse(payload));
                        console.log("Device Event from :: "+deviceType+" : "+deviceId+" of event "+eventType+" with payload : "+payload);
                    });

                    mqttApp.on('error', function (error) {
                        reject(error);
                    });
                });
            },
            checkConnection: function (mqttInstance) {
                return new Promise(function (resolve, reject) {
                    if (!mqttInstance) {
                        reject('Create new MQTT');
                        return;
                    }

                    if (mqttInstance.isConnected) {
                        resolve(true);
                    } else {
                        reject(false);
                    }
                });
            },
            closeConnection: function (mqttInstance) {
                return new Promise(function (resolve, reject) {
                    mqttInstance.disconnect();
                    mqttInstance = "";
                    resolve("");
                });
            }
        }

    };

}());
