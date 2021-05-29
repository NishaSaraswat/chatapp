export function subToNotifications() {
  if('Notification' in window) {
    Notification.requestPermission(async result => {
      if(result === 'granted') {
        // save subscription
        configPushSubscription();
      }
      else {
        // user clicked NO
        console.warn('Notifications not permitted');
      }
    });
  }
  else {
    // maybe send an email or sms instead
    // https://nodemailer.com/about/
    console.warn('Notifications not supported');
  }
}

async function configPushSubscription() {
  if(!('serviceWorker' in navigator)) return;

  const sw = await navigator.serviceWorker.ready;
  const subs = await sw.pushManager.getSubscription();

  if(subs) return; // already subscribed

  let publicPushKey = '<your-public-key>';
  publicPushKey = urlBase64ToUint8Array(publicPushKey);

  let newSub = await sw.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: publicPushKey
  });

  let res = await fetch('/api/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newSub)
  });

  if(res.ok) {
    console.log('Successfully subscribed for notifications');
  }
}

// helper function
function urlBase64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - base64String.length % 4) % 4);
  var base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}