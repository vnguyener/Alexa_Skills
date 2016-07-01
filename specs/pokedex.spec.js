"use strict";
const http = require('request');
const expect = require('chai').expect;
const pokedex = require('../public/skills/Pokedex/services/pokedex.service');

describe("get pokemon by id", () => {
    it('gets json pokemon obj', (done) => {
        var str = '';
        pokedex.getPokemonByID(1)
            .on('data', (res) => {
                str += res;
            })
            .on('end', () => {
                console.log(str);
                expect(str).to.not.equal(undefined);
                done();
            });
    });
});