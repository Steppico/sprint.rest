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
      const res = await request.get("/api/pokemon/3/evolutions");
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
});
