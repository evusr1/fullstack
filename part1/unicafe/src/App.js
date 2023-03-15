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
  const {good, bad, neutral, total, avg, positive} = props.values
  if(total === 0) {
    return(
      <div>
        No feedback given
      </div>
    )
  } else {
    return(
      <table>
        <tbody>
          <StatisticLine text="good" value={good}/>
          <StatisticLine text="neutral" value={neutral}/>
          <StatisticLine text="bad" value={bad}/>
          <StatisticLine text="all" value={total}/>
          <StatisticLine text="average" value={avg}/>
          <StatisticLine text="positive" value={positive + "%"}/>
        </tbody>
      </table>
    )
  }
}
const App = () => {
  // save clicks of each button to its own state

  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)
  const [avg, setAvg] = useState(0)
  const [positive, setPositive] = useState(0)

  const handleGoodClick = () => {
    const updatedGood = good + 1
    const updatedTotal = updatedGood + bad + neutral

    setGood(updatedGood)
    setTotal(updatedTotal)
    setPositive(100 * updatedGood / updatedTotal)
    setAvg((updatedGood - bad) / updatedTotal)
  }

  const handleBadClick = () => {
    const updatedBad = bad + 1
    const updatedTotal = good + updatedBad + neutral

    setBad(updatedBad)
    setTotal(updatedTotal)
    setPositive(100 * good / updatedTotal)
    setAvg((good - updatedBad) / updatedTotal)
  }

  const handleNeutralClick = () => {
    const updatedNeutral= neutral + 1
    const updatedTotal = good + bad + updatedNeutral

    setNeutral(updatedNeutral)
    setTotal(updatedTotal)
    setPositive(100 * good / updatedTotal)
    setAvg((good - bad) / updatedTotal)
  }

  const feedbackArray = () => {
    return {good : good, bad : bad, neutral : neutral, total : total, avg : avg, positive : positive}
  }

  return (
    <div>
      <Header text="give feedback"/>

      <Button text="good" handleClick={handleGoodClick}/>
      <Button text="neutral" handleClick={handleNeutralClick}/>
      <Button text="bad" handleClick={handleBadClick}/>

      <Header text="statistics"/>
      <Statistics text="statistics" values={feedbackArray()}/>
    </div>
  )
}

export default App