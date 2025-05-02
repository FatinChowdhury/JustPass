// // Example test file: backend/test/grades.test.js
// import request from 'supertest';
// import APP from '../App.js';

// describe('GET /api/grades', () => {
//   it('should return a list of grades', async () => {
//     const token = "<your-test-token>"; // Inject a valid Clerk token for testing
//     const res = await request(APP)
//       .get('/api/grades')
//       .set('Authorization', `Bearer ${token}`);
    
//     expect(res.statusCode).toEqual(200);
//     expect(Array.isArray(res.body)).toBe(true);
//   });
// });