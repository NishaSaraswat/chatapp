const { Schema, model } = require('mongoose');
const modelName = 'Subscription';

let schema = new Schema({
  endpoint: String,
  keys: {
    p256dh: String,
    auth: String
  },
  userId: String
});

module.exports = model(modelName, schema);