// Code to connet to SSE event source
// and reconnect if something goes wrong
// modified from this article:
// https://stackoverflow.com/questions/24564030/is-an-eventsource-sse-supposed-to-try-to-reconnect-indefinitely

let reconnectFrequencySeconds = 1;
let evtSource;
let listener;

const reconnectFunc = function () {
  setTimeout(tryToSetupFunc, reconnectFrequencySeconds * 1000)
};

const tryToSetupFunc = () => {
  setupEventSource();
  reconnectFrequencySeconds *= 2;
  if (reconnectFrequencySeconds >= 64) {
    reconnectFrequencySeconds = 64;
  }
};

export function setupEventSource(listenFunc) {
  if (!navigator.onLine) {
    setTimeout(() => setupEventSource, 1000);
    return;
  }
  listener = listenFunc || listener;
  evtSource = new EventSource('/api/sse');
  evtSource.addEventListener("chatMessageUpdate", e => {
    listener(e);
  })
  evtSource.onopen = function (e) {
    reconnectFrequencySeconds = 1;
  };
  evtSource.onerror = function (e) {
    evtSource.close();
    reconnectFunc();
  };
}