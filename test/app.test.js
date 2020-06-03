const { expect } = require("chai");
const supertest = require("supertest");
const app = require("../app");
const playstore = require("../playstore");

describe("GET /apps", () => {
  it("should return 200 with json array of apps", () => {
    return supertest(app)
      .get("/apps")
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        expect(res.body).to.be.an("array");
        expect(res.body[0]).to.be.an("object");
        expect(res.body[0]).to.include.keys("App", "Category", "Rating");
      });
  });

  it('should return 400 with "Sort must be one of App or rating"', () => {
    return supertest(app)
      .get("/apps")
      .query({ sort: "invalid" })
      .expect(400, "Sort must be one of App or rating");
  });

  const sortFilter = ["App", "Rating"];
  sortFilter.forEach((sort) => {
    it(`should return apps data sorted by ${sort}`, () => {
      return supertest(app)
        .get("/apps")
        .query({ sort: sort })
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an("array");
          let sortArray = playstore.sort((a, b) => {
            return a[sort] - b[sort];
          });
          expect(sortArray).to.eql(res.body);
        });
    });
  });

  const genres = ["Action", "Puzzle", "Strategy", "Casual", "Arcade", "Card"];
  genres.forEach((genre) => {
    it(`should return apps data sorted by ${genre}`, () => {
      return supertest(app)
        .get("/apps")
        .query({ genre: genre })
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an("array");
          let genreArray = playstore.filter((apps) =>
            apps.Genres.toLowerCase().includes(genre.toLowerCase())
          );
          expect(genreArray).to.eql(res.body);
        });
    });
  });
});
