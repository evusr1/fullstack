import express from 'express';
import { validateBMI, calculateBmi } from './bmiCalculator';

const app = express();
app.use(express.json())

app.get('/hello', (_req, res) => {
    res.send('Hello Full Stack!')
})

app.get('/bmi', (req, res) => {
    try {
        const { height, weight } = validateBMI(
            String(req.query.height),
            String(req.query.weight)
        );
        
        const bmi = calculateBmi(height, weight);

        res.json({ bmi });
    } catch ( error : unknown ) {
        res.json({ error: "malformatted parameters" })
    }
})


const PORT = 3003;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});