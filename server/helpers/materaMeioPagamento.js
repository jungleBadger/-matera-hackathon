(function () {
    "use strict";

    var secretKey = process.env.SECRET_KEY;
    var apiAccessKey = process.env.API_ACCESS_KEY;
    var url = "http://public-api-elb-1090807689.us-west-2.elb.amazonaws.com";
    var apiAccount = "/v1/accounts/";
    var apiPayment = "v1/payments/";

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
            "postPayment": function (body) {
                var self = this;
                return new Promise(function (resolve, reject) {

                    var accountId = body.myAccount.accountId || body.paymentInfo.creditCard.holderTaxId,
                        cardId = body.paymentInfo.creditCard.cardNumber,
                        totalAmount = 0,
                        recipientsAccountIdAmount = "";

                    body.recipients.forEach(function (recipient) {
                        totalAmount = totalAmount + recipient.amount;
                        recipientsAccountIdAmount = recipientsAccountIdAmount + recipient.account.accountId +
                            recipient.amount;
                    });

                    request({
                        "url": url + apiPayment,
                        "method": "POST",
                        "headers": {
                            "Api-Access-Key": apiAccessKey,
                            "Transaction-Hash": self.generateHash([accountId, cardId, totalAmount,
                                recipientsAccountIdAmount])
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
            "postCreateAccount": function (body) {
                var self = this;
                var valoresHash = [Math.random(), body.client.taxId];

                return new Promise(function (resolve, reject) {
                    var req = {
                        "url": url + apiAccount,
                        "method": "POST",
                        "headers": {
                            "Api-Access-Key": apiAccessKey,
                            "Transaction-Hash": self.generateHash(valoresHash)
                        }
                    };
                    req.body = body;

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
