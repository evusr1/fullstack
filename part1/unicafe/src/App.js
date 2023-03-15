import { useState } from 'react'

const Header = (props) => {
  const { text } = props
  return (
    <div>
        <h1>{text}</h1>
    </div>
  )
}

const Button = (props) => {
  const { text, handleClick } = props
  return(
    <button onClick={handleClick}>
      {text}
    </button>
  )
}

const StatisticLine = (props) => {
  const { text, value } = props
  return(
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  const values = props.values
  if(values.total == 0) {
    return(
      <div>
        No feedback given
      </div>
    )
  } else {
    return(
      <table>
        <tbody>
          <StatisticLine text="good" value={values.good}/>
          <StatisticLine text="neutral" value={values.neutral}/>
          <StatisticLine text="bad" value={values.bad}/>
          <StatisticLine text="all" value={values.total}/>
          <StatisticLine text="average" value={values.avg}/>
          <StatisticLine text="positive" value={values.positive + "%"}/>
        </tbody>
      </table>
    )
  }
}
const App = () => {
  // save clicks of each button to its own state

  const [feedback, setFeedback] = useState({
    good: 0,
    neutral: 0,
    bad: 0,
    total: 0,
    avg: 0,
    positive: 0
  })

  const handleGoodClick = () => {
    const newfeedback = { 
      ...feedback, 
      good: feedback.good + 1,
      total: feedback.total + 1,
      avg: ((feedback.good + 1) - feedback.bad) / (feedback.total + 1),
      positive: 100 * (feedback.good + 1) / (feedback.total + 1)
    }

    setFeedback(newfeedback)
  }

  const handleNeutralClick = () => {
    const newfeedback = { 
      ...feedback, 
      neutral: feedback.neutral + 1,
      total: feedback.total + 1,
      avg: (feedback.good - feedback.bad) / (feedback.total + 1),
      positive: 100 * feedback.good / (feedback.total + 1)
    }

    setFeedback(newfeedback)
  }

  const handleBadClick = () => {
    const newfeedback = { 
      ...feedback, 
      bad: feedback.bad + 1,
      total: feedback.total + 1,
      avg: (feedback.good - (feedback.bad + 1)) / (feedback.total + 1),
      positive: 100 * feedback.good / (feedback.total + 1)
    }

    setFeedback(newfeedback)
  }

  return (
    <div>
      <Header text="give feedback"/>

      <Button text="good" handleClick={handleGoodClick}/>
      <Button text="neutral" handleClick={handleNeutralClick}/>
      <Button text="bad" handleClick={handleBadClick}/>

      <Header text="statistics"/>
      <Statistics text="statistics" values={feedback}/>
    </div>
  )
}

export default App