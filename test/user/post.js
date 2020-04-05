process.env.NODE_ENV = 'test'
const expect = require('chai').expect;
const request = require('supertest')

const user = require("../../routes/apiRoutes")
const conn = require("../../db")

describe('POST /admin/challenge', () => {
    before((done) => {
        conn.connect()
            .then(() => done())
            .catch((err) => (err));
    })
    after((done) => {
        conn.close()
            .then(() => done())
            .catch((err) => done(err))
    })
})

it('OK, creating a Admin challenge', (done) => {
    request(user).post('/admin/challenge')
        .send({
            name:"anurag",
            decription: "add",
            question: "abcdec",
            output: "15",
            input: "5,10",
            func_name: "add",
            no_of_args: 2,
            editorial: "print(a+b)",
            maxScore: 40
        })
        .expect(201)
        done()
        // .end(function(err,res){
        //     if(err) return err
        //     else done()
        // })
        // done()
        // .end(function(err, res){
        //     if (err) done(err);
        //     done();
        //   });
})