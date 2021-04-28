import { Component } from 'react';
// Components
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';
import Filter from './components/Filter';

class App extends Component {
  state = {
    contacts: [
      { id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
      { id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
      { id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
      { id: 'id-4', name: 'Annie Copeland', number: '227-91-26' },
    ],
    filter: '',
  };

  setContactId = () => {
    const contactIds = [];
    this.state.contacts.map(contact =>
      contactIds.push(contact.id.replace(/\D/g, '')),
    );
    return 'id-' + (Math.max(...contactIds) + 1);
  };

  capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  formSubmitHandler = data => {
    const { name, number } = data;
    const normalizedName = name.toLowerCase();

    if (
      this.state.contacts.find(
        ({ name }) => name.toLowerCase() === normalizedName,
      )
    ) {
      return alert(`${name} is already in contacts.`);
    }

    const newContact = {
      id: this.setContactId(),
      name: this.capitalizeFirstLetter(name),
      number,
    };
    this.setState(prevState => ({
      contacts: [...prevState.contacts, newContact],
    }));
  };

  deleteContact = contactId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== contactId),
    }));
  };

  //LOCAL STORAGE START

  componentDidMount() {
    const contacts = localStorage.getItem('contacts');
    const parsedContacts = JSON.parse(contacts);
    if (parsedContacts) {
      this.setState({ contacts: parsedContacts });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log('Component did update');
    // console.log(prevState);
    // console.log(this.state);

    if (this.state.contacts !== prevState.contacts) {
      // console.log('Contacts update');
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }

  //LOCAL STORAGE END

  changeFilter = e => {
    this.setState({ filter: e.currentTarget.value });
  };

  render() {
    const { contacts, filter } = this.state;
    const normalizedFilter = this.state.filter.toLowerCase();

    const visibleContacts = contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedFilter),
    );
    return (
      <div className="phonebook">
        <h1 className="phonebook_title">Phonebook</h1>
        <ContactForm onSubmit={this.formSubmitHandler} />
        <h2 className="phonebook_title">Contacts</h2>
        <Filter value={filter} onChange={this.changeFilter} />
        <ContactList contacts={visibleContacts} onDelete={this.deleteContact} />
      </div>
    );
  }
}

export default App;
