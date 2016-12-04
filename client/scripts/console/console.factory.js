/**
 * Created by danielabrao on 12/3/16.
 */
(function () {
    "use strict";

    module.exports = function ($) {
        return {
            "insertDriver": function (driverObj) {
                return new Promise(function (resolve, reject) {
                    $.ajax({
                        url: '/insertDriver',
                        method: 'post',
                        data: driverObj,
                        processData: false,
                        contentType: false
                    }).done(function(param){
                        resolve(param);
                    }).fail(function (err) {
                        reject(err);
                    });
                });
            },
            "getAllDrivers": function () {
                return new Promise(function (resolve, reject) {
                    $.ajax({
                        url: '/getAllDrivers',
                        method: 'get'
                    }).done(function(param){
                        resolve(param);
                    }).fail(function (err) {
                        reject(err);
                    });
                });
            },
            "getAllTrucks": function () {
                return new Promise(function (resolve, reject) {
                    $.ajax({
                        url: '/getAllTrucks',
                        method: 'get'
                    }).done(function(param){
                        resolve(param);
                    }).fail(function (err) {
                        reject(err);
                    });
                });
            },
            "getAllTrips": function () {
                return new Promise(function (resolve, reject) {
                    $.ajax({
                        url: '/getAllTrips',
                        method: 'get'
                    }).done(function(param){
                        resolve(param);
                    }).fail(function (err) {
                        reject(err);
                    });
                });
            },
            "getUserBalance": function (accountId) {
                return new Promise(function (resolve, reject) {
                    $.ajax({
                        url: ['/getUserBalance/', accountId].join(""),
                        method: 'get'
                    }).done(function(param){
                        resolve(param);
                    }).fail(function (err) {
                        reject(err);
                    });
                });
            },
            "getTripsByDriver": function (accountId) {
                return new Promise(function (resolve, reject) {
                    $.ajax({
                        url: ['/getTripByDriver/', accountId].join(""),
                        method: 'get'
                    }).done(function(param){
                        resolve(param);
                    }).fail(function (err) {
                        reject(err);
                    });
                });
            },
            "insertTrip": function (tripObj) {
                return new Promise(function (resolve, reject) {
                    $.ajax({
                        url: '/insertTrip',
                        method: 'post',
                        data: tripObj
                    }).done(function(param){
                        resolve(param);
                    }).fail(function (err) {
                        reject(err);
                    });
                });
            },
            "finishTrip": function (accountId) {
                return new Promise(function (resolve, reject) {
                    $.ajax({
                        url: ['/finishTrip/', accountId].join(""),
                        method: 'get'
                    }).done(function(param){
                        resolve(param);
                    }).fail(function (err) {
                        reject(err);
                    });
                });
            },
            "payAccount": function (accountId) {
                console.log("AWQUEIQIEW");
                console.log(accountId);
                return new Promise(function (resolve, reject) {
                    $.ajax({
                        url: '/payment/',
                        method: 'post',
                        data: {
                            "totalAmount": "100",
                            "currency": "BRL",
                            "externalIdentifier": "12345678",
                            "sender":
                            {
                                "account":
                                {
                                    "accountId": "63A48F39-2FFE-9C43-A5B6-4EF5F8DAEA00"
                                }
                            },
                            "paymentInfo":
                            {
                                "transactionType": "InternalTransfer"
                            },
                            "recipients":
                                [
                                    {
                                        "account":
                                        {
                                            "accountId": accountId
                                        },
                                        "amount": "100",
                                        "currency": "BRL",
                                        "senderComment": "0123456789",
                                        "recipientComment": "9876543210"
                                    }
                                ],
                            "callbackAddress": "http://www.matera.com"
                        }
                    }).done(function(param){
                        resolve(param);
                    }).fail(function (err) {
                        reject(err);
                    });
                });
            }
        }
    };

}());