const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const { server } = require("../src/server");
chai.should();
const pokeData = require("../src/data");
const { expect } = require("chai");
const app = server();

/*
 * This sprint you will have to create all tests yourself, TDD style.
 * For this you will want to get familiar with chai-http https://www.chaijs.com/plugins/chai-http/
 * The same kind of structure that you encountered in lecture.express will be provided here.
 */
describe("Pokemon API Server", () => {
  let request;
  beforeEach(() => {
    request = chai.request(app);
  });
  describe("GET /api/pokemon", () => {
    it("should return the full list of Pokemon", async () => {
      const res = await request.get("/api/pokemon");
      res.should.not.be.undefined;
      expect(res.body.length).to.equal(pokeData.pokemon.length);
    });
    it("should take a query parameter and return a given number of pokemon", async () => {
      const res = await request.get("/api/pokemon").query({ limit: 10 });
      const arr = [];
      for (let i = 0; i < 10; i++) {
        arr.push(pokeData.pokemon[i]);
      }
      res.should.be.json;
      expect(res.body.length).to.equal(arr.length);
    });
    it("should be able to return the right pokemon when ID is prompted", async () => {
      const res = await request.get("/api/pokemon/039");
      expect(Number(res.body.id)).to.equal(39);
    });
    it("should return the right pokemon when name is prompted", async () => {
      const res = await request.get("/api/pokemon/Pikachu");
      expect(res.body.name).to.deep.equal("Pikachu");
    });
    it("should return the evolutions a Pokemon has, by ID", async () => {
      const res = await request.get("/api/pokemon/4/evolutions");
      const evolutions = pokeData.pokemon[3].evolutions;
      expect(res.body).to.deep.equal(evolutions);
    });
    it("should return the evolutions a Pokemon has, by name", async () => {
      const res = await request.get("/api/pokemon/Pikachu/evolutions");
      const evolutions = pokeData.pokemon[24].evolutions;
      expect(res.body).to.deep.equal(evolutions);
    });
    it("should return an evolved pokemon's previous evolution", async () => {
      const res = await request.get("/api/pokemon/17/evolutions/previous");
      const previous = pokeData.pokemon[16]["Previous evolution(s)"];
      expect(res.body).to.deep.equal(previous);
    });
    it("should return an evolved pokemon's previous evolution, by name", async () => {
      const res = await request.get(
        "/api/pokemon/Pidgeotto/evolutions/previous"
      );
      const previous = pokeData.pokemon[16]["Previous evolution(s)"];
      expect(res.body).to.deep.equal(previous);
    });
  });
  describe("POST /api/pokemon", () => {
    it("should add a pokemon", async () => {
      const newPokemon = {
        id: "152",
        name: "Chicorita",
        classification: "Flower Pokémon",
        types: ["Grass", "Poison"],
        resistant: ["Water", "Electric", "Grass", "Fighting", "Fairy"],
        weaknesses: ["Fire", "Ice", "Flying", "Psychic"],
        weight: {
          minimum: "8.02kg",
          maximum: "12.62kg",
        },
        height: {
          minimum: "0.81m",
          maximum: "0.99m",
        },
        fleeRate: 0.1,
        evolutionRequirements: {
          amount: 25,
          name: "Chicorita candies",
        },
        evolutions: [
          {
            id: 153,
            name: "Chicosaurus",
          },
          {
            id: 154,
            name: "Chicorosa",
          },
        ],
        maxCP: 873,
        maxHP: 1080,
      };

      const res = await request.post("/api/pokemon").send(newPokemon);
      expect(res.body[res.body.length - 1]).to.deep.equal(newPokemon);
    });
  });
  describe("PATCH /api/pokemon", () => {
    it("should allow to make partial modifications to a Pokemon", async () => {
      const res = await request
        .patch("/api/pokemon/151")
        .send({ gender: "who knows" });
      expect(res.body[150].gender).to.equal("who knows");
    });
    it("should modify also when giving a name", async () => {
      const res = await request
        .patch("/api/pokemon/Voltorb")
        .send({ type: "water" });
      expect(res.body[99].type).to.equal("water");
    });
  });
  xdescribe("DELETE /api/pokemon/:idOrName", () => {
    it("should return the deleted pokemon", async () => {
      const res = await request.delete("/api/pokemon/1");
      expect(res.body[0].name).to.equal("Bulbasaur");
    });
    it("should have deleted Bulbasaur", async () => {
      const res = await request.get("/api/pokemon");
      expect(res.body[0].name).not.to.equal("Bulbasaur");
    });
  });
  describe("GET /api/types", () => {
    it("should get all types", async () => {
      const res = await request.get("/api/types");
      const result = pokeData.types;
      expect(res.body).to.deep.equal(result);
    });
    it("should return n types when limit is set", async () => {
      const res = await request.get("/api/types?limit=5");
      const limit = [];
      for (let i = 0; i < 5; i++) {
        limit.push(pokeData.types[i]);
      }
      expect(res.body).to.deep.equal(limit);
    });
    it("should return the number of pokemon by type", async () => {
      const res = await request.get("/api/types/Grass/pokemon");
      expect(res.body.length).to.equal(15);
    });
  });
  describe("POST, /api/types", () => {
    it("should add a new type", async () => {
      const newType = { type: "Dark" };
      const res = await request.post("/api/types").send(newType);
      expect(res.body[res.body.length - 1]).to.deep.equal(newType.type);
    });
    xdescribe("DELETE, /api/types:name", () => {
      it("should delete a type", async () => {
        const res = await request.delete("/api/types/Dragon");
        expect(res.body[0]).to.equal("Dragon");
      });
    });
    describe("GET, /api/attacks", () => {
      it("should return all attacks", async () => {
        const res = await request.get("/api/attacks");
        const attacks = pokeData.attacks;

        expect(res.body).to.deep.equal(attacks);
      });
      it("should return n attacks", async () => {
        const res = await request.get("/api/attacks").query({ limit: 12 });
        const result = {};
        const fast = [];
        for (let i = 0; i < 12; i++) {
          fast.push(pokeData.attacks.fast[i]);
        }
        result.fast = fast;
        expect(res.body).to.deep.equal(result);
      });
      it("should retrieve only fast attacks", async () => {
        const res = await request.get("/api/attacks/fast");
        const fast = pokeData.attacks.fast;
        expect(res.body).to.deep.equal(fast);
      });
      it("should retrieve n fast attacks", async () => {
        const res = await request.get("/api/attacks/fast").query({ limit: 2 });
        const fast = [];
        for (let i = 0; i < 2; i++) {
          fast.push(pokeData.attacks.fast[i]);
        }
        expect(res.body).to.deep.equal(fast);
      });
      it("should retrieve only special attacks", async () => {
        const res = await request.get("/api/attacks/special");
        const special = pokeData.attacks.special;
        expect(res.body).to.deep.equal(special);
      });
      it("should retrieve n special attacks", async () => {
        const res = await request
          .get("/api/attacks/special")
          .query({ limit: 2 });
        const special = [];
        for (let i = 0; i < 2; i++) {
          special.push(pokeData.attacks.special[i]);
        }
        expect(res.body).to.deep.equal(special);
      });
      it("should retrieve an attack by its name", async () => {
        const res = await request.get("/api/attacks/Sludge Bomb");
        const expected = pokeData.attacks.special[2];
        expect(res.body).to.deep.equal(expected);
      });
      it("should retrieve all pokemons that have the same attacks", async () => {
        const res = await request.get("/api/attacks/Vine Whip/pokemon");
        expect(res.body.length).to.equal(5);
      });
    });
    describe("POST /api/attacks", () => {
      it("should add an attack to fast", async () => {
        const atk = { name: "RINA SLAP", type: "Destructive", damage: 999 };
        const res = await request.post("/api/attacks/fast").send(atk);
        expect(res.body[res.body.length - 1]).to.deep.equal(atk);
      });
      it("should add an attack to special", async () => {
        const attack = { name: "Stefano Uppercut", type: "nyao", damage: 1000 };
        const res = await request.post("/api/attacks/special").send(attack);
        expect(res.body[res.body.length - 1]).to.deep.equal(attack);
      });
    });
    describe("PATCH /api/attacks", () => {
      it("should modify an existing attack", async () => {
        const res = await request
          .patch("/api/attacks/Razor Leaf")
          .send({ name: "Razor LEAVES" });

        expect(res.body.name).to.equal("Razor LEAVES");
      });
    });
    describe("DELETE /api/attacks", () => {
      it("should delete a fast attack", async () => {
        const res = await request.delete("/api/attacks/Bug Bite");

        expect(res.body).to.deep.equal({
          name: "Bug Bite",
          type: "Bug",
          damage: 5,
        });
      });
      it("should delete a special attack", async () => {
        const res = await request.delete("/api/attacks/Solar Beam");

        expect(res.body).to.deep.equal({
          name: "Solar Beam",
          type: "Grass",
          damage: 120,
        });
      });
    });
  });
});
