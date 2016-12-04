/**
 * Created by danielabrao on 12/3/16.
 */
(function () {
    "use strict";

    module.exports = function (app, Cloudant) {
        var truckDB = Cloudant.use("trucks");


        app.get("/getAllTrucks", function (req, res) {
            truckDB.find({
                "selector": {
                    "placa": {
                        "$gt": null
                    }
                }
            }, function (err, data) {
                console.log(err, data);
                if (!err) {
                    if (data.docs) {
                        return res.status(200).send(data.docs);
                    }
                }
            });
        });


        app.post('/insertTruck', function (req, res) {
            if (!req.body.placa) {
                return res.status(400).send('Não é possível prosseguir sem uma placa');
            }

            process.nextTick(function () {
                truckDB.find({
                    selector: {
                        "placa": req.body.placa
                    }
                }, function (err, trucks) {
                    if (err) {
                        console.error(new Error(err));
                        return res.status(500).send(err);
                    }
                    if (trucks.docs.length) {
                        return res.status(403).send('Caminhão existente');
                    }

                    truckDB.insert(req.body, function (err) {
                        if (err) {
                            return res.status(500).send('Ocorreu um erro inesperado');
                        }

                        return res.status(201).send('Caminhão inserido');

                    });
                });
            });



        });
    };

}());