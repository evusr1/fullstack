const Header = (props) => {
  return (
    <div>
        <h1>{props.course}</h1>
    </div>
  )
}

const Part = (props) => {
  return (
    <div>
      <p>
        {props.part.name} {props.part.number}
      </p>
    </div>
  )
}

const Content = (props) => {
  return (
    <div>
        <Part part={props.parts[0]} />
        <Part part={props.parts[1]} />
        <Part part={props.parts[2]} />
    </div>
  )
}

const Total = (props) => {
  let total = 0;

  for(let i = 0; i < props.parts.length; i++) 
    total += props.parts[i].number;

  return (

    <div>
      <p>Number of exercises {total}</p>
    </div>
  )
}

const App = () => {
  const course = 'Half Stack application development'

  const parts = [
    { name: 'Fundamentals of React', number: 10 },
    { name: 'Using props to pass data', number: 7 },
    { name: 'State of a component', number: 14 },
  ]

  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  )
}

export default App