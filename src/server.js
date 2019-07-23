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
    } else {
      res.send(pokeData.pokemon);
    }
  });
  app.get("/api/pokemon/:idOrName", (req, res) => {
    const item = req.params.idOrName;
    const poke = pokeData.pokemon[Number(item) - 1];
    if (poke === undefined) {
      for (let i = 0; i < pokeData.pokemon.length; i++) {
        if (pokeData.pokemon[i].name === item) {
          res.send(pokeData.pokemon[i]);
        }
      }
    }
    res.send(poke);
  });
  app.get("/api/pokemon/:idOrName/evolutions", (req, res) => {
    const param = req.params.idOrName;
    let poke;
    for (const key of pokeData.pokemon) {
      if (Number(key.id) == param) {
        poke = key;
      }
    }
    if (poke === undefined) {
      for (let i = 0; i < pokeData.pokemon.length; i++) {
        if (pokeData.pokemon[i].evolutions) {
          if (pokeData.pokemon[i].name === param) {
            poke = pokeData.pokemon[i];
          }
        }
      }
    }
    res.send(poke.evolutions);
  });

  app.get("/api/pokemon/:idOrName/evolutions/previous", (req, res) => {
    const param = req.params.idOrName;
    let poke = pokeData.pokemon[param - 1];
    if (poke === undefined) {
      for (let i = 0; i < pokeData.pokemon.length; i++) {
        if (pokeData.pokemon[i]["Previous evolution(s)"]) {
          if (pokeData.pokemon[i].name === param) {
            poke = pokeData.pokemon[i];
          }
        }
      }
    }
    res.send(poke["Previous evolution(s)"]);
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
    const deletion = req.params.idOrName;
    res.send(pokeData.pokemon.splice(Number(deletion) - 1, 1));
  });

  app.get("/api/types", (req, res) => {
    if (req.query.limit) {
      const limit = req.query.limit;
      const result = [];
      for (let i = 0; i < limit; i++) {
        result.push(pokeData.types[i]);
      }
      res.send(result);
    } else {
      res.send(pokeData.types);
    }
  });

  app.post("/api/types", (req, res) => {
    console.log(req.body.type);
    pokeData.types.push(req.body.type);
    res.send(pokeData.types);
  });
  app.delete("/api/types/:name", (req, res) => {
    console.log(req.params.name);
    let deleted = "";
    for (let i = 0; i < pokeData.types.length; i++) {
      if (pokeData.types[i] === req.params.name) {
        deleted = pokeData.types.splice(i, 1);
      }
    }
    res.send(deleted[0]);
  });
  app.get("/api/types/:type/pokemon", (req, res) => {
    const filter = req.params.type;
    const result = [];
    for (let i = 0; i < pokeData.pokemon.length; i++) {
      pokeData.pokemon[i].types.forEach((type) => {
        if (type === filter) {
          result.push({
            id: pokeData.pokemon[i].id,
            name: pokeData.pokemon[i].name,
          });
        }
      });
    }
    res.send(result);
  });
  return app;
};

module.exports = { server };
/**
 * Use this file to create and set up your express server
 */
