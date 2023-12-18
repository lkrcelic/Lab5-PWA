const firebaseConfig = {
  apiKey: "AIzaSyB4Yfkx1p6swRzF5_qvyUgflevUrro1EIY",
  authDomain: "lab5-pwa.firebaseapp.com",
  projectId: "lab5-pwa",
  storageBucket: "lab5-pwa.appspot.com",
  messagingSenderId: "917207390153",
  appId: "1:917207390153:web:8a5dfe2ec3690f6b0bfa18",
  measurementId: "G-Q3VGF4NQPH"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();

db.settings({
  cache: {
    sizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
    enablePersistence: true
  }
});

// Real-time listener
db.collection('contacts').onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    if (change.type === 'added') {
      renderContact({ id: change.doc.id, ...change.doc.data() });
    }

    if (change.type === 'removed') {
      removeContact(change.doc.id);
      //TODO: Remove the contact from the DOM
    }
  });
});



// Adding new contact logic
function showLocalNotification(message) {
  if (Notification.permission === 'granted') {
    console.log('Notification permission is granted it should work.')
    new Notification(message);
  }
}

const form = document.querySelector('form');
form.addEventListener('submit', evt => {
  evt.preventDefault();

  const contact = {
    name: form.name.value,
    phone_number: form.phoneNumber.value,
  };

  if (!navigator.onLine) {
    console.log('You are offline, but your action is saved')
    showLocalNotification('You are offline, but your action is saved');
  }

  db.collection('contacts').add(contact)
    .catch(err => console.log(err));


  form.name.value = '';
  form.phoneNumber.value = '';
});

//implement the renderContact
const contacts = document.querySelector('.contacts');
const renderContact = (data, id) => {
  const html = ` <div class="grey-text text-darken-1 pk-contact">
        <div class="contact-image">
            <img src="img/pkcontacts.png" alt="contact thumb">
        </div>
        <div class="contact-details">
            <div class="contact-title">${data.name}</div>
            <div class="contact-numbers">${data.phone_number}</div>
        </div>
        <div class="contact-options">
            <i class="material-icons">call</i>
            <i class="material-icons" data-id="${id}">delete_outline</i>
        </div>
    </div>`

  contacts.innerHTML +=  html;
}


// Delete contact
const contactContainer = document.querySelector('.contacts');

contactContainer.addEventListener('click', evt => {
  if (evt.target.tagName === 'I' && evt.target.textContent === 'delete_outline') {
    const id = evt.target.getAttribute('data-id');
    const docRef = db.doc('contacts/' + id); // Corrected usage
    db.deleteDoc(docRef).then(() => {
      // Remove the contact from the DOM
      const contactElement = document.querySelector(`.pk-contact[data-id="${id}"]`);
      if (contactElement) {
        contactElement.remove();
      }
    });
  }
});

