/**
 * @description Create and remove pid file.
 * @type {exports}
 */

var fs = require('fs');
var path = require('path');

function getPidPath( ){

    var pidPath = path.resolve( __dirname, '../pids/pid.pid' );

    return pidPath;

}

exports.make = function( ){

    // on application exit remove pid file
    //so the program will not close instantly
    process.stdin.resume();
    process.on('exit', function (){
        fs.unlinkSync( getPidPath( ) );
    });
    process.on('SIGINT', function () {
        process.exit(0);
    });

    // kill pid and remove file only if file exist
    if( fs.existsSync( getPidPath( ) ) ){

        var oldPid = fs.readFileSync( getPidPath( ),'utf8' );

        process.kill( oldPid );

        fs.unlinkSync( getPidPath( ) );

    }

    // pids directory path
    var directory = path.resolve( __dirname, '../pids');

    // create dir if not exit
    if( !fs.existsSync( directory ) ){

        fs.mkdirSync( directory );

    }

    // Create pid file
    setTimeout(function(){
        // create pid
        var pidfile = fs.openSync(getPidPath( ), "w");
        fs.writeSync(pidfile, process.pid);
        fs.closeSync(pidfile);

    },3000);

}