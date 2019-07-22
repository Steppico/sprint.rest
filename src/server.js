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
  app.post("/api/pokemon", (req, res) => {
    const newPoke = req.body;
    pokeData.pokemon.push(newPoke);
    console.log(req.body);
    res.send(pokeData.pokemon);
    // res.json(req);
  });

  return app;
};

module.exports = { server };
/**
 * Use this file to create and set up your express server
 */
//
