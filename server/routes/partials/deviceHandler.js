/**
 * Created by danielabrao on 12/3/16.
 */
(function () {
    'use strict';

    function buildReturnError(status, message) {
        return {
            statusCode: status || 500,
            statusMessage: message || 'Unknown Error'
        };
    }

    module.exports = function (app, iotf_configs, iotf_connections, request) {
        console.log(iotf_configs.defaults())

        app.post('/createDevice', function (req, res) {

            if (!req.body.deviceId) {
                return res.status(401).send('Can not operate without a deviceId');
            }

            var iotf_params = iotf_configs.defaults();
            try {
                var postObject = {
                    url: ['https://70aie6.internetofthings.ibmcloud.com/api/v0002/device/types/',
                        iotf_params.type, '/devices'].join(''),
                    payload: {
                        "deviceId": req.body.deviceId,
                        "authToken": [req.body.deviceId || "RASPBERRY", 'HOW'].join(''),
                        "deviceInfo": {
                            "serialNumber": req.body.serialNo || "123",
                            "manufacturer": req.body.manufacturer || "Raspberry Pi Foundation",
                            "model": req.body.deviceModel || "BCM2708",
                            "deviceClass": "IoT device",
                            "description": "Raspberry gateway",
                            "descriptiveLocation": req.body.location || "Home"
                        },
                        "metadata": {}
                    }
                };

                new Promise(function (resolve, reject) {
                    request({
                        method: "POST",
                        url: postObject.url,
                        headers: {
                            "Authorization": ['Basic', iotf_configs.exportedCredentials()].join(' ')
                        },
                        json: postObject.payload || {}
                    }, function (err, response, body) {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            if (response.statusCode === 400) {
                                reject(buildReturnError(403, body.message));
                            }
                            if (response.statusCode === 403) {
                                reject(buildReturnError(403, body.message));
                            }
                            if (response.statusCode === 404) {
                                reject(buildReturnError(404, 'Route not found'));
                            }
                            if (response.statusCode === 409) {
                                reject(buildReturnError(409, 'Device already registered'));
                            } else {
                                resolve({
                                    response: response
                                });
                            }
                        }
                    });
                }).then(function successCallback(promise) {
                    return res.status(200).send('Device created');
                }, function errorCallback(error) {
                    try {
                        if (error.statusCode) {
                            return res.status(error.statusCode).send(error.statusMessage);
                        }
                    } catch (e) {
                        return res.status(500).send('An unknown error ocurred while creating request');
                    }
                });

            } catch (e) {
                console.log(e);
                return res.status(500).send('An unknown error ocurred');
            }

        });

        app.get('/listDevices', function (req, res) {

            new Promise(function (resolve, reject) {
                request.get({
                    url: 'https://bpvobx.internetofthings.ibmcloud.com/api/v0002/device/types/raspberry/devices',
                    headers: {
                        "Authorization": ['Basic', iotf_configs.exportedCredentials()].join(' ')
                    }
                }, function (err, response, body) {
                    if (err) {
                        reject(buildReturnError(500, err));
                    } else {

                        if (response.statusCode === 404) {
                            reject(buildReturnError(404, 'Device not found'));
                        } else {
                            try {
                                var payload = JSON.parse(body).results,
                                    resultArr = [],
                                    i;

                                for (i = 0; i < payload.length; i += 1) {
                                    resultArr.push({
                                        deviceId: payload[i].deviceId,
                                        deviceSerialNo: payload[i].deviceInfo.serialNumber,
                                        registeredAt: payload[i].registration.date
                                    });
                                }
                                resolve({
                                    response: resultArr
                                });
                            } catch (error) {
                                reject(buildReturnError(500), error);
                            }
                        }
                    }
                });
            }).then(function successCallback(data) {
                return res.status(200).send(data.response);
            }, function errorCallback(err) {
                return res.status(err.statusCode).send(err.statusMessage);
            });
        });


        app.get('/removeDevice/:deviceId', function (req, res) {
            var iotf_params = iotf_configs.defaults(),
                url = ['https://bpvobx.internetofthings.ibmcloud.com/api/v0002/device/types/',
                    iotf_params.type, '/devices/', req.params.deviceId].join('');

            new Promise(function (resolve, reject) {
                request({
                    method: 'DELETE',
                    url: url,
                    headers: {
                        "Authorization": ['Basic', iotf_configs.exportedCredentials()].join(' ')
                    }
                }, function (err, response, body) {
                    if (err) {
                        reject(err);
                    } else {
                        if (response.statusCode === 404) {
                            reject(buildReturnError(404, 'Device not found to be deleted'));
                        } else {
                            resolve({
                                response: response
                            });
                        }
                    }
                });
            }).then(function successCallback(promise) {
                return res.status(200).send('Device deleted successfully');
            }, function errorCallback(error) {
                try {
                    if (error.statusCode) {
                        return res.status(error.statusCode).send(error.statusMessage);
                    }
                } catch (e) {
                    return res.status(500).send('Unknown error deleting device');
                }
            });
        });
    };

}());