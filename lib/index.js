/**
 * Reads and stores information about different database configurations based on the current
 * environment.  Gets the environment from the app.settings.env variable, which itself reads
 * the NODE_ENV environment variable and defaults to "development" if none is present.
 **/
var _ = require('underscore'),
    sutil = require('util');
/**
 * @options is the hash of options the user passes in when creating an instance
 * of the plugin.
 * @imports is a hash of all services this plugin consumes.
 * @register is the callback to be called when the plugin is done initializing.
 */
module.exports = function setup(options, imports, register) {
      var app = imports.app.app,
          async = require('async');
      
      /**
       * Searches through the current environment configurations and uses the
       * config info for data from there only.
       * Providers can be added by installing the "acute-data-*" npm package, where
       * "*" is the name of the provider.
       * @param opts an object of config parameters.
       * @param fn a callback that takes an error param (err).
       **/
      var connect = function(opts, fn) {
        async.each(_.keys(options.environments[app.get('env')]), function(dataConfig, cb) {
          var configObject = options.environments[app.get('env')][dataConfig];
          if (!configObject.hasOwnProperty("provider")) {
            cb("Provider is a required field");
          } else {
            // var provider = imports["acute-data-" + configObject.provider];
            var provider = imports["data-" + configObject.provider];
            console.log("Provider = ", provider);
            if (_.isUndefined(provider) || _.isNull(provider)) {
              cb("Unable to find a registered handler for " + configObject.provider);
            } else {
              var currentData;
              if (app.get("data") !== undefined && app.get("data") !== null) {
                currentData = app.get("data");
              } else {
                currentData = {};
              }
              // Providers all implement a "connect" method that returns
              // some form of database connector.
              // console.log("provider = ", sutil.inspect(provider));
              provider.connect(configObject, function(err, connection) {
                if (!err) {
                  currentData[dataConfig] = {
                    'provider': provider,
                    'connection': connection
                  }
                  app.set("data", currentData);
                  cb(null, connection);
                } else {
                  cb(err);
                }
              });
            }
          }
        }, function(err) {
          fn(err);
        });
      };
      
      var getData = function() {
        return app.get("data")        
      };
      
      /**
       * Disconnect a data source.  If no provider is included, the function
       * disconnects all data sources.
       * @param provider an optional provider to disconnect
       * @param fn a callback that's called after disconnecting is complete
       **/
      var disconnect = function(provider, fn) {
        if (!_.isUndefined(provider)) {
          try {
            getData()[provider].provider.disconnect(fn);
          } catch (e) {
            fn(e);
          }
        } else {
          async.each(_.keys(getData()), function(key, cb) {
            try {
              getData()[key].provider.disconnect(fn);
              cb();
            } catch (e) {
              cb(e);
            }
          }, function(err) {
            fn(err);
          });
        }
      };
      
      register(null, {
        data: {
          connect: connect,
          dataSources: getData,
          disconnect: disconnect
        }
      });
};