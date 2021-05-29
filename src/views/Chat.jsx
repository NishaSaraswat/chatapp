export default function Chat() {

  // Note:
  // The script utilities/updateHandler.js 
  // fetches all messages and rooms

  const g = useNamedContext('global');

  useEffect(() => {
    // Scroll to bottom of page after each update
    window.scrollTo(0, 1000000);
  });

  const s = useStates({
    message: '',
    newRoom: ''
  });

  async function send(e) {
    e.preventDefault();
    let newMessage = new Message({
      author: g.user._id,
      text: s.message,
      room: g.myRoom
    });
    await newMessage.save();
    s.message = '';
  }

  function addRoom(e) {
    e.preventDefault();
    g.rooms.push(s.newRoom);
    g.myRoom = s.newRoom;
    s.newRoom = '';
  }

  function switchRoom(e) {
    g.myRoom = e.target.innerHTML;
  }

  function formatDate(sent) {
    // format date to local time
    let d = new Date(sent);
    return d.toLocaleString();
  }

  return <SFC

    template=
    {<div className="chat">

      <div className="rooms">
        <div className="roomList">
          <h4>Rooms</h4>
          {(g.rooms || []).map(room =>
            <div
              onClick={switchRoom}
              className={'room' + (room === g.myRoom ? ' active' : '')}
              key={room}>
              {room}
            </div>
          )}
        </div>
        <form className="addRoomForm" autoComplete="off" onSubmit={addRoom}>
          <div className="input-group">
            <input type="text" className="form-control shadow-none" placeholder="New room" {...s.bind('newRoom')} />
            <div className="input-group-append">
              <button className="btn btn-primary" type="button submit">Create</button>
            </div>
          </div>
        </form>
      </div>

      <div className="messages">
        {g.messages.filter(message => message.room === g.myRoom).map(message =>
          <div
            className={'message' + (message.author._id === g.user._id ? ' my' : '')}
          >
            <p>
              {message.author.name}<br />
              <span>{formatDate(message.sent)}</span>
            </p>
            <p>{message.text}</p>
          </div>
        )}
      </div>

      <Row className="writeMessage">
        <form className="messageForm" autoComplete="off" onSubmit={send}>
          <div className="input-group m-3">
            <input type="text" className="form-control shadow-none" placeholder="Write message" {...s.bind('message')} />
            <div className="input-group-append">
              <button className="btn btn-primary" type="button submit">Send</button>
            </div>
          </div>
        </form>
      </Row>
    </div>}

    style=
    {/*css*/`

      .writeMessage {
        position: fixed;
        left: 15px;
        width: 100vw;
        bottom: 0;
        background-color: #ddd;
      }
      
      .messageForm {
        width: calc(100% - 30px);
      }

      .addRoomForm {
        display: block;
        position: absolute;
        bottom: 10px;
        left: 10px;
        width: calc(100% - 22px);
      }

      .rooms {
        position: fixed;
        left: 15px;
        border: 20px;
        width: 25vw;
        top: 80px;
        bottom: 90px;
        background-color: #ddd;
        border-radius: 10px;
        padding: 10px;
      }

      .rooms h4 {
        padding-left: 10px;
      }

      .roomList {
        position: absolute;
        width: calc(100% - 20px);
        overflow: scroll;
        top: 10px;
        bottom: 50px;
      }

      .room {
        padding: 5px 10px;
        cursor: pointer;
      }

      .room.active {
        font-weight: bold;
      }

      .messages {
        margin-left: 25vw;
      }

      .message {
        position: relative;
        padding: 5px 10px;
        border-radius: 10px;
        background-color: #ddd;
        padding: 20px;
        width: 50%;
        margin-bottom: 20px;
        clear: both;
      }

      .my.message {
        float: right;
        background-color: #007bff;
        color: #fff;
      }

      .my.message p:first-child {
        text-align: right;
      }

      .message:last-child {
        margin-bottom: 0;
      }

      .message p {
        margin: 0;
      }

      .message p:first-child {
        font-weight: bold;
        font-size: 80%;
          margin-bottom: 10px
      }
    
    `}
  />;
}