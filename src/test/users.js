const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const should = chai.should();
chai.use(chaiHttp);

const agent = chai.request.agent(server);

const User = require("../models/user");

describe("User", function () {

    it("Should have home page", function(done) {
        // Describe what should happen
        // In this case we test that the home page loads
        agent.get("/")
          .end(function(err, res) {
            res.status.should.be.equal(200);
            return done(); // Call done if the test completed successfully.
          });
    });

    it("should not be able to login if they have not registered", function (done) {
        agent.post("/login").send({
            username: "fklsajdlk",
            password: "password"
        }).end(function (err, res) {
            res.status.should.be.equal(401);
            done();
        });
    });

    // signup
    it("should be able to signup", function (done) {
        User.findOneAndRemove({
            username: "testone"
        }, function () {
            agent
                .post("/sign-up")
                .send({
                    username: "testone",
                    password: "password"
                })
                .end(function (err, res) {
                    res.should.have.status(200);
                    agent.should.have.cookie("nToken");
                    done();
                });
        });
    });

    // login
    it("should be able to login", function (done) {
        agent
            .post("/login")
            .send({
                username: "testone",
                password: "password"
            })
            .end(function (err, res) {
                res.should.have.status(200);
                agent.should.have.cookie("nToken");
                done();
            });
    });

    // logout
    it("should be able to logout", function (done) {
        agent.get("/logout").end(function (err, res) {
            res.should.have.status(200);
            agent.should.not.have.cookie("nToken");
            done();
        });
    });
});