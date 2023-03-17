const PersonForm = ({handleSubmit, nameEvent, numberEvent}) => 
  <form onSubmit={handleSubmit}>
    <div>
      name: <input value={nameEvent.handleValue} onChange={nameEvent.handleChange}/>
    </div>
    <div>
      number: <input value={numberEvent.handleValue} onChange={numberEvent.handleChange}/>
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>

export default PersonForm