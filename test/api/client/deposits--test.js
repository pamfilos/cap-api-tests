'use strict';
var chai = require('chai');
var ZSchema = require('z-schema');
var customFormats = module.exports = function(zSchema) {
  // Placeholder file for all custom-formats in known to swagger.json
  // as found on
  // https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#dataTypeFormat

  var decimalPattern = /^\d{0,8}.?\d{0,4}[0]+$/;

  /** Validates floating point as decimal / money (i.e: 12345678.123400..) */
  zSchema.registerFormat('double', function(val) {
    return !decimalPattern.test(val.toString());
  });

  /** Validates value is a 32bit integer */
  zSchema.registerFormat('int32', function(val) {
    // the 32bit shift (>>) truncates any bits beyond max of 32
    return Number.isInteger(val) && ((val >> 0) === val);
  });

  zSchema.registerFormat('int64', function(val) {
    return Number.isInteger(val);
  });

  zSchema.registerFormat('float', function(val) {
    // should parse
    return Number.isInteger(val);
  });

  zSchema.registerFormat('date', function(val) {
    // should parse a a date
    return !isNaN(Date.parse(val));
  });

  zSchema.registerFormat('dateTime', function(val) {
    return !isNaN(Date.parse(val));
  });

  zSchema.registerFormat('password', function(val) {
    // should parse as a string
    return typeof val === 'string';
  });
};

customFormats(ZSchema);

var validator = new ZSchema({});
var supertest = require('supertest');
var api = supertest('http://pammbp.cern.ch:5000'); // supertest init;
var expect = chai.expect;

require('dotenv').load();

describe('/deposits/', function() {
  describe('get', function() {
    it('should respond with 200 Success', function(done) {
      /*eslint-disable*/
      var schema = {
        "properties": {
          "aggregations": {
            "type": "object"
          },
          "hits": {
            "type": "object",
            "properties": {
              "hits": {
                "type": "array",
                "items": {
                  "properties": {}
                }
              }
            }
          },
          "total": {
            "type": "number"
          },
          "links": {
            "type": "object"
          }
        }
      };

      /*eslint-enable*/
      api.get('/api/deposits/')
      .query({
        access_token: process.env.ACCESS_TOKEN
      })
      .set('Content-Type', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);

        expect(validator.validate(res.body, schema)).to.be.true;
        done();
      });
    });

    it('should respond with 401 Not Authorized', function(done) {
      /*eslint-disable*/
      var schema = {
        "required": [
          "message"
        ],
        "properties": {
          "status": {
            "type": "string"
          },
          "message": {
            "type": "string"
          }
        }
      };

      /*eslint-enable*/
      api.get('/api/deposits/')
      .query({
        access_token: process.env.ACCESS_TOKEN
      })
      .set('Content-Type', 'application/json')
      .expect(401)
      .end(function(err, res) {
        if (err) return done(err);

        expect(validator.validate(res.body, schema)).to.be.true;
        done();
      });
    });

    it('should respond with 403 Permission Required', function(done) {
      /*eslint-disable*/
      var schema = {
        "required": [
          "message"
        ],
        "properties": {
          "status": {
            "type": "string"
          },
          "message": {
            "type": "string"
          }
        }
      };

      /*eslint-enable*/
      api.get('/api/deposits/')
      .query({
        access_token: process.env.ACCESS_TOKEN
      })
      .set('Content-Type', 'application/json')
      .expect(403)
      .end(function(err, res) {
        if (err) return done(err);

        expect(validator.validate(res.body, schema)).to.be.true;
        done();
      });
    });

    it('should respond with 404 Not Found', function(done) {
      /*eslint-disable*/
      var schema = {
        "required": [
          "message"
        ],
        "properties": {
          "status": {
            "type": "string"
          },
          "message": {
            "type": "string"
          }
        }
      };

      /*eslint-enable*/
      api.get('/api/deposits/')
      .query({
        access_token: process.env.ACCESS_TOKEN
      })
      .set('Content-Type', 'application/json')
      .expect(404)
      .end(function(err, res) {
        if (err) return done(err);

        expect(validator.validate(res.body, schema)).to.be.true;
        done();
      });
    });

  });

});
