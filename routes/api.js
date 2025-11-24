'use strict';
const StockModel = require('../models/Stock');
const fetch = require('node-fetch');

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res) {
      const { stock, like } = req.query;
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      const getStockPrice = async (symbol) => {
        const response = await fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol}/quote`);
        const data = await response.json();
        return data.latestPrice;
      };

      const findAndUpdateStock = async (symbol, like, ip) => {
        let stockDoc = await StockModel.findOne({ symbol: symbol });
        if (!stockDoc) {
          stockDoc = new StockModel({ symbol: symbol });
        }

        if (like === 'true') {
          if (!stockDoc.ips.includes(ip)) {
            stockDoc.likes++;      
            stockDoc.ips.push(ip);  
          }
        }
        await stockDoc.save();
        return stockDoc;
      };

      if (typeof stock === 'string') {
        const symbol = stock.toUpperCase();
        try {
          const price = await getStockPrice(symbol);
          const stockData = await findAndUpdateStock(symbol, like, ip);
          
          res.json({
            stockData: {
              stock: symbol,
              price: price,
              likes: stockData.likes
            }
          });
        } catch (err) {
          res.status(500).json({ error: 'Error fetching stock' });
        }
      } 
      else {
         res.json({ message: "Logic so sanh 2 stocks chua thuc hien o phan nay" });
      }
    });
};