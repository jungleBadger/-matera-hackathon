(function () {
    "use strict";

    var secretKey = process.env.SECRET_KEY;
    var apiAccessKey = process.env.API_ACCESS_KEY;
    var url = "http://public-api-elb-1090807689.us-west-2.elb.amazonaws.com";
    var apiAccount = "/v1/accounts/";
    var apiPayment = "/v2/payments/";

    module.exports = function (crypto, request) {
        return {
            "generateHash": function (params) {
                var hmac = crypto.createHmac('sha256', secretKey);
                var hash = "";

                params.forEach(function (param) {
                    hash = hash + param;
                });

                return hmac.update(hash).digest('hex');
            },
            "getAccountDetails": function (accountId) {
                var self = this;
                return new Promise(function (resolve, reject) {
                    request({
                        "url": url + apiAccount + accountId,
                        "method": "GET",
                        "headers": {
                            "Api-Access-Key": apiAccessKey,
                            "Transaction-Hash": self.generateHash([accountId])
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
                            "Transaction-Hash": self.generateHash([accountId])
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
                            "Transaction-Hash": self.generateHash([accountId])
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
            "postPayment": function (data) {
                var self = this;
                return new Promise(function (resolve, reject) {

                    var accountId = data.sender.account.accountId ? data.sender.account.accountId : data.paymentInfo.creditCard.holderTaxId,
                        cardId = data.paymentInfo.creditCard.cardNumber,
                        totalAmount = data.totalAmount,
                        recipientsAccountIdAmount = "";

                    data.recipients.forEach(function (recipient) {
                        recipientsAccountIdAmount = recipientsAccountIdAmount + recipient.account.accountId +
                            Math.floor(recipient.amount);
                    });

                    var jsonbody = JSON.stringify(data);
                    request({
                        "url": url + apiPayment,
                        "method": "POST",
                        "headers": {
                            "Api-Access-Key": apiAccessKey,
                            "Transaction-Hash": self.generateHash([accountId, cardId, totalAmount,
                                recipientsAccountIdAmount]),
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        "body": jsonbody
                    }, function (error, response, body) {
                        if (!error) {
                            resolve(response);
                        } else {
                            reject(error);
                        }
                    });
                });
            },
            "postCreateAccount": function (data) {
                var self = this;
                var valoresHash = [data.body.externalIdentifier, data.body.client.taxIdentifier.taxId];

                return new Promise(function (resolve, reject) {
                    var jsonbody = JSON.stringify(data.body);
                    var req = {
                        "url": url + apiAccount,
                        "method": "POST",
                        "headers": {
                            "Api-Access-Key": apiAccessKey,
                            "Transaction-Hash": self.generateHash(valoresHash),
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        "body": jsonbody
                    };

                    request(req, function (error, response, body) {
                        if (!error) {
                            resolve(response);
                        } else {
                            reject(error);
                        }
                    });
                });
            }
        };
    };
}());
