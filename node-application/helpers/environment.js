/**
 * @description Set environment var
 * @type {exports}
 */

var path = require('path');

exports.init = function(){

    var root = path.resolve( __dirname, '../' );

    switch ( root ){

        case '/sites/my-application':

            process.env.NODE_ENV = 'production';
            process.env.PORT = 8080;
            process.env.NEW_RELIC_APP_NAME = 'my-application';
            process.env.NEW_RELIC_ENABLED = true;

            break;

        case '/sites/betas/my-application':

            process.env.NODE_ENV = 'beta';
            process.env.PORT = 8081;
            process.env.NEW_RELIC_APP_NAME = 'my-application-' + process.env.NODE_ENV;
            process.env.NEW_RELIC_ENABLED = true;

            break;

        default:

            process.env.NODE_ENV = 'development';
            process.env.PORT = 8082;
            process.env.NEW_RELIC_APP_NAME = 'my-application-' + process.env.NODE_ENV;
            process.env.NEW_RELIC_ENABLED = false;
    }

    console.log( 'Mode: ' + process.env.NODE_ENV );
    console.log( 'Port: ' + process.env.PORT );
    console.log( 'Name: ' + process.env.NEW_RELIC_APP_NAME );
    console.log( 'Newrelic: ' + process.env.NEW_RELIC_ENABLED );

}