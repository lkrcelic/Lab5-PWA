//check if the sw is supported
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then((reg) => console.log('worker registered', reg))
    .catch((err) => console.log('worker not registered', err));
}

Notification.requestPermission().then(permission => {
  if (permission === 'granted') {
    console.log('Notification permission granted.');
  }
});

window.addEventListener('offline', () => {
  console.log('You are now offline.');
  // Perform actions necessary for offline mode
});

