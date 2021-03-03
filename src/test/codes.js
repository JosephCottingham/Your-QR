require('dotenv').config()
const server = require("../server");
const mongoose = require('mongoose')
const cors = require('cors');
const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = chai.assert

const User = require('../models/user.js')
const Code = require('../models/code.js')
const AccessToken = require('../models/accessToken.js');
const accessToken = require('../models/accessToken.js');


chai.config.includeStack = true

const expect = chai.expect
const should = chai.should()
chai.use(chaiHttp)
const agent = chai.request.agent(server);

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {}
  mongoose.modelSchemas = {}
  mongoose.connection.close()
  done()
})

const SAMPLE_OBJECT_ID = 'aaaaaaaaaaaa' // 12 byte string
const SAMPLE_OBJECT_ID_2 = 'aaa3aaaaaaaa' // 12 byte string

var ACCESS_TOKEN = null


describe('Code API endpoints', () => {
    var test_code=null
    var token_list=[]

    beforeEach((done) => {
        const sampleUser = new User({
            username: 'myuser',
            password: 'mypassword',
            _id: SAMPLE_OBJECT_ID
        })
        sampleUser.save().catch(err =>{
            console.log(err);
        })
        const accessToken = new AccessToken({
            token: 'sjdfksadjdfkajskldfjsdaljfaksjdflkas',
            user: sampleUser._id,
            _id: SAMPLE_OBJECT_ID_2,
        })
        accessToken.save().then(() => {
            ACCESS_TOKEN=accessToken.token;
            done()
        }).catch(err =>{
            console.log(err);
            done(err)
        })
    })


    afterEach((done) => {
        User.deleteMany({ username: ['myuser'] }).then(() => {
            Code.deleteMany({ token: token_list })
            .then(() => {
                AccessToken.deleteMany({_id:SAMPLE_OBJECT_ID_2}).then(() => {
                    done()
                })
            })
        })
    })

    it('should create new code', (done) => {
        agent
        .post('/api/v1/codes')
        .set('qr-token', ACCESS_TOKEN)
        .send({
            data:"http://www.google.com",
            error_correction_level:"M",
            image_width:1000,
            light_color:"#ffffff",
            dark_color:"#000000",
            multimedia_type:"png",
        })
        .end((err, res) => {
            if (err) { done(err) }
            expect(res).to.have.status(200)
            expect(res.body.code).to.be.an("string")
            test_code=res.body.code
            token_list.push(res.body.code)
            done()
        })
    })

    it('should patch code', (done) => {
        agent
        .patch(`/api/v1/codes/${test_code}`)
        .set('QR-Token', ACCESS_TOKEN)
        .send({
            light_color:"#fffff0",
        })
        .end((err, res) => {
            expect(res).to.have.status(200)
            expect(res.body.code).to.be.an("string")
            expect(res.body.light_color).to.be.equal("#fffff0")
            done()
        })
    })


    it('should get qr code file', (done) => {
        agent
        .get(`/api/v1/codes/${test_code}`).end((err, res) => {
            if (err) { done(err) }
            expect(res).to.have.status(200)
            expect(res.files).to.not.be.equal(null)
            done()
        })
    })

    it('should delete qr code file', (done) => {
        agent
        .delete(`/api/v1/codes/${test_code}`).end((err, res) => {
            if (err) { done(err) }
            expect(res).to.have.status(200)
            code = Code.findOne({'code':test_code}).then(code => {
                expect(code).to.be.equal(null)
                done()
            }).catch(err => {
                console.log(err);
            })
        })
    })
})
