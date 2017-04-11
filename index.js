#! /usr/bin/env node

//noinspection JSUnresolvedFunction
var unirest = require('unirest');
//noinspection JSUnresolvedFunction
var fs = require('fs');

var movies = {};
var limit = 50;
var endpoint = 'https://yts.ag/api/v2/list_movies.json';
var arg = process.argv[2];
if(arg == "--help"){
    console.log('Usage: ytstojson [pages]');
    console.log('Example:');
    console.log('ytstojson 3    retun 3 pages');
    console.log('ytstojson      retun all pages');
}
else if (parseInt(arg) > 0) {
    createJson(1, arg);
} else {
    unirest.get(endpoint)
        .end(function (res) {
            if (res.error) {
                console.log('GET error', res.error)
            } else {
                var total = res.body.data.movie_count;
                var pages = Math.floor(total / limit) + 1;
                createJson(1, pages);
            }
        })
}


function createJson(ini, pages) {
    unirest.get(endpoint)
        .query({'limit': limit})
        .query({'page': ini})
        .end(function (res) {
            if (res.error) {
                console.log('GET error', res.error)
            } else {
                for (var j in res.body.data.movies) {
                    movies[res.body.data.movies[j].imdb_code] = res.body.data.movies[j];
                }
            }
            if (ini == pages) {
                fs.writeFile('./movies.json', JSON.stringify(movies), function (err) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log('El archivo movies.json fue creado');
                    }
                });
            } else {
                var p = ini + 1;
                createJson(p, pages);
            }

        });
}
