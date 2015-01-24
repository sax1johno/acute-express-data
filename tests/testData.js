var architect = require('architect'),
    path = require('path'),
    thisApp,
    sutil = require('util'),
    async = require('async');
    
describe('data', function() {
    before(function(done) {
        var configPath = path.join(__dirname, "testconfig.js");
        var config = architect.loadConfig(configPath);
        console.log("Config = ", config);
        architect.createApp(config, function (err, arch) {
            if (err) {
                done(err);
            } else {
                thisApp = arch;
                done();
            }
        });
    });
    describe("#getData", function() {
        it("should get the current data", function(done) {
            var serviceObject = thisApp.getService("data");
            var app = thisApp.getService('app');
            app.app.set('env', 'development');
            sutil.inspect(app.app.get('data'));
            done();
            // serviceObject.connect({}, function(err, connection) {
            //     if (!err) {
            //         console.log("data = ", sutil.inspect(app.app.get('data')));
            //         done();
            //     } else {
            //         console.log("Error encountered when attempting to connect: ", err);
            //         done(false);
            //     }
            // });
        });
    });
    
    describe("#connect", function() {
        // it("should return an error with invalid credentials", function(done) {
        //     var serviceObject = thisApp.getService("data");
        //     var app = thisApp.getService('app');
        //     app.app.set('env', 'junk');
        //     // close all connections before attempting to open another.
        //     serviceObject.disconnect(null, function() {
        //         serviceObject.connect({}, function(err, connection) {
        //             console.log("error = ", err, " and connection = ", sutil.inspect(connection));
        //             if (!err && !connection) {
        //                 done();
        //             } else if (err) {
        //                 done();
        //             } else {
        //                 done(false);
        //             }
        //         });
        //     })
        // });
        it("should return a valid connection with valid credentials", function(done) {
            var serviceObject = thisApp.getService("data");
            var app = thisApp.getService('app');
            app.app.set('env', 'development');
            console.log(serviceObject);
            serviceObject.disconnect(null, function() {
                serviceObject.connect({}, function(err, connection) {
                    if (!err) {
                        done();
                    } else {
                        console.log("Error encountered when attempting to connect: ", err);
                        done(false);
                    }
                });
            })
        });
    });

});
