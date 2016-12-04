/**
 * Created by danielabrao on 12/3/16.
 */
(function () {
    "use strict";

    var socket = require('../../../server/public/libs/socket.io-client/socket.io')(),
        $ = require("jquery"),
        factory = require("./console.factory")($),
        ladda = require("ladda"),
        toastr = require("toastr");

    var manipulatedAccount;

    var properties = {
        "userListEl": document.getElementById("userList"),
        "driversListEl": document.getElementById("drivers"),
        "trucksListEl": document.getElementById("trucks"),
        "driverBalanceEl": document.getElementById("driverBalance"),
        "driverNameEl": document.getElementById("driverName"),
        "insertTripForm": document.getElementById("sendTripForm"),
        "driverAlertsListEl": document.querySelector(".driverAlerts"),
        "driverHeaderWrapper": document.querySelector(".driverHeader")
    };

    console.log(properties);
    var handlers = {
        "addUserListAction": function (userEl, userInfo) {
            methods.changeBalanceInfo().changeDriverNameInfo();
            userEl.addEventListener("click", function () {
                $(properties.driverHeaderWrapper).slideToggle();
                // methods.removeDOMElement(properties.driverAlertsListEl);
                // factory.getTripsByDriver(userInfo.accountId).then(function (tripsArr) {
                //     tripsArr.forEach(function (trip) {
                //         properties.driverAlertsListEl.appendChild(methods.buildTripList(trip));
                //     });
                // }, function (err) {
                //     console.log(err);
                // });
                manipulatedAccount = userInfo.accountId;
                factory.getUserBalance(userInfo.accountId).then(function (data) {
                    try {
                        methods.changeBalanceInfo(["R$ ", data.balances[1].amount.toLocaleString()].join("")).changeDriverNameInfo(userInfo.username);
                    } catch (e) {
                        console.log(e);
                    }
                }, function (error) {
                    console.log(error);
                });
            });

            return userEl;
        },
        "addTripAction": function () {
            properties.insertTripForm.addEventListener("submit", function (el) {
                el.preventDefault();
                factory.insertTrip($("#sendTripForm").serialize()).then(function (data) {
                    console.log(data);
                    console.log("saved successfully");
                }, function (err) {
                    console.log(err);
                });
            });
        },
        "addTripListAction": function (tripEl, tripObj) {
            tripEl.addEventListener("click", function () {
                console.log(tripObj);
                methods.loadMap(tripObj.origemLocation, tripObj.destinoLocation, tripObj.vehicleTrail || []);
            });
        }
    };


    var methods = {
        "loadMap": function (loc1, loc2, arr) {

            var uluru = { lat: loc1.lat, lng: loc1.lng };
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 6,
                center: uluru
            });

            var contentString = '<div id="content">'+
                '<div id="siteNotice">'+
                '</div>'+
                '<h1 id="firstHeading" class="firstHeading">Aquecimento detectado</h1>'+
                '<div id="bodyContent"><p>Superaquecimento detectado</p>' +
                '</div>'+
                '</div>';

            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });


            for (var i = 0; i < arr.length; i += 1) {
                var location = JSON.parse(arr[i].location);
                var marker2 = new google.maps.Marker({
                    // position: {"lat": location.latitude - 1, "lng": location.longitude - 1},
                    position: {"lat": -23.175671, "lng": -45.891064},
                    map: map
                });
                marker2.addListener('click', function() {
                    infowindow.open(map, marker2);
                });
            }


            var markerInit = new google.maps.Marker({
                position: {"lat": loc1.lat, "lng": loc1.lng},
                map: map,
                title: 'Hello World!'
            });

            var markerEnd = new google.maps.Marker({
                position: {"lat": loc2.lat, "lng": loc2.lng},
                map: map,
                title: 'Hello World!'
            });


        },
        "removeDOMElement": function (el) {
            while (el.firstChild) {
                el.removeChild(el.firstChild);
            }

        },
        "buildTripList": function (trip) {
            var div = document.createElement("div");
            div.classList.add("col-12");
            div.classList.add("alertList");

            if (trip.status === "active") {
                var btnImg = document.createElement("img");
                btnImg.classList.add("img-holder");
                btnImg.src = "/assets/close.svg";

                btnImg.addEventListener("click", function () {
                    $("#popup").slideDown();
                });
                div.classList.add("active-trip");
                div.appendChild(btnImg);
            } else if (trip.status === "finished") {
                div.classList.add("finished-trip");
            } else {
                div.classList.add("canceled-trip");
            }

            var incomingSpan = document.createElement("span");
            var destSpan = document.createElement("span");

            incomingSpan.appendChild(document.createTextNode("De: " + trip.origem));
            destSpan.appendChild(document.createTextNode("Para: " + trip.destino));

            div.appendChild(document.createTextNode(trip.truck));
            var innerDiv = document.createElement("div");
            innerDiv.appendChild(incomingSpan);
            innerDiv.appendChild(destSpan);


            div.appendChild(innerDiv);
            handlers.addTripListAction(div, trip);
            return div;
        },
        "changeDriverNameInfo": function (name) {
            properties.driverNameEl.innerHTML = name || "";
            return this;
        },
        "changeBalanceInfo": function (amount) {
            properties.driverBalanceEl.innerHTML = amount || "";
            return this;
        },
        "createDatalistOption": function (itemArray) {
            var docFragment = document.createDocumentFragment();
            itemArray.forEach(function (item) {
                var option = document.createElement("option");
                option.value = item.accountId || item.placa;
                option.attributes.value = item.accountId || item.placa;
                option.appendChild(document.createTextNode(item.username || item.placa));
                docFragment.appendChild(option);
            });
            return docFragment
        },
        "buildDriverList": function (driverInfo) {
            var docFragment = document.createDocumentFragment();

            var outerDiv = document.createElement("div"),
                innerDiv = document.createElement("div"),
                imgEl = document.createElement("img"),
                infoDiv = document.createElement("div"),
                nameLabel = document.createElement("label"),
                infoLabel = document.createElement("label");

            innerDiv.classList.add("drivers");

            imgEl.attributes.alt = "img";

            imgEl.src = "http://placehold.it/50x50";
            imgEl.classList.add("driver-pic");

            innerDiv.appendChild(imgEl);

            infoDiv.classList.add("driverInfo");
            infoDiv.classList.add("col-8");
            console.log(driverInfo);

            nameLabel.appendChild(document.createTextNode(driverInfo.username));
            nameLabel.classList.add("name-disclaimer");
            infoLabel.appendChild(document.createTextNode(driverInfo.accountId));
            infoLabel.classList.add("account-disclaimer");
            infoDiv.appendChild(nameLabel);
            infoDiv.appendChild(infoLabel);

            innerDiv.appendChild(infoDiv);
            outerDiv.appendChild(innerDiv);
            handlers.addUserListAction(outerDiv, driverInfo);

            docFragment.appendChild(outerDiv);
            return docFragment;
        },
        "init": function () {
            var self = this;
            handlers.addTripAction();

            factory.getAllTrips().then(function (tripsArr) {
                console.log(tripsArr);
                tripsArr.forEach(function (trip) {
                    properties.driverAlertsListEl.appendChild(methods.buildTripList(trip));
                });
            });

            factory.getAllDrivers().then(function (drivers) {
                properties.driversListEl.appendChild(methods.createDatalistOption(drivers));
                drivers.forEach(function (driver) {
                    properties.userListEl.appendChild(self.buildDriverList(driver));
                });
            }, function (error) {
                properties.userListEl.appendChild(document.createTextNode("Erro ao recuperar motoristas"));
                console.log(error);
            });

            factory.getAllTrucks().then(function (trucks) {
                properties.trucksListEl.appendChild(methods.createDatalistOption(trucks));
            }, function (error) {
                console.log(error);
            });
        }
    };


    socket.on("connect", function() {
        console.log('connected');
    });
    socket.on("connect_error", function() {
        console.log('connected error');
    });

    socket.on("payloadReceived", function (location) {

        var x = JSON.parse(location);
        console.log(x);


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

    methods.init();


    $("#yes").click(function () {
        factory.payAccount(manipulatedAccount).then(function (data) {
            $("#popup").slideUp();
        }, function (err) {
            console.log(err);
        });
    });

    $("#no").click(function () {
        $("#popup").slideUp();
    });



}());


