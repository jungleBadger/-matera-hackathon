/**
 * Created by danielabrao on 9/21/16.
 */
(function() {
    'use strict';

    module.exports = function (mqtt) {
        return {
            createConnection: function () {
                return new Promise(function (resolve, reject) {
                    var appClientConfig = {
                        "org": "bpvobx",
                        "id": "hpcxylqxb8",
                        "auth-key": process.env.IOTF_KEY || JSON.parse(process.env.VCAP_SERVICES)["iotf-service"][0].credentials.apiKey,
                        "auth-token": process.env.IOTF_TOKEN || JSON.parse(process.env.VCAP_SERVICES)["iotf-service"][0].credentials.apiToken
                    };
                    console.log(appClientConfig);
                    var mqttApp = new mqtt.IotfApplication(appClientConfig);
                    mqttApp.connect();

                    mqttApp.on('connect', function () {
                        mqttApp.subscribeToDeviceEvents();
                        mqttApp.on("deviceEvent", function (deviceType, deviceId, eventType, format, payload) {
                            console.log("Device Event from :: "+deviceType+" : "+deviceId+" of event "+eventType+" with payload : "+payload);
                        });

                        console.log("connected");

                        resolve(mqttApp);
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

                    if (mqttInstance.connected) {
                        resolve(true);
                    } else {
                        reject(false);
                    }
                });
            },
            closeConnection: function (mqttInstance) {
                return new Promise(function (resolve, reject) {
                    mqttInstance.end(false, function cb() {
                        resolve('Client disconnected');
                    });
                });
            }
        }

    };

}());
