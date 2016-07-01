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
    let getPokemonByID = function(id) {
        return getJSON(url + '/api/v2/pokemon/' + id);
    }

    let getPokemonByName = function() {

    }

    let getMoveByName = function() {

    }

    let getLocationById = function() {

    }

    let getEvolutionChainBy = function() {

    }
    
    return {
        getPokemonByID: getPokemonByID
    }
};

module.exports = Pokedex();