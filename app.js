(function () {
    "use strict";

    require("dotenv").config({silent: true});

    var express = require("express"),
        cfenv = require("cfenv"),
        app = express(),
        appEnv = cfenv.getAppEnv(),
        engines = require("consolidate"),
        path = require("path"),
        fs = require("fs"),
        ejs = require("ejs"),
        passport = require("passport"),
        mqttClient = require("ibmiotf"),
        cookieSession = require("cookie-session"),
        cookieParser = require("cookie-parser"),
        compress = require("compression"),
        morgan = require("morgan"),
        server = require("http").createServer(app),
        bodyParser = require("body-parser"),
        io = require("socket.io")(server),
        request = require("request"),
        iotf_configs = require('./server/configs/ibm_iotf.js')(),
        iotf_connections = require('./server/helpers/iotf_connections')(mqttClient, io),
        crypto = require("crypto"),
        materaMP = require("./server/helpers/materaMeioPagamento.js")(crypto, request);


    // app.use(express["static"](path.join(__dirname, "./server/public/"), { maxAge: 16400000 }));
    app.use(express["static"](path.join(__dirname, "./server/public/")));
    app.use(express["static"](path.join(__dirname, "./client/")));


    app.use(compress());
    app.use(morgan("dev"));


    app.use(cookieSession({
        secret: "xamaSecretKey",
        maxAge: 1000000
    }));


    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json({limit: "50mb"}));
    app.use(passport.initialize());
    app.use(passport.session());

    app.set("views", __dirname + "/client/views");
    app.engine("html", engines.ejs);
    app.set("view engine", "html");

    require("./server/routes/index.js")(app, io, request, materaMP, iotf_connections, iotf_configs);

    server.listen(appEnv.port, "0.0.0.0", function () {
        console.log("server starting on " + appEnv.url);
    });
}());

