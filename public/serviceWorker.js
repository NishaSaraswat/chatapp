// 'Globals'
let cache; // holder for open cache
let missingImageUrl = 'images/missing-image.png';

// EVENTS:

// The install event runs when the service worker
// is registrered and we call onInstall
self.addEventListener('install', e => onInstall());

// The activate event runs when the install is done
self.addEventListener('activate', e => onActivate());

// The fetch event runs every time
// the web page requests a resource
self.addEventListener('fetch',
  e => e.respondWith(cacher(e.request)));


async function onInstall() {
  // IMPORTANT! - Faster activation:
  self.skipWaiting();

  // Open the cache, if not done already
  cache = cache || await caches.open('cache');

  // Since we have a network first cache strategy
  // only cache a few important files initially
  // (the index.html file and "missing-image"-image)
  return cache.addAll(['/', missingImageUrl]);
}

async function onActivate() {
  // IMPORTANT! - Faster activation:
  self.clients.claim();
}

// Cache strategy: 
// Network first (get from cache only if no network)
async function cacher(request) {
  // Open the cache, if not done already
  cache = cache || await caches.open('cache');

  // If we are online fetch from the server
  let response;
  if (navigator.onLine) {
    response = await fetch(request).catch(e => response = null);
  }

  // If we failed to get a server response, use the cache
  if (!response) {
    response = await cache.match(request);
    // failed to get it from cache too?
    response = response || await fallbackResponses(request);
  }

  // Otherwise cache the response, if it is a GET request
  else if (request.method === 'GET') {
    cache.put(request, response.clone()); // no await needed!
  }

  return response;
}

// Try to generate som fallback responses
async function fallbackResponses(request) {

  let response, key, cacheKeys = await cache.keys();
  let base = location.protocol + '//' + location.host + '/';
  let route = request.url.split(base)[1] || '';
  let extension = request.url.slice(-4);

  if (route && !route.includes('/') && !route.includes('.')) {
    // Could be a hard reload of a frontend route in a SPA
    // so send our 'start page' (the frontend router should manage)
    key = cacheKeys.find(({ url }) => url == base);
  }

  if (['.jpg', '.png', '.gif'].includes(extension)) {
    // Probably an image we are missing
    // so send our 'missing image' image ;)
    let img = base + missingImageUrl;
    key = cacheKeys.find(({ url }) => url === img);
  }

  response = key && await cache.match(key);
  return response;
}

// PUSH NOTIFICATIONS

self.addEventListener('push', evt => {
  evt.waitUntil(onPush(evt));
});

async function onPush(evt) {
  // get data from pushed notification
  let data = JSON.parse(evt.data.text());

  // options on how to display the notification
  const options = {
    body: data.content,
    vibrate: [100, 100],
    // image: data.image, // to show image in notify
    data: {
      url: data.url
    },

    // DON'T SPAM THE USER
    tag: 'new-message',
    renotify: false
  };

  // display the notification
  self.registration.showNotification(data.title, options);
}

self.addEventListener('notificationclick', evt => {
  evt.waitUntil(onNotificationClick(evt));
});

async function onNotificationClick(evt) {
  // extract url from notification data
  let { url } = evt.notification.data;

  // get all tabs
  let tabs = await clients.matchAll();
  let tab = tabs.find(tab => tab.visibilityState == 'visible');

  // has a tab open
  if(tab) {
    tab.navigate(url);
    tab.focus();
  }
  else {
    clients.openWindow(url);
  }

  // the notification won't close itself
  evt.notification.close();
}