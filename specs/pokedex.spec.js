"use strict";
const http = require('request');
const expect = require('chai').expect;
const assert = require('chai').assert;
const pokedex = require('../public/skills/Pokedex/services/pokedex.service');

describe("get pokemon data", () => {
    it('with id: gets pokemon json obj', (done) => {
        let str = '';
        let pokemon;

        pokedex.getPokemonById(1)
            .on('data', (res) => {
                str += res;
            })
            .on('end', () => {
                pokemon = JSON.parse(str);
                console.log('Who\s that pokemon? ' + pokemon.name);
                expect(pokemon).to.not.equal(undefined);
                assert.equal(pokemon.name, "bulbasaur");
                done();
            });
    });

    it('with name: gets pokemon json obj', (done) => {
        let str = '';
        let pokemon;

        pokedex.getPokemonByName("pikachu")
            .on('data', (res) => {
                str += res;
            })
            .on('end', () => {
                pokemon = JSON.parse(str);
                console.log('Pikachu\s ID is: ' + pokemon.id);
                expect(pokemon).to.not.equal(undefined);
                assert.equal(pokemon.id, 25);
                done();
            });
    });
});