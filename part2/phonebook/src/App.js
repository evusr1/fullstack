import { useState, useEffect } from 'react'

import personsService from './services/persons'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import PhoneBook from './components/PhoneBook'

const App = () => {
  const [persons, setPersons] = useState([])
  
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')

  const [searchName, setSearchName] = useState('')

  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
  }, [])

  const addName = (e) => {
    e.preventDefault()

    const oldPerson = persons.find((person) => person.name===newName)
    if(oldPerson) {
      if(window.confirm(`${oldPerson} is already added to the phonebook, replace the old number with the new one?`)) {
        const changePerson = {...oldPerson, number: newPhone }

        personsService
          .update(oldPerson.id, changePerson)
          .then((returnedPerson) => {
            setPersons(persons.map(p => p.id !== oldPerson.id ? p : returnedPerson ))
            setNewName('')
            setNewPhone('')
        }) 
      }

    } else {
      const nameObject = { name: newName, number: newPhone }
      
      personsService
        .create(nameObject)
        .then(newPerson => {
          setPersons(persons.concat(newPerson))
          setNewName('')
          setNewPhone('')
      })

    }
  }

  const removeName = id => {
    const oldPerson = persons.find((person) => person.id===id).name
    
    if(window.confirm(`Delete ${oldPerson}?`)) {
      personsService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
      }) 
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
                    newName,
                    handleNameChange
                  }}
        numberEvent={{
                    newPhone,
                    handlePhoneChange
                  }}
        handleSubmit={addName} />

      <h3>Numbers</h3>
      <PhoneBook persons={namesToShow} handleDelete={removeName}/>
    </div>
  )
}

export default App