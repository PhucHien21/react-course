import React from 'react'
import { useState, useEffect } from 'react'
import handlePersons from './services/persons'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [message, setMessage] = useState({mess: '', type: 'notification'})

  const list = (filterName == '') 
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(filterName.toLowerCase()))

  useEffect(() => {
    handlePersons
      .getAll()
      .then(initialPerson => setPersons(initialPerson))
  }, [])

  const handleMessage = (noti) => {
    setMessage(noti)
    const setBNull = {...noti, mess: ''}
    setTimeout(() => setMessage(setBNull), 5000)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const newUser = {
      name: newName,
      number: newNumber,
    }
    const checkedUser = persons.find((person) => person.name === newName)
    if (newName !== '' && newNumber !== '') {
      if (checkedUser) {
        if (window.confirm(`${newUser.name} is already added to phonebook, replace the old number with the new one?`))  {
          const copyUser = {...checkedUser, number: newUser.number}
          handlePersons
            .updateUser(copyUser.id, copyUser)
            .then(returnedUser => {
              setPersons(persons.map(person => person.id !== copyUser.id ? person : returnedUser))
              const noti = {
                mess: `${returnedUser.name}'s number has been updated!`,
                type: 'notification'
              }
              handleMessage(noti)
            })
            .catch(error => {
              const noti = {
                mess: `${newUser.name} was already removed from server`,
                type: 'error'
              }
              handleMessage(noti)
            })
        } else {
          const noti = {
            mess: `Keep ${newUser.name} old number!`,
            type: 'notification'
          }
          handleMessage(noti)
        }
      }
      else {
        handlePersons
          .createUser(newUser)
          .then(newUser => {
            setPersons(persons.concat(newUser))
          })
      }
    } else {
      const noti = {
        mess: `Missing name or number!`,
        type: 'notification'
      }
      handleMessage(noti)
    }
    setNewName('')
    setNewNumber('')
  }

  const handleDelete = id => {
    const user = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${user.name}?`)) {
      handlePersons
        .deleteUser(id)
        .then(
          setPersons(persons.filter(person => person.id !== id))
        )
    } else {
      const noti = {
        mess: `Keep ${user.name}!`,
        type: 'notification'
      }
      handleMessage(noti)
    }
  }

  const handleOnChange = (event) => {
    switch (event.target.name) {
      case 'name': 
        setNewName(event.target.value)
        break
      case 'number':
        setNewNumber(event.target.value)
        break
      case 'filter':
        setFilterName(event.target.value)
        break
    }
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message}/>
      <Filter filterName={filterName} onChange={handleOnChange}/>
      <PersonForm onSubmit={addPerson} newName={newName} newNumber={newNumber} onChange={handleOnChange}/>
      <h2>Numbers</h2>
      <Persons list={list} del={handleDelete}/>
    </div>
  )
}

const Filter = (props) => {
  return (
    <div>
        filter shown with <input name='filter' value={props.filterName} onChange={props.onChange}/>
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.onSubmit}>
        <h2>add a new</h2>
        <div>
          name: <input name='name' value={props.newName} onChange={props.onChange}/><br/>
          number: <input name='number' value={props.newNumber} onChange={props.onChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

const Persons = ({list, del}) => {
  return list.map((person) => 
    <p key={person.id}>{person.name} - {person.number} <button onClick={() => del(person.id)}>delete</button></p>
  )
}

const Notification = ({message}) => {
  if (message.mess === '') {
    return null
  } else {
    return <div className={message.type}>{message.mess}</div>
  }
}

export default App