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
    if (isNaN(req.params.idOrName)) {
      for (let i = 0; i < pokeData.pokemon.length; i++) {
        if (pokeData.pokemon[i].name === req.params.idOrName) {
          res.send(pokeData.pokemon[i].evolutions);
        }
      }
    } else {
      res.send(pokeData.pokemon[req.params.idOrName].evolutions);
    }
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
    pokeData.types.push(req.body.type);
    res.send(pokeData.types);
  });
  app.delete("/api/types/:name", (req, res) => {
    let deleted = "";
    for (let i = 0; i < pokeData.types.length; i++) {
      if (pokeData.types[i] === req.params.name) {
        deleted = pokeData.types.splice(i, 1);
      }
    }
    res.send(deleted);
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
  app.get("/api/attacks", (req, res) => {
    let atks = {};
    if (req.query.limit) {
      const fastAtk = [];
      const specAtk = [];
      let limit = req.query.limit;
      if (limit <= pokeData.attacks.fast.length) {
        for (let i = 0; i < limit; i++) {
          fastAtk.push(pokeData.attacks.fast[i]);
        }
        atks.fast = fastAtk;
      } else if (limit > pokeData.attacks.fast.length) {
        limit -= pokeData.attacks.fast.length;
        for (let i = 0; i < limit; i++) {
          specAtk.push(pokeData.attacks.special[i]);
        }
        atks.fast = pokeData.attacks.fast;
        atks.special = specAtk;
      }
    } else {
      atks = pokeData.attacks;
    }
    res.send(atks);
  });

  app.get("/api/attacks/fast", (req, res) => {
    const result = [];
    if (req.query.limit) {
      let limit = req.query.limit;
      if (limit > pokeData.attacks.fast.length) {
        limit = pokeData.attacks.fast.length;
      }
      for (let i = 0; i < limit; i++) {
        result.push(pokeData.attacks.fast[i]);
      }
      res.send(result);
    } else {
      res.send(pokeData.attacks.fast);
    }
  });
  app.get("/api/attacks/special", (req, res) => {
    const result = [];
    if (req.query.limit) {
      let limit = req.query.limit;
      if (limit > pokeData.attacks.special.length) {
        limit = pokeData.attacks.special.length;
      }
      for (let i = 0; i < limit; i++) {
        result.push(pokeData.attacks.special[i]);
      }
      res.send(result);
    } else {
      res.send(pokeData.attacks.special);
    }
  });
  app.get("/api/attacks/:name", (req, res) => {
    const name = req.params.name;
    const fast = pokeData.attacks.fast;
    const special = pokeData.attacks.special;
    for (let i = 0; i < fast.length; i++) {
      if (fast[i].name === name) {
        res.send(fast[i]);
      }
    }
    for (let i = 0; i < special.length; i++) {
      if (special[i].name === name) {
        res.send(special[i]);
      }
    }
  });

  app.get("/api/attacks/:name/pokemon", (req, res) => {
    const result = [];
    pokeData.pokemon.forEach(function(pokemon) {
      if (pokemon.attacks) {
        if (pokemon.attacks.fast) {
          for (let i = 0; i < pokemon.attacks.fast.length; i++) {
            if (req.params.name === pokemon.attacks.fast[i].name) {
              result.push({ name: pokemon.name, id: pokemon.id });
            }
          }
        }
        if (pokemon.attacks.special) {
          for (let i = 0; i < pokemon.attacks.special.length; i++) {
            if (req.params.name === pokemon.attacks.special[i].name) {
              result.push({ name: pokemon.name, id: pokemon.id });
            }
          }
        }
      }
    });
    res.send(result);
  });
  app.post("/api/attacks/fast", (req, res) => {
    pokeData.attacks.fast.push(req.body);
    res.send(pokeData.attacks.fast);
  });

  app.post("/api/attacks/special", (req, res) => {
    pokeData.attacks.special.push(req.body);
    res.send(pokeData.attacks.special);
  });

  app.patch("/api/attacks/:name", (req, res) => {
    const current = req.params.name;
    const change = req.body;
    const fast = pokeData.attacks.fast;
    const special = pokeData.attacks.special;

    for (let i = 0; i < fast.length; i++) {
      if (fast[i].name === current) {
        for (const key in change) {
          fast[i][key] = change[key];
        }
        res.send(fast[i]);
      }
    }
    for (let i = 0; i < special.length; i++) {
      if (special[i].name === current) {
        for (const key in change) {
          special[i][key] = change[key];
        }
        res.send(special[i]);
      }
    }
  });

  app.delete("/api/attacks/:name", (req, res) => {
    for (let i = 0; i < pokeData.attacks.fast.length; i++) {
      if (req.params.name === pokeData.attacks.fast[i].name) {
        res.send(pokeData.attacks.fast.splice(i, 1)[0]);
      }
    }
    for (let i = 0; i < pokeData.attacks.special.length; i++) {
      if (req.params.name === pokeData.attacks.special[i].name) {
        res.send(pokeData.attacks.special.splice(i, 1)[0]);
      }
    }
  });
  return app;
};

module.exports = { server };
/**
 * Use this file to create and set up your express server
 */
