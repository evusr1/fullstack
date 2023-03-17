import { useState, useEffect } from 'react'

import axios from 'axios'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import PhoneBook from './components/PhoneBook'

const App = () => {
  const [persons, setPersons] = useState([])
  
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')

  const [searchName, setSearchName] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => setPersons(response.data))
  }, [])

  const addName = (e) => {
    e.preventDefault()

    if(persons.filter((person) => person.name===newName).length > 0) {
      alert(`${newName} is already added to phonebook`)
    } else {
      const nameObject = {
        name: newName,
        number: newPhone,
        id: persons.length + 1
      }
      setPersons(persons.concat(nameObject))
      setNewName('')
      setNewPhone('')
    }
  }

  const handleNameChange = (e) => 
    setNewName(e.target.value)

  const handlePhoneChange = (e) => 
    setNewPhone(e.target.value) 

  const handleSearchChange = (e) => {
    setSearchName(e.target.value) 

  }

  const namesToShow = (searchName==='')
      ? persons
      : persons.filter((person) => person.name.toLowerCase().includes(searchName.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter handleValue={searchName} handleChange={handleSearchChange} />

      <h3>add a new</h3>
      <PersonForm
        nameEvent={{
                    handleValue: newName,
                    handleChange: handleNameChange
                  }}
        numberEvent={{
                    handleValue: newPhone,
                    handleChange: handlePhoneChange
                  }}
        handleSubmit={addName} />

      <h3>Numbers</h3>
      <PhoneBook persons={namesToShow} />
    </div>
  )
}

export default App