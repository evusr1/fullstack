import { InputLabel, TextField } from "@mui/material";

interface Props {
    date: string;
    setDate: React.Dispatch<React.SetStateAction<string>>;
    criteria: string;
    setCriteria: React.Dispatch<React.SetStateAction<string>>;
}

const HospitalForm = ({date, criteria, setDate, setCriteria}: Props) => {
    return (
        <>
        <InputLabel style={{ marginTop: 20 }}>Discharge Date</InputLabel> 
        <input
          type="date" 
          value={date}
          onChange={({target}) => setDate(target.value)}
        />
        <TextField
          label="Criteria"
          fullWidth 
          value={criteria}
          onChange={({target}) => setCriteria(target.value)}
        />
        </>
    )
};

export default HospitalForm;