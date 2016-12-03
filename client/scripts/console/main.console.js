/**
 * Created by danielabrao on 12/3/16.
 */
(function () {
    "use strict";

    var socket = require('../../../server/public/libs/socket.io-client/socket.io')(),
        $ = require("jquery"),
        factory = require("./console.factory")($);



    socket.on("connect", function() {
        console.log('connected');
    });
    socket.on("connect_error", function() {
        console.log('connected error');
    });

    socket.on("payloadReceived", function (location) {

        var x = JSON.parse(location);


        var uluru = { lat: x.latitude, lng: x.longitude };
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 4,
            center: uluru
        });
        var marker = new google.maps.Marker({
            position: uluru,
            map: map
        });



        console.log(JSON.parse(location));
    });

    document.getElementById("insertDriverForm").addEventListener("submit", function (e) {
        e.preventDefault();
        console.log(this);
        factory.insertDriver({}).then(function () {
            console.log("driver inserted");
        }, function (err) {
            console.log("error inserting driver");
        });
    });

    $('[data-tab]').on('click', function (e) {
        e.preventDefault();
        $(this).addClass('active').siblings('.tab').removeClass('active');
        $('#tst [' + ['data-content=', $(this).data('tab'), ']'].join('')).addClass('active').siblings('[data-content]').removeClass('active');
    });



}());


