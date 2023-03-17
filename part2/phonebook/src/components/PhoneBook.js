const Person = ({person}) =>
  <div>
    {person.name} {person.number}
  </div>

const PhoneBook = ({persons}) => 
  <div>
    {
      persons.map((person) => 
        <Person key={person.id} person={person}/>
      )
    }
  </div>

export default PhoneBook