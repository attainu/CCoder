process.env.NODE_ENV='test'
const request = require('supertest')
const api = require('../app')
const db = require('../db')
db.connect

describe('Challenge Creation', () => {
test('should post a response rejecting of POST /admin/challenge ',function(done){
    request(api)
      .post('/admin/challenge')
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
      .expect('Content-Type', /json/)
      .expect(422)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
})
test('should post a response ACcept  of POST /admin/challenge ',function(done){
    request(api)
      .post('/admin/challenge')
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
        if (err) return done(err);
        done();
      });
})
})