import { useState } from 'react'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import PhoneBook from './components/PhoneBook'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])

  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')

  const [searchName, setSearchName] = useState('')

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