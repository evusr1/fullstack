 
const Header = ({ course }) => <h1>{course}</h1>

/*const Total = ({ sum }) => <p>Number of exercises {sum}</p>*/

const Total = ({ sum }) => <b>total of {sum} exercises</b>

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => 
  <>
    {parts.map(part =>
      <Part
        part={part} 
        key={part.id}
      />       
    )}

  </>
  
const Course = (props) => {
  const { course } = props
  const total = course.parts.reduce((s, p) => s + p.exercises, 0)

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total sum={total} />
    </div>
  )
}

export default Course