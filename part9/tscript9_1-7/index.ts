import express from 'express';
import { validateBMI, calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
    res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
    try {
        const { height, weight } = validateBMI(
            String(req.query.height),
            String(req.query.weight)
        );
        
        const bmi = calculateBmi(height, weight);

        return res.json({ height, weight, bmi });
    } catch ( error : unknown ) {
        return res.status(400).json({ error: "malformatted parameters" });
    }
});

app.post('/exercises', (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { daily_exercises, target } = req.body;

    if(!daily_exercises || !target) 
        return res.status(400).json({ error: "parameters missing" }).end();

    if(!Array.isArray(daily_exercises)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        || daily_exercises.some((hour: number) => isNaN(hour))
        || isNaN(Number(target))) {
            return res.status(400).json({ error: "malformatted parameters" }).end();
    }
    return res.json(calculateExercises(daily_exercises as number[], target as number));
});

const PORT = 3003;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});