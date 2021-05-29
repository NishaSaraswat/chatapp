const { Schema, model } = require('mongoose');
const modelName = 'Message';

let schema = new Schema({
  text: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: String, required: true },
  sent: { type: Date, default: Date.now }
});

module.exports = model(modelName, schema);