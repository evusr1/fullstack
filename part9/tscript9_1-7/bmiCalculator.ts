interface BmiValues {
    height: number;
    weight: number;
  }
  
const parseArgumentsBmi = (args: string[]): BmiValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  return(validateBMI(args[2], args[3]));
}

export const validateBMI = (height: string, weight: string) => {
  if (!isNaN(Number(height)) && !isNaN(Number(weight))) {
    return {
      height: Number(height),
      weight: Number(weight)
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
}

export const calculateBmi = (height: number, weight: number) => {
  const bmi: number = weight / ((height / 100) * (height / 100));
    
  if(bmi < 16) 
    return 'Underweight (Severe thinness)';
  else if(bmi < 16.9)
    return 'Underweight (Moderate thinness)';
  else if(bmi < 18.4)
    return 'Underweight (Mild thinness)';
  else if(bmi < 24.9)
    return 'Normal (Healthy Weight)';
  else if(bmi < 29.9)
    return 'Overweight (Pre-obese)';
  else if(bmi < 34.9)
    return 'Obese (Class I)';
  else if(bmi < 39.9)
    return 'Obese (Class II)';

  return 'Obese (Class III)';
}

//not sure if I'm supposed to remove this
try {
  const { height, weight } = parseArgumentsBmi(process.argv);
  console.log(calculateBmi(height, weight));
} catch (error : unknown) {
  let errorMessage = 'Something bad happened.';

  if(error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }

  console.log(errorMessage);
}
