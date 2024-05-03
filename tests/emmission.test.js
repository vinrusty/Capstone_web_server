const request = require('supertest');
const app = require('../index'); // Import your Express app
const User = require("../models/Users")

const deleteTestUserIfExists = async () => {
  const testUser = await User.findOne({ email: 'test@example.com' });
  if (testUser) {
    await User.deleteOne({ email: 'test@example.com' });
  }
};

let server;

// Before all tests, start the server
beforeAll((done) => {
  server = app.listen(3001, () => {
    console.log('Server started on port 3001');
    done();
  });
});

// After all tests, close the server
afterAll((done) => {
  server.close((err) => {
    if (err) {
      console.error('Error closing server:', err);
      done(err);
    } else {
      console.log('Server closed');
      done();
    }
  });
});

beforeAll(async () => {
  // Delete test user if exists before running test suite
  await deleteTestUserIfExists();
});


describe('User API Endpoints', () => {
  describe('POST /register', () => {
    beforeAll(async () => {
      // Delete test user if exists before each test case
      await deleteTestUserIfExists();
    });
    it('should register a new user', async () => {
      const newUser = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        age: 25,
        locality: 'Test Locality',
        role: false
      };
      const res = await request(app)
        .post('/auth/register')
        .send(newUser);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'success');
    });

    it('should return an error if user already exists', async () => {
      // Provide an existing user data
      const existingUser = { 
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        age: 25,
        locality: 'Test Locality',
        role: false
       };
      const res = await request(app)
        .post('/auth/register')
        .send(existingUser);
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'error');
    });
  });

  describe('POST /login', () => {
    it('should login a user with correct credentials', async () => {
      const userCredentials = {
        email: 'test@example.com',
        password: 'password123'
      };
      const res = await request(app)
        .post('/auth/login')
        .send(userCredentials);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'success');
      expect(res.body.result).toHaveProperty('aToken');
    });

    it('should return an error if credentials are incorrect', async () => {
      const invalidCredentials = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };
      const res = await request(app)
        .post('/auth/login')
        .send(invalidCredentials);
      expect(res.statusCode).toEqual(403);
      expect(res.body).toHaveProperty('message', 'error');
    });
  });

  describe('GET /count', () => {
    it('should return the count of users based on provided filter', async () => {
      const filter = { /* Provide filter criteria */ };
      const res = await request(app)
        .get('/auth/count')
        .send(filter);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'success');
      expect(res.body).toHaveProperty('result');
    });
  });
});

describe('Emmision API Endpoints', () => {
  describe('POST /create-emission-record', () => {
    it('should create a new emission record', async () => {
      const newRecord = { 
        id: "1",
        email: "user@example.com",
        location: "Basavanagudi",
        product: "Air Conditioner",
        usage: 100,
        prediction: 120,
        morning: 30,
        afternoon: 40,
        evening: 30,
        night: 20,
        recommendation: { 
            Morning: [
              0,
              37
            ],
            Afternoon: [
              1,
              10
            ],
            Evening: [
              1,
              32
            ],
            Night: [
              2,
              5
            ]
         },
        fuelType: "electric",
        date: "2024-04-05" 
       };
      const res = await request(app)
        .post('/record/create-emission-record')
        .send(newRecord);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'success');
      expect(res.body).toHaveProperty('record');
    });

    it('should return an error if data is invalid', async () => {
      const invalidRecord = { /* Provide invalid emission record data */ };
      const res = await request(app)
        .post('/record/create-emission-record')
        .send(invalidRecord);
      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('message', 'error');
    });
  });

  describe('GET /get-all-records', () => {
    it('should fetch all emission records', async () => {
      const res = await request(app)
        .get('/record/get-all-records');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'success');
      expect(res.body).toHaveProperty('result');
    });
  });

  describe('POST /get-dynamic-records', () => {
    it('should fetch emission records based on dynamic criteria', async () => {
      const criteria = { /* Provide dynamic criteria */ };
      const res = await request(app)
        .post('/record/get-dynamic-records')
        .send(criteria);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'success');
      expect(res.body).toHaveProperty('result');
    });
  });

  describe('POST /get-all-user-records', () => {
    it('should fetch all emission records for a specific user', async () => {
      const userData = { email: 'user@example.com' };
      const res = await request(app)
        .post('/record/get-all-user-records')
        .send(userData);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'success');
      expect(res.body).toHaveProperty('result');
    });
  });

  describe('POST /get-user-stats', () => {
    it('should fetch emission statistics for a specific user', async () => {
      const userData = { email: 'user@example.com' };
      const res = await request(app)
        .post('/record/get-user-stats')
        .send(userData);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'success');
      expect(res.body).toHaveProperty('result');
    });
  });

  describe('POST /get-records-year', () => {
    it('should fetch emission records for a specific year', async () => {
      const yearData = { year: 2024 };
      const res = await request(app)
        .post('/record/get-records-year')
        .send(yearData);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(12); // Assuming 12 months
    });

    it('should return an error if fetching records for the year fails', async () => {
      // Mock the failure scenario if necessary
      const res = await request(app)
        .post('/record/get-records-year')
        .send({});
      expect(res.statusCode).toEqual(400);
    });
  });

  describe('POST /get-records-month', () => {
    it('should fetch emission records for a specific month', async () => {
      const monthData = { year: 2024, month: 4 }; // January 2023
      const res = await request(app)
        .post('/record/get-records-month')
        .send(monthData);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(30); // Assuming 31 days
    });

    it('should return an error if fetching records for the month fails', async () => {
      // Mock the failure scenario if necessary
      const res = await request(app)
        .post('/record/get-records-month')
        .send({});
      expect(res.statusCode).toEqual(400);
    });
  });

  describe('POST /get-records-product', () => {
    it('should fetch emission statistics based on product filter', async () => {
      const productData = { product: 'Air Conditioner' }; // Assuming 'AC' is a product
      const res = await request(app)
        .post('/record/get-records-product')
        .send(productData);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('products');
    });
  });
});
