// Require and setup mongoosy
const { app } = require('mongoosy')({
  expressJson: {
    limit: '100mb'
  },
  connect: {
    url: require('./settings/dontCommit.json').atlasUrl
  },
  // Please change the salt before creating any users
  login: {
    encryptionSalt: 'unique and hard to guess'
  }
});

const Subscription = require('./models/Subscription');

// endpoint to save notification subscription
app.post('/api/subscribe', (req, res) => {
  if(!req.session.user) {
    // status 403 == forbidden
    return res.status(403).json({
      error: 'Must be logged in to subscribe'
    });
  }

  let sub = new Subscription(req.body);
  // get logged in user id
  // and add with subscription
  sub.userId = req.session.user._id

  sub.save()

  res.json({
    success: "Subscribes for notifications"
  })
});

// Add logic to handle SSE (Server Sent Events)
require('./SSE-handler')(app);

// Start the Express web server
app.listen(4100, () =>
  console.log('Backend running!'));