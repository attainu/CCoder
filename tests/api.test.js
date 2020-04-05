process.env.NODE_ENV = 'test'
const request = require('supertest')
const api = require('../app')
const db = require('../db')
let user;
let challenge;
let testcase;
let contest;
let contestChallenge;
beforeAll(() => {
  db.connect
});
afterAll(() => {
  db.disconnect()
});

describe('Register user And Login', () => {
  test('should post a Error response of POST /user/register ', function (done) {
    request(api)
      .post('/user/register')
      .send({
        name: "anurag gothi",
        username: "anurag gothi",
        email: "anuraggothi4@gmail.com",
        password: "Anurag@123"
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  })
  test('should post a Accept response of POST /user/register ', function (done) {
    request(api)
      .post('/user/register')
      .send({
        name: "anurag gothi",
        username: "anuraggothi",
        email: "anuraggothi40@gmail.com",
        password: "Anurag@123"
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .end(function (err, res) {
        user = res.body.createUser
        if (err) return done(err);
        done();
      });
  })
  test('should post a Accept response of POST /user/login ', function (done) {
    request(api)
      .post('/user/login')
      .send({

        email: user.email,
        password: user.password
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        user = res.body.loginUser
        if (err) return done(err);
        done();
      });
  })
  test('should post a Accept response of POST /user/login ', function (done) {
    request(api)
      .post('/user/login')
      .send({

        email: user.email,
        password: 'wrong'
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  })
})

describe('Challenge Creation with testcases', () => {
  test('should post a Error response of POST /admin/challenge ', function (done) {
    request(api)
      .post('/admin/challenge/')
      .send({
        decription: "add",
        question: "abcdec",
        output: "15",
        input: "5,10",
        func_name: "add",
        no_of_args: 2,
        editorial: "print(a+b)",
        maxScore: 40
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', "text/html; charset=utf-8")
      .expect(422)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  })
  test('should post a Accept response of POST /admin/challenge ', function (done) {
    request(api)
      .post('/admin/challenge')
      .send({
        name: "Anurag",
        decription: "add",
        question: "abcdec",
        output: "15",
        input: "5,10",
        func_name: "add",
        no_of_args: 2,
        editorial: "print(a+b)",
        maxScore: 40
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .end(function (err, res) {
        challenge = res.body.challenge
        if (err) return done(err);
        done();
      });
      
  })
  test('should post a Accept response of POST /testcase/:challenge', function (done) {
    request(api)
      .post(`/admin/testcase/${challenge.name}`)
      .send({
        result: "15",
        input: "5,10"
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .end(function (err, res) {
        challenge.testCases.push(res.body.testCase._id)
        if (err) return done(err);
        done();
      });
  })
  test('should post a Error response of POST /testcase/:challenge ', function (done) {
    request(api)
      .post('/admin/testcase/aanurag')
      .send({
        result: "15",
        input: "5,10"
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', "text/html; charset=utf-8")
      .expect(404)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  })
})

describe('Contest Creation with Adding Moderator signups and Adding Challenges', () => {
  test('should post a Accept response of POST /contest/new/:token"', function (done) {
    request(api)
      .post(`/contest/new/${user.accessToken}`)
      .send({
        name: "hacker",
        startTime: "30-03-2020",
        endTime: "01-04-2020",
        organizationName: "CCoder",
        organizationType: "startup",
        scoring: 400,
        tagline: "test",
        description: "test contest",
        prizes: "200k",
        rules: "Open for all"
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .end(function (err, res) {
        contest = res.body.contest
        if (err) return done(err);
        done();
      });
  })
  test('should post a Error response of POST /contest/new/:token"', function (done) {
    request(api)
      .post(`/contest/new/${user.accessToken}`)
      .send({
        name: "hacker",
        startTime: "30-03-2020",
        endTime: "01-04-2020",
        organizationName: "CCoder",
        organizationType: "startup",
        scoring: 400,
        tagline: "test",
        description: "test contest",
        prizes: "200k",
        rules: "Open for all"
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', "text/html; charset=utf-8")
      .expect(409)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  })
  test('should post a Accept response of POST /contest/:contest/addchallenge/:challenge/:token"', function (done) {
    request(api)
      .post(`/contest/${contest.name}/addchallenge/${challenge.name}/${user.accessToken}`)
      .send({})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  })
  test('should post a Error response of POST /contest/:contest/addchallenge/:challenge/:token"', function (done) {
    request(api)
      .post(`/contest/${contest.name}/addchallenge/enej/${user.accessToken}`)
      .send({})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  })
  test('should post a  Accept response of POST /contest/:contest/addmoderator/:username/:token"', function (done) {
    request(api)
      .post(`/contest/${contest.name}/addmoderator/${user.username}/${user.accessToken}`)
      .send({})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  })
  test('should post a Error response of POST /contest/:contest/addmoderator/:username/:token"', function (done) {
    request(api)
      .post(`/contest/${contest.name}/addmoderator/${user.username}/${user.accessToken}`)
      .send({})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(409)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  })
  test('should post a Accept response of POST /contest/:contest/signup/:token', function (done) {
    request(api)
      .post(`/contest/${contest.name}/signup/${user.accessToken}`)
      .send({})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  })
  test('should post a Error response of POST /contest/:contest/signup/:token', function (done) {
    request(api)
    .post(`/contest/${contest.name}/signup/${user.accessToken}`)
    .send({})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(409)
      .end(function (err, res) {
        if (err) return done(err);
        done();
      });
  })
})



