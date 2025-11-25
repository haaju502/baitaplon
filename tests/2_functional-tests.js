const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  // --- TESTCASE 2: GET 1 STOCK (Phần bạn làm) ---
  test('Viewing one stock: GET request to /api/stock-prices/', function(done) {
    chai.request(server)
      .get('/api/stock-prices')
      .query({ stock: 'GOOG' }) // Test với mã Google
      .end(function(err, res) {
        assert.equal(res.status, 200);
        // Kiểm tra cấu trúc JSON trả về (Testcase 3)
        assert.property(res.body, 'stockData');
        assert.property(res.body.stockData, 'stock');
        assert.property(res.body.stockData, 'price');
        assert.property(res.body.stockData, 'likes');
        assert.equal(res.body.stockData.stock, 'GOOG');
        done();
      });
  });

  // --- TESTCASE 4 (Phần A): LIKE 1 STOCK ---
  test('Viewing one stock and liking it: GET request to /api/stock-prices/', function(done) {
    chai.request(server)
      .get('/api/stock-prices')
      .query({ stock: 'GOOG', like: 'true' })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.stockData.stock, 'GOOG');
        assert.isNumber(res.body.stockData.likes);
        // Đảm bảo likes ít nhất là 1
        assert.isAtLeast(res.body.stockData.likes, 1);
        done();
      });
  });

  // --- TESTCASE 4 (Phần B): CHECK SPAM LIKE (Cùng IP like lần 2) ---
  test('Viewing the same stock and liking it again: GET request to /api/stock-prices/', function(done) {
    // Bước 1: Lấy số like hiện tại
    chai.request(server)
      .get('/api/stock-prices')
      .query({ stock: 'GOOG', like: 'true' }) 
      .end(function(err, res) {
        const likesBefore = res.body.stockData.likes;
        
        // Bước 2: Cố tình like thêm lần nữa
        chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: 'GOOG', like: 'true' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          // Kiểm tra số like phải giữ nguyên (BẰNG số like bước 1)
          assert.equal(res.body.stockData.likes, likesBefore, 'Số like không được tăng khi spam');
          done();
        });
      });
  });

});
