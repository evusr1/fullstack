import { InputLabel, Slider } from "@mui/material";
import { HealthCheckRating } from "../../types";

interface Props {
    rating: HealthCheckRating;
    setRating: React.Dispatch<React.SetStateAction<HealthCheckRating>>;
}

const HealthCheckForm = ({rating, setRating}: Props) => {
    return (
        <>
            <InputLabel style={{ marginTop: 20 }}>Health Check Rating:</InputLabel> 
            <Slider
                aria-label="HealthCheck"
                value={rating}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={HealthCheckRating.Healthy}
                max={HealthCheckRating.CriticalRisk}
                onChange={(_target, value) => setRating(Number(value))}
            />
        </>
    )
};

export default HealthCheckForm;