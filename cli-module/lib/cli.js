var prompt = require('prompt');
var fs = require('fs');
var path = require('path');
var request = require('request');
var colors = require('colors');
var config = require('./config');
var crypto = require('crypto');

var cli = {

    len: 58,

    /**
     *
     * Call especific service and command vía http to deploy
     *
     * @param command
     */
    execute: function( application, command ){

        var schema = {

            properties: {

                password: {

                    required: true,

                    hidden: true,

                    message: colors.yellow( 'Contraseña:' )

                }

            }

        };

        prompt.message = '';

        prompt.delimiter  = '';

        prompt.start();

        prompt.get(schema, function (err, data) {

            if( err ){

                cli.error(6);

            }
            else{

                var servers = config.servers[application];

                var count = 0;

                if( servers.length > 0 ){

                    servers.forEach( function( server ){

                        // server url
                        var url = 'http://' + server.host + ':' + server.port ;

                        // Make request to deploy application
                        request.post( url, {form:{"password": data.password, "application": application, "command": command}},function (err, response, body) {

                            // server number
                            count++;

                            // show server number


                            if( err ){

                                var err_hash = cli.hash( err.message );

                                switch (err_hash){
                                    // connect ETIMEDOUT
                                    case 'cf01a5754d5588cb09f24d87b35f1ff8':
                                        cli.error( 7 );
                                        process.exit();
                                        break;

                                    default:
                                        console.log( err.message );

                                        cli.error( 4 );
                                }



                            }
                            else{
                                var error_hash = '0acad10fb0c2053262e87559a595c821';
                                var body_hash = cli.hash( body );

                                if( error_hash === body_hash ){
                                    console.log( colors.red( body ) );
                                    process.exit();
                                }
                                else{

                                    console.log( colors.green( cli.separator('-') ) );
                                    console.log( cli.parseLine( colors.green(  'Servidor ' + application + ' ' + count + ':' ) ) );
                                    console.log( colors.green( cli.separator('-') ) );
                                    console.log( cli.parseLine( cli.clean(  body ) ) );
                                    console.log( colors.green( cli.separator('-') ) );
                                }


                            }

                        });


                    });

                }
                else{

                    cli.error(5);

                }

            }

        });

    },

    /**
     *
     * @console {string}
     */
    error: function( code ){

        var message = '';

        switch ( code ){
            case 0:

                message = 'Es requerido el nombre de la aplicación';

                break;

            case 1:

                message = 'Es requerido el nombre del comando';

                break;

            case 2:

                message = 'La aplicación que ha definido no existe';

                break;

            case 3:

            message = 'El comando que ha definido no existe';

            break;

            case 4:

                message = 'Petición http:';

                break;

            case 5:

                message = 'No se han configurado servidores para esta aplicación';

                break;

            case 6:

                message = 'Consola:';

                break;

            case 7:

                message = 'No tiene conexión a Internet o no se ha conectado al VPN';

                break;
        }

        console.log( colors.red( 'Error: ' + message ) ) ;

    },


    /**
     *
     * @console {string}
     */
    version: function(){

        var version = JSON.parse( fs.readFileSync(path.resolve(__dirname, '../' , 'package.json'), 'utf8' ) ).version;

        console.log( colors.bold( colors.green( 'SER CLI version: ') ) + colors.cyan( version )  ) ;

        console.log( colors.bold( colors.green( 'OS: ' ) ) + colors.cyan(  process.platform )  ) ;

    },


    /**
     *
     * @param {String str}
     * @return {String}
     */
    hash: function( string ){
        var result = crypto.createHash('md5').update(string).digest('hex');
        return result;
    },

    /**
     *
     * @param {String str}
     * @return {String}
     */
    clean: function( string ){
        var result = string.replace(/\n\s*\n/g, '\n');
        return result;
    },

    /**
     *
     * @param {String str}
     * @return {String}
     */
    separator: function( y ){

        var x='',i=0;
        while (i<cli.len)
        {
            x=x + y;
            i++;
        }
        return x;
    },

    parseLine: function( string ){
        var out = [];

        var lines = string.split('\n');

        lines.forEach(function(line){

            var space = cli.len;

            var len = line.length;

            if( len > 0 ){

                if( len < cli.len && len < 34 ){

                    for( var i=len; i<=76; i++ ){
                        line = line + ' ';
                    }

                    space = 76;

                }

                line = line.substring(0, 0) + colors.green('| ') + line.substring(0) ;
                line = line.substring(0, space ) + colors.green(' |') + line.substring( space ) ;

                out.push(line);

            }

        });

        return out.join('\n');

    }

};

module.exports = cli;