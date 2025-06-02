class Contact {
  constructor(
    public id: string,
    public name: string,
    public phoneNumber: string,
    public email: string
  ) {}
}

class ContactManager {
  private contacts: Contact[] = [];
  private storageKey = 'contacts';

  constructor() {
    this.loadContacts();
  }

  loadContacts() {
    const data = localStorage.getItem(this.storageKey);
    if (data) {
      this.contacts = JSON.parse(data);
    }
  }

  saveContacts() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.contacts));
  }

  addContact(name: string, phoneNumber: string, email: string) {
    const newContact = new Contact(Date.now().toString(), name, phoneNumber, email);
    this.contacts.push(newContact);
    this.saveContacts();
    return newContact;
  }

  deleteContact(id: string) {
    this.contacts = this.contacts.filter(contact => contact.id !== id);
    this.saveContacts();
  }

  updateContact(id: string, name: string, phoneNumber: string, email: string) {
    const contact = this.contacts.find(c => c.id === id);
    if (contact) {
      contact.name = name;
      contact.phoneNumber = phoneNumber;
      contact.email = email;
      this.saveContacts();
    }
  }

  searchContacts(query: string) {
    return this.contacts.filter(contact =>
      contact.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  getAllContacts() {
    return this.contacts;
  }
}

const manager = new ContactManager();
const contactList = document.getElementById('contactList') as HTMLElement;
const form = document.querySelector('.getContactDetails') as HTMLFormElement;
const nameInput = document.getElementById('name') as HTMLInputElement;
const phoneInput = document.getElementById('phoneNumber') as HTMLInputElement;
const emailInput = document.getElementById('email') as HTMLInputElement;
const searchInput = document.getElementById('search') as HTMLInputElement;

function renderContacts(contacts: Contact[]) {
  contactList.innerHTML = '';
  contacts.forEach(contact => {
    const div = document.createElement('div');
    div.className = 'contact-item';
    div.innerHTML = `
      <p><strong>NAME :${contact.name}</strong></p>
      <p>Phone Number${contact.phoneNumber}</p>
      <p>Email: ${contact.email}</p>
      <button data-id="${contact.id}" class="edit-btn">Edit</button>
      <button data-id="${contact.id}" class="delete-btn">Delete</button>
    `;
    contactList.appendChild(div);
  });
}

function resetForm() {
  form.reset();
  form.removeAttribute('data-editing');
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const idEditing = form.getAttribute('data-editing');

  if (idEditing) {
    manager.updateContact(idEditing, nameInput.value, phoneInput.value, emailInput.value);
  } else {
    manager.addContact(nameInput.value, phoneInput.value, emailInput.value);
  }

  renderContacts(manager.getAllContacts());
  resetForm();
});

contactList.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const id = target.getAttribute('data-id');
  if (!id) return;

  if (target.classList.contains('delete-btn')) {
    manager.deleteContact(id);
    renderContacts(manager.getAllContacts());
  } else if (target.classList.contains('edit-btn')) {
    const contact = manager.getAllContacts().find(c => c.id === id);
    if (contact) {
      nameInput.value = contact.name;
      phoneInput.value = contact.phoneNumber;
      emailInput.value = contact.email;
      form.setAttribute('data-editing', contact.id);
    }
  }
});

searchInput.addEventListener('input', () => {
  const query = searchInput.value;
  const results = manager.searchContacts(query);
  renderContacts(results);
});

renderContacts(manager.getAllContacts());
