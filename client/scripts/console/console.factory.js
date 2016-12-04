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
            }
        }
    };

}());