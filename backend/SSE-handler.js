let Message = require('./models/Message');
let Subscription = require('./models/Subscription');
const sendNotification = require('./notifications');

module.exports = app => {

  // a list of open connections
  let connections = [];

  app.get('/api/sse', (req, res) => {
    // don't connect users that are not logged in
    if (!req.session.user) {
      res.json({ error: 'Not logged in!' });
      return;
    }
    // create a connection object -> request + response
    // and up unitl which time stamp the connection/user has
    // gotten messages and photos
    let connection = { req, res, hasMessagesUntil: 0, hasPhotosUntil: 0 };
    // add the connection to the connections list
    connections.push(connection);
    // remove the connection from the list when the request closes
    req.on('close', () => connections = connections.filter(x => x !== connection));
    // send headers telling the browser this is SSE and no cache
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache'
    });
  });

  // Send a message via SSE
  function sendSSE(res, eventType, data) {
    // TODO: send message to target ids
    // if(eventType === 'chatMessageUpdate') {
    //   sendNotification(null, data)
    // }

    // send
    res.write(
      `event: ${eventType}\n` +
      'data: ' + JSON.stringify(data) + '\n\n'
    );
  }

  // Send an event when a something happens in the message db
  Message.watch().on('change', e => {
    console.log("OK", e);
    console.log("connectons", connections.length);
    connections.forEach(({ res }) =>
      sendSSE(res, 'chatMessageUpdate', e))
  });

  // Heartbeat (send 'empty' events with 20 second delays)
  // helps keep the connection alive
  setInterval(
    () => connections.forEach(({ res }) =>
      sendSSE(res, 'heartbeat', new Date())),
    20000
  );
};