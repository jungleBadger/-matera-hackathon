(function () {
    "use strict";

    var secretKey = process.env.SECRET_KEY;
    var apiAccessKey = process.env.API_ACCESS_KEY;
    var url = "http://public-api-elb-1090807689.us-west-2.elb.amazonaws.com";
    var apiAccount = "/v1/accounts/";

    module.exports = function (crypto, request) {
        return {
            "generateHash": function (secret1, registration) {
                if (registration) {
                    return crypto.createHmac('sha256', secretKey).update(secret1 + registration).digest('hex');
                } else {
                    return crypto.createHmac('sha256', secretKey).update(secret1).digest('hex');
                }
            },
            "getAccountDetails": function (accountId) {
                var self = this;
                return new Promise(function (resolve, reject) {
                    request({
                        "url": url + apiAccount + accountId,
                        "method": "GET",
                        "headers": {
                            "Api-Access-Key": apiAccessKey,
                            "Transaction-Hash": self.generateHash(accountId)
                        }
                    }, function (error, response, body) {
                        if (!error) {
                            resolve(response);
                        } else {
                            reject(error);
                        }
                    });
                });
            },
            "getAccountBalance": function (accountId) {
                var self = this;
                return new Promise(function (resolve, reject) {
                    request({
                        "url": url + apiAccount + accountId + "/balance",
                        "method": "GET",
                        "headers": {
                            "Api-Access-Key": apiAccessKey,
                            "Transaction-Hash": self.generateHash(accountId)
                        }
                    }, function (error, response, body) {
                        if (!error) {
                            resolve(response);
                        } else {
                            reject(error);
                        }
                    });
                });
            },
            "getAccountStatement": function (accountId) {
                var self = this;
                return new Promise(function (resolve, reject) {
                    request({
                        "url": url + apiAccount + accountId + "/statement",
                        "method": "GET",
                        "headers": {
                            "Api-Access-Key": apiAccessKey,
                            "Transaction-Hash": self.generateHash(accountId)
                        }
                    }, function (error, response, body) {
                        if (!error) {
                            resolve(response);
                        } else {
                            reject(error);
                        }
                    });
                });
            }
        };
    }
} ());
