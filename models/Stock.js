const mongoose = require('mongoose');
const { Schema } = mongoose;

const StockSchema = new Schema({
  symbol: { type: String, required: true },
  likes: { type: Number, default: 0 },
  ips: { type: [String], default: [] } 
});

module.exports = mongoose.model('Stock', StockSchema);