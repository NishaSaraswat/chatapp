import { setupEventSource } from './setup-event-source';

// React when SSE says db messages have change
// g = global context
export function updateHandler(g) {
  // Once when the page loads
  getMessages(g);
  // An then everytime SSE says something has happened
  setupEventSource(e => {
    // e.data contain information of what happened in the db
    // but for now we ignore that and just get all messages
    // we don't have already...
    getMessages(g)
  });
}

// Get new messages from db via Mongoosy
async function getMessages(g) {
  g.messages = g.messages || [];
  if (g.messages.length === 0) {
    // we have no messags - so get them all
    g.messages = (await Message.find().populate('author')).js;
  }
  else {
    // get time of last message we have
    let timeOfLastWeHave = g.messages.slice(-1)[0].sent;
    // get never ones
    let newOnes = (await Message.find(
      { sent: { $gt: new Date(timeOfLastWeHave) } }
    ).populate('author')).js;
    g.messages = [...g.messages, ...newOnes];
  }

  // handle rooms

  // set the users room to general if missing
  g.myRoom = g.myRoom || 'general';

  // create a list of all rooms
  g.rooms = [...new Set(g.messages.map(x => x.room))];
}