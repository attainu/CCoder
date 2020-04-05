process.env.NODE_ENV='test'
const request = require('supertest')
const api = require('../app')
const db = require('../db')
let user;
let challenge;
let testcase;
let contest;
beforeAll(() => {
  db.connect
});
afterAll(() => {
  db.disconnect()
});

// User Routes Unit Testing
describe('Register user', () => {
  test('should post a Error response of POST /user/register ',function(done){
    request(api)
      .post('/user/register')
      .send({
          name:"anurag gothi",
          username:"anurag gothi",
          email:"anuraggothi4@gmail.com",
          password:"Anurag@123"
    })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  })
  test('should post a Accept response of POST /user/register ',function(done){
    request(api)
      .post('/user/register')
      .send({
          name:"anurag gothi",
          username:"anuraggothi",
          email:"anuraggothi4@gmail.com",
          password:"Anurag@123"
    })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .end(function(err, res) {
        user = res.body.createUser
        console.log(user.accessToken)
        if (err) return done(err);
        done();
      });
  })
  test('should post a Accept response of POST /user/login ',function(done){
    request(api)
      .post('/user/login')
      .send({

          email:user.email,
          password:user.password
    })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        user = res.body.loginUser
        if (err) return done(err);
        done();
      });
  })
  })

// Admin Challenge Routes  Unit Testing
// describe('Challenge Creation with testcases', () => {
// test('should post a response rejecting of POST /admin/challenge ',function(done){
//     request(api)
//       .post('/admin/challenge/')
//       .send({
//         decription:"add",
//         question:"abcdec",
//         output:"15",
//         input:"5,10",
//         func_name:"add",
//         no_of_args:2,
//         editorial:"print(a+b)",
//         maxScore:40
//     })
//       .set('Accept', 'application/json')
//       .expect('Content-Type', "text/html; charset=utf-8")
//       .expect(422)
//       .end(function(err, res) {
//         if (err) return done(err);
//         done();
//       });
// })
// test('should post a Accept response of POST /admin/challenge ',function(done){
//     request(api)
//       .post('/admin/challenge')
//       .send({
//         name:"Anurag",
//         decription:"add",
//         question:"abcdec",
//         output:"15",
//         input:"5,10",
//         func_name:"add",
//         no_of_args:2,
//         editorial:"print(a+b)",
//         maxScore:40
//     })
//       .set('Accept', 'application/json')
//       .expect('Content-Type', /json/)
//       .expect(201)
//       .end(function(err, res) {
//         console.log(user)
//         challenge = res.body.challenge
//         if (err) return done(err);
//         done();
//       });
// })
// test('should post a Accept response of POST /testcase/:challenge',function(done){
//   request(api)
//     .post(`/admin/testcase/${challenge.name}`)
//     .send({
//       result:"15",
//       input:"5,10"
//   })
//     .set('Accept', 'application/json')
//     .expect('Content-Type', /json/)
//     .expect(201)
//     .end(function(err, res) {
//       if (err) return done(err);
//       done();
//     });
// })
// test('should post a Error response of POST /testcase/:challenge ',function(done){
//   request(api)
//     .post('/admin/testcase/aanurag')
//     .send({
//       result:"15",
//       input:"5,10"
//   })
//     .set('Accept', 'application/json')
//     .expect('Content-Type', "text/html; charset=utf-8")
//     .expect(404)
//     .end(function(err, res) {
//       if (err) return done(err);
//       done();
//     });
// })
// })

// User Challenge Routes Unit Testing
describe('Challenge Creation with testcases', () => {
  test('should post a response rejecting of POST /user/challenge/:token',function(done){
      request(api)
        .post(`/user/challenge/${user.accessToken}`)
        .send({
          decription:"add",
          question:"abcdec",
          output:"15",
          input:"5,10",
          func_name:"add",
          no_of_args:2,
          editorial:"print(a+b)",
          maxScore:40
      })
        .set('Accept', 'application/json')
        .expect('Content-Type', "text/html; charset=utf-8")
        .expect(422)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
  })
  test('should post a Accept response of POST /user/challenge/:token ',function(done){
      request(api)
        .post(`/user/challenge/${user.accessToken}`)
        .send({
          name:"Anurag",
          decription:"add",
          question:"abcdec",
          output:"15",
          input:"5,10",
          func_name:"add",
          no_of_args:2,
          editorial:"print(a+b)",
          maxScore:40
      })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function(err, res) {
          challenge = res.body.challenge
          console.log(challenge)
          if (err) return done(err);
          done();
        });
  })
  // test('should post a Accept response of POST /testcase/:challenge/:token',function(done){
  //   request(api)
  //     .post(`/testcase/${challenge.name}/${user.accessToken}`)
  //     .send({
  //       result:"15",
  //       input:"5,10"
  //   })
  //     .set('Accept', 'application/json')
  //     .expect('Content-Type', /json/)
  //     .expect(201)
  //     .end(function(err, res) {
  //       if (err) return done(err);
  //       done();
  //     });
  // })
  // test('should post a Error response of POST /testcase/:challenge/:token ',function(done){
  //   request(api)
  //     .post(`/testcase/${challenge.name}/${user.accessToken}`)
  //     .send({
  //       result:"15",
  //       input:"5,10"
  //   })
  //     .set('Accept', 'application/json')
  //     .expect('Content-Type', "text/html; charset=utf-8")
  //     .expect(404)
  //     .end(function(err, res) {
  //       if (err) return done(err);
  //       done();
  //     });
  // })
  })

