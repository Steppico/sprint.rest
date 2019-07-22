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
    it("should take a query parameter and return a given number or pokemon", async () => {
      const res = await request.get("/api/pokemon").query({ limit: 10 });
      const arr = [];
      for (let i = 0; i < 10; i++) {
        arr.push(pokeData.pokemon[i]);
      }
      res.should.be.json;
      expect(res.body.length).to.equal(arr.length);
    });
  });
  describe("POST /api/pokemon", () => {
    it("should add a pokemon", async () => {
      const res = await request.post("/api/pokemon");
      // console.log("pokeData.pokemon:", pokeData.pokemon);
      // console.log("pokeData.pokemon[152]:", pokeData.pokemon[152]);
      expect(res.body.length).to.equal(152);
    });
  });
});
