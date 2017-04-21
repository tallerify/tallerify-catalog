process.env.NODE_ENV = 'test';

const app = require('../../app');
const db = require('../../models');
const request = require('supertest');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);

const constants = require('./artist.constants.json');

describe('Artist', () => {
	describe('/GET artists', () => {
		it('should return status code 200', done => {
      request(app)
        .get('/api/artists')
        .end((err, res) => {
          res.should.have.status(200);
          done();
    		});
  	});

    it('should return the expected body response when correct parameters are sent', done => {
      request(app)
        .get('/api/artists')
        .end((err, res) => {
          res.body.should.be.a('object');
          res.body.should.have.property('metadata');
          res.body.metadata.should.have.property('version');
          res.body.metadata.should.have.property('count');
          res.body.should.have.property('artists');
          res.body.artists.should.be.a('array');
          done();
        });
    });
  });

  describe('/POST artists', () => {
    it('should return status code 400 when parameters are missing', done => {
      request(app)
        .post('/api/artists')
        .send(constants.newArtistWithMissingAttributes)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });

    it('should return status code 400 when parameters are invalid', done => {
      request(app)
        .post('/api/artists')
        .send(constants.invalidArtist)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });
});