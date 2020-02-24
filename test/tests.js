// Test patterns for POST, GET
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../app')
const should = chai.should
const expect = require('chai').expect
const fs = require('fs')
const path = require('path')
chai.use(chaiHttp)

describe('Test Suite', () => {
  const testIds = []
  // clear out store dir and empty forwar/reverse lookups before tests
  before((done) => {
    console.log('Clear directory and lookups before tests: ')
    let files = fs.readdirSync('./store')
    console.log('files: ' + files)
    files.forEach(function (file) {
      console.log('Delete file: ' + file)
      const filePath = path.join('./store', file)
      fs.unlink(path.join('./store', file), err => {
        if (err) throw err
      })
    })

    // Clear lookups
    const empty = {}
    try {
      // fs.writeFileSync('./meta_data/id-name-map.json', JSON.stringify(empty, null, 2))
      try {
     // fs.writeFileSync('./meta_data/name-id-map.json', JSON.stringify(empty, null, 2))
      } catch (err) {
        throw err
      }
    } catch (err) {
      throw err
    }
    done()
  })

  it('`POST` `some_file.txt` to `/store`: returns a JSON payload with file metadata containing name, size (in bytes), request timestamp and an auto-generated ID', (done) => {
    // POST each file in the resources folder
    const resources = fs.readdirSync('./resources')
    resources.forEach(function (resource) {
      console.log('POST test file: ' + resource)
      const testFilePath = path.join('./resources', resource)
      let testFile = fs.readFileSync(testFilePath)
      chai.request(server)
        .post(`/store`)
        .attach('File', testFilePath, testFile)
        .end((err, res) => {
          console.log('POST Test res: ' + JSON.stringify(res.body))
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('id')
          expect(res.body).to.have.property('name')
          expect(res.body).to.have.property('size')
          expect(res.body).to.have.property('timestamp')
          testIds.push(res.body.id) // save the id
          console.log('Push ID: ' + res.body.id)
          if (testIds.length == resources.length) {
            done() // progress to the next test when all reqs have finished
          }
        })
    })
  })

  it('`GET` `/files`: returns a JSON payload containing an array of files metadata containing file name, size (in bytes), timestamp and ID', (done) => {
    chai.request(server)
      .get('/files')
      .end((err, res) => {
        // console.log("Test res: " + JSON.stringify(res.status));
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array')
        if (res.body.length > 0) { // an empty array is a valid response
          expect(res.body[0]).to.have.property('id')
          expect(res.body[0]).to.have.property('name')
          expect(res.body[0]).to.have.property('size')
          expect(res.body[0]).to.have.property('timestamp')
        }
        done()
      })
  })

  it('`GET` `/files/{id}`: returns a JSON payload with file metadata containing name, size (in bytes), timestamp and ID for the provided ID `id`', (done) => {
    testIds.forEach((testId) => {
      console.log('GET Test ID: ' + testId)
      chai.request(server)
        .get(`/files/${testId}`)
        .end((err, res) => {
          console.log('GET Test res: ' + JSON.stringify(res.status))
          expect(res).to.have.status(200)
          expect(res.body).to.have.property('id')
          expect(res.body).to.have.property('name')
          expect(res.body).to.have.property('size')
          expect(res.body).to.have.property('timestamp')

          if (testIds.indexOf(testId) == (testIds.length - 1)) {
            done()
          }
        })
    })
  })

  it('`GET` `/mrufiles`: returns a JSON payload with an array of files metadata containing file name, size (in bytes), timestamp and ID for the top `N` most recently accessed files via the `/files/{id}` and `/files/{id}/blob` endpoints. `N` should be a configurable parameter for this application.', (done) => {
    chai.request(server)
      .get('/mrufiles')
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array')
        if (res.body.length > 0) { // an empty array is a valid response
          expect(res.body[0]).to.have.property('id')
          expect(res.body[0]).to.have.property('name')
          expect(res.body[0]).to.have.property('size')
          expect(res.body[0]).to.have.property('timestamp')
          console.log('mrufiles: ' + JSON.stringify(res.body))
        };
        done()
      })
  })
})
