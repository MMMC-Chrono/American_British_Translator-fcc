const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

let Translator = require('../components/translator.js');
let api = '/api/translate'

suite('Functional Tests', () => {
  suite('Translation with', () => {
    test('text and locale fields', (done) => {
      chai
      .request(server)
      .post(api)
      .send({
        text: 'Mangoes are my favorite fruit.', 
        locale: 'american-to-british'
      })
      .end(function(err, res) {
        if (err) console.log(err)
        let { body } = res
        console.log(body)
        assert.equal(res.status, 200)
        assert.deepEqual(body, {text: 'Mangoes are my favorite fruit.', translation: 'Mangoes are my <span class="highlight">favourite</span> fruit.'})
        done()
      })
    })

    test('text and invalid locale fields', (done) => {
      chai
      .request(server)
      .post(api)
      .send({
        text: 'Mangoes are my favorite fruit.', 
        locale: 'french-to-british'
      })
      .end(function(err, res) {
        if (err) console.log(err)
        let { body } = res
        console.log(body)
        assert.equal(res.status, 200)
        assert.deepEqual(body, { error: 'Invalid value for locale field' })
        done()
      })
    })

    test('missing text field', (done) => {
      chai
      .request(server)
      .post(api)
      .send({
        locale: 'american-to-british'
      })
      .end(function(err, res) {
        if (err) console.log(err)
        let { body } = res
        console.log(body)
        assert.equal(res.status, 200)
        assert.deepEqual(body, { error: 'Required field(s) missing' })
        done()
      })
    })

    test('missing locale fields', (done) => {
      chai
      .request(server)
      .post(api)
      .send({
        text: 'Mangoes are my favorite fruit.'
      })
      .end(function(err, res) {
        if (err) console.log(err)
        let { body } = res
        console.log(body)
        assert.equal(res.status, 200)
        assert.deepEqual(body, { error: 'Required field(s) missing' })
        done()
      })
    })

    test('missing text field', (done) => {
      chai
      .request(server)
      .post(api)
      .send({
        text: '',
        locale: 'american-to-british'
      })
      .end(function(err, res) {
        if (err) console.log(err)
        let { body } = res
        console.log(body)
        assert.equal(res.status, 200)
        assert.deepEqual(body, { error: 'No text to translate' })
        done()
      })
    })

    test('text that needs no translation', (done) => {
      chai
      .request(server)
      .post(api)
      .send({
        text: 'Mangoes are my favorite fruit.',
        locale: 'british-to-american'
      })
      .end(function(err, res) {
        if (err) console.log(err)
        let { body } = res
        console.log(body)
        assert.equal(res.status, 200)
        assert.deepEqual(body, {
        text: 'Mangoes are my favorite fruit.',
        translation: 'Everything looks good to me!'
      })
        done()
      })
    })
    
  })

});
