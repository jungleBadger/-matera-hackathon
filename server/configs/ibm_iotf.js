/**
 * Created by danielabrao on 12/3/16.
 */
(function () {
    "use strict";

    module.exports = function () {
        return {
            defaults: function buildObject () {
                return {
                    "org": process.env.IOTF_ORG || JSON.parse(process.env.VCAP_SERVICES)["iotf-service"][0].credentials.org,
                    "id": "a-e8wjfx-hpcxylqxb8",
                    "type": "raspberry",
                    "auth-method": "token",
                    "auth-key": process.env.IOTF_KEY || JSON.parse(process.env.VCAP_SERVICES)["iotf-service"][0].credentials.apiKey,
                    "auth-token": process.env.IOTF_TOKEN || JSON.parse(process.env.VCAP_SERVICES)["iotf-service"][0].credentials.apiToken
                };
            },
            credentials: {
                apiKey: process.env.IOTF_KEY ||  JSON.parse(process.env.VCAP_SERVICES)["iotf-service"][0].credentials.apiKey,
                apiToken: process.env.IOTF_TOKEN || JSON.parse(process.env.VCAP_SERVICES)["iotf-service"][0].credentials.apiToken
            },
            exportedCredentials: (function buildCredential() {
                return function () {
                    return new Buffer([this.credentials.apiKey, ":", this.credentials.apiToken].join("")).toString("base64");
                };
            }())
        }
    };
}());