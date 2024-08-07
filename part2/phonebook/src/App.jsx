import { useState, useEffect } from 'react';
import personService from './services/person';
import Persons from './components/Persons';
import Notification from './components/Notification';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    const person = persons.find(p => p.name === newName);
    const personObject = {
      name: newName,
      number: newNumber,
    };
  
    if (person) {
      const isConfirmed = window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`);
      if (isConfirmed) {
        personService
          .update(person.id, personObject)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson));
            setSuccessMessage(`Updated ${newName}'s number`);
            setTimeout(() => {
              setSuccessMessage(null);
            }, 5000);
          })
          .catch(error => {
            console.error('Error updating person:', error);
            const errorMessage = error.response && error.response.data && error.response.data.error
              ? error.response.data.error
              : `The information of '${newName}' has already been removed from the server`;
            setErrorMessage(errorMessage);
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
            setPersons(persons.filter(p => p.id !== person.id));
          });
      }
    } else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNewName('');
          setNewNumber('');
          setSuccessMessage(`Added ${newName}`);
          setTimeout(() => {
            setSuccessMessage(null);
          }, 5000);
        });
    }
  };

  const removePerson = (id) => {
    const person = persons.find(p => p.id === id);
    const isConfirmed = window.confirm(`Delete ${person.name}?`);
  
    if (isConfirmed) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id));
        })
        .catch(error => {
          console.error('Error deleting person:', error);
          alert(`The person '${person.name}' was already deleted from server`);
          setPersons(persons.filter(p => p.id !== id));
        });
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMessage} type="success"/>
      <Notification message={errorMessage} type="error"/>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <Persons persons={persons} onDelete={removePerson} />
    </div>
  );
};

export default App;
