const pokeData = require("./data");
const express = require("express");

const server = () => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded());

  app.get("/api/pokemon", (req, res) => {
    if (req.query.limit) {
      const result = [];
      for (let i = 0; i < req.query.limit; i++) {
        result.push(pokeData.pokemon[i]);
      }
      res.send(result);
    }
    res.send(pokeData.pokemon);
  });
  app.get("/api/pokemon/:idOrName", (req, res) => {
    const item = req.params;
    const poke = pokeData.pokemon[Number(item.idOrName) - 1];
    if (poke === undefined) {
      for (let i = 0; i < pokeData.pokemon.length; i++) {
        if (pokeData.pokemon[i].name === item.idOrName) {
          res.send(pokeData.pokemon[i]);
        }
      }
    }
    res.send(poke);
  });
  // TO SOLVE
  app.get("/api/pokemon/:idOrName/evolutions", (req, res) => {
    const param = req.params.idOrName;
    console.log(param);
    let poke = pokeData.pokemon[Number(param)].evolutions;
    if (poke === undefined) {
      for (let i = 0; i < pokeData.pokemon.length; i++) {
        if (pokeData.pokemon[i] === param) {
          poke = pokeData.pokemon[i].evolutions;
        }
      }
    }
    res.send(poke);
  });

  app.post("/api/pokemon", (req, res) => {
    const newPoke = req.body;
    pokeData.pokemon.push(newPoke);
    res.send(pokeData.pokemon);
  });
  app.patch("/api/pokemon/:idOrName", (req, res) => {
    const modd = req.params;
    let poke = pokeData.pokemon[Number(modd.idOrName) - 1];
    if (poke === undefined) {
      for (const item of pokeData.pokemon) {
        if (item.name === modd.idOrName) {
          poke = item;
        }
      }
    }
    for (const key in req.body) {
      poke[key] = req.body[key];
    }
    res.send(pokeData.pokemon);
  });

  app.delete("/api/pokemon/:idOrName", (req, res) => {
    const deletion = req.params;
    const pokeBye = pokeData.pokemon[Number(deletion.idOrName) - 1];
    // console.log(pokeBye);
    res.send(pokeData.pokemon.splice(Number(deletion.idOrName) - 1, 1));
  });

  return app;
};

module.exports = { server };
/**
 * Use this file to create and set up your express server
 */
