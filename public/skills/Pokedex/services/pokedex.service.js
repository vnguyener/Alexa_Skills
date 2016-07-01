"use strict";
const request = require('request');
const http = require('http');
const url = 'http://pokeapi.co';

let getJSON = function(path) {

    console.log('REQUEST URL: ' + path);

    const options = {
        host: url, 
        method: 'GET',
        path: path,
        headers: {
            ContentType: 'application/json'
        }
    }
    
    return request.get(path);
}

const Pokedex = function() {
    let getPokemonById = function(id) {
        return getJSON(url + '/api/v2/pokemon/' + id);
    }

    let getPokemonByName = function(name) {
        return getJSON(url + '/api/v2/pokemon/' + name);
    }

    let getMoveByName = function(name) {
        return getJSON(url + '/api/v2/move/' + name);
    }

    let getLocationByName = function(name) {
        return getJSON(url + '/api/v2/location/' + name);
    }

    let getEvolutionChainById = function(id) {
        return getJSON(url + '/api/v2/evolution-chain/' + id);
    }
    
    return {
        getPokemonById: getPokemonById,
        getPokemonByName: getPokemonByName
    }
};

module.exports = Pokedex();