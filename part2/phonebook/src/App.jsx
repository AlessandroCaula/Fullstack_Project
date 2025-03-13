import { useEffect, useState } from "react"
import SearchFilter from "./components/SearchFilter"
import PersonForm from "./components/PersonForm"
import Persons from "./components/Persons"
import personService from './services/persons'

function App() {
  // Collection of persons contacts fetched from the db server
  const [persons, setPersons] = useState([])
  // Name of the new contact
  const [newName, setNewName] = useState('')
  // Number of the new contact
  const [newNumber, setNewNumber] = useState('')
  // Filter the contacts
  const [filter, setFilter] = useState('')

  // useEffect hook used to fetched the person data from the db.json server database (http://localhost:3001/persons) - npm run server - to run it.
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        console.log('persons data fetched')
        // Set the persons with the fetched data
        setPersons(initialPersons)
      })
  }, [])

  const addContact = (event) => {
    // Preventing the default action of submitting HTML forms and re-rendering
    event.preventDefault()
    if (newName !== '' && newNumber !== '') {
      // // .some() method tests whether at least one element in the array passes the test implemented by the provided function. It returns true if, in the array, it finds an element for which the provided function return true.
      // If the person's name is already present, then ask the user if he wants to change the number of the user
      if (persons.find(person => person.name === newName)) {
        // Prompt the user asking if he wants to replace the number
        const confirmation = confirm(`${newName} is already added to phonebook, replace the old number with the new one?`)
        // If the user does not confirm
        if (!confirmation) {
          return
        }
        // Otherwise update the number of the person contact
        updateContactNumber()

      } else {
        // Creating the new person contact
        const newPerson = {
          name: newName,
          number: newNumber,
          // id: persons.length + 1
        }

        // Saving the new contact to the backend server
        personService
          .create(newPerson)
          .then(returnedPerson => {
            // Adding the newName to the persons
            setPersons(persons.concat(returnedPerson))
          })
      }
      // Resetting the new Name
      setNewName('')
      // Resetting the new Number
      setNewNumber('')
    }
  }

  // Update contact number 
  const updateContactNumber = () => {
    console.log('Updating contact numbers')
    // Find the person contact we want to modify 
    const contact = persons.find(person => person.name === newName)
    // Creating a new object that is an exact copy of the old contact, apart from the number property that has the value updated. 
    const changedContact = { ...contact, number: newNumber}

    personService
      .update(contact.id, changedContact)
      .then(returnedContact => {
        // Loop through all the contacts and replace the new note with the old one
        setPersons(persons.map(person => person.id === contact.id ? returnedContact : person)) 
      })
  }

  // Handling the Name changing in the input element
  const handleNameChange = (event) => {
    // Setting the new name to the value of the input element
    setNewName(event.target.value)
  }

  // Handling the Number changing in the input element
  const handleNumberChange = (event) => {
    // Setting the new number to the value of the input element
    setNewNumber(event.target.value)
  }

  // Handle the Filter changing in the input element
  const handleFilterChange = (event) => {
    // Setting the new filter 
    setFilter(event.target.value)
  }

  // Handle the deletion of a contact
  const handleContactDeletion = (person) => {
    // Prompt the user with a confirmation form.
    const confirmation = confirm(`Delete ${person.name}`)
    // If not confirmed, then return. 
    if (!confirmation)
      return

    // Delete the person contact.
    personService
      .remove(person.id)
      .then(deletedPerson => {
        console.log(deletedPerson)
        // The returned person is the deleted person
        // Remove the person from the state
        setPersons(persons.filter((person) => person.id !== deletedPerson.id))
      })
      .catch(error => {
        console.log(error)
        alert(`Failed to delete ${person.name}`)
      })
  }

  // Filter out the persons
  const filteredPerson = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )
  // console.log(filteredPerson)

  return (
    <div>
      <h2>Phonebook</h2>

      {/* Search Engine */}
      <SearchFilter
        filter={filter}
        handleFilterChange={handleFilterChange}
      />

      {/* Add new */}
      <h3>Add a new</h3>
      <PersonForm
        addContact={addContact}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      {/* Show Contacts */}
      <h3>Numbers</h3>
      <Persons
        filteredPerson={filteredPerson}
        handleContactDeletion={handleContactDeletion}
      />

    </div>
  )
}

export default App