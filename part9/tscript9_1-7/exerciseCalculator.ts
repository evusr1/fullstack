
interface ExerciseValues {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: number,
  ratingDescription: string,
  target: number,
  average: number   
};

interface HoursValues {
  hoursADay: number[],
  hoursTarget: number
};

const parseArgumentsExercises = (args: string[]): HoursValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  
  const hoursADay = args.slice(3,args.length)
    .map((day) => {
      if(!isNaN(Number(day)))
        return Number(day);
      throw new Error('Proviced numbers were not numbers.')
    });
  
  if(!isNaN(Number(args[2]))) {
    return {
      hoursADay: hoursADay,
      hoursTarget: Number(args[2])
    }
  } else {
    throw new Error('Proviced numbers were not numbers.')
  }
} 

const caclulateExercises = (hoursADay: number[], hoursTarget: number): ExerciseValues => {
  const average = hoursADay.reduce((sum, hours) => sum + hours, 0) 
    / hoursADay.length;

  const trainingDays = hoursADay.reduce((days, hour) => hour > 0 ? days + 1 : days, 0)

  const success = hoursADay.every(hour => hour >= hoursTarget);

  const rating = success ? 3
    : average > hoursTarget * 0.75 ? 2
    : 1

  let ratingText = "";
  switch (rating) {
    case 1:
      ratingText = 'You\'re Loser'
      break;
    case 2:
      ratingText = 'not too bad but could be better'
      break;
    case 3:
      ratingText = 'You\'re Winner'
      break;
  }

  return {
    periodLength: hoursADay.length,
    trainingDays: trainingDays,
    success: success,
    rating: rating,
    ratingDescription: ratingText,
    target: hoursTarget,
    average: average     
  };
}

try {
  const { hoursADay, hoursTarget } = parseArgumentsExercises(process.argv);
  console.log(caclulateExercises(hoursADay, hoursTarget));
} catch (error : unknown) {
  let errorMessage = 'Something bad happened.';
  
  if(error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  
  console.log(errorMessage);
}
  