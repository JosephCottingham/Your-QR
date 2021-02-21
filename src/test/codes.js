require('dotenv').config()
const app = require('../server.js')
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = chai.assert

const User = require('../models/user.js')
const Code = require('../models/code.js')
const AccessToken = require('../models/accessToken.js')


chai.config.includeStack = true

const expect = chai.expect
const should = chai.should()
chai.use(chaiHttp)

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
    var code_list=[]

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
            code: 'sjdfksadjdfkajskldfjsdaljfaksjdflkas',
            user: sampleUser._id,
            _id: SAMPLE_OBJECT_ID_2,
        })
        accessToken.save().then(() => {
            ACCESS_TOKEN=accessToken.code;
            done()
        }).catch(err =>{
            console.log(err);
        })
    })

    afterEach((done) => {
        User.deleteMany({ username: ['myuser'] }).then(() => {
            Code.deleteMany({ code: code_list })
            .then(() => {
                done()
            })
        })
    })

    it('should create new code', (done) => {
        chai.request(app)
        .post('/api/v1/codes')
        .set('QR-Token', ACCESS_TOKEN)
        .send({
            uri:"http://www.google.com",
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
            code_list.append(res.body.code)
            done()
        })
    })

    it('should patch code', (done) => {
        chai.request(app)
        .patch(`/api/v1/codes/${test_code}`)
        .set('QR-Token', ACCESS_TOKEN)
        .send({
            light_color:"#fffff0",
        })
        .end((err, res) => {
            if (err) { done(err) }
            expect(res).to.have.status(200)
            expect(res.body.code).to.be.an("string")
            expect(res.body.light_color).to.be.equal("#fffff0")
            done()
        })
    })


    it('should get qr code file', (done) => {
        chai.request(app)
        .get(`/api/v1/codes/${test_code}`).end((err, res) => {
            if (err) { done(err) }
            expect(res).to.have.status(200)
            expect(res)

            done()
        })
    })

    it('should delete qr code file', (done) => {
        chai.request(app)
        .delete(`/api/v1/codes/${test_code}`).end((err, res) => {
            if (err) { done(err) }
            expect(res).to.have.status(200)
            await Model.find({'code':test_code});
            expect(res.files).to.not.be.equal(null)
            done()
        })
    })
})
