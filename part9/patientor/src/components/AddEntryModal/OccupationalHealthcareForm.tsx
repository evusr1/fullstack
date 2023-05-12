import { Checkbox, FormControlLabel, InputLabel, TextField } from "@mui/material";
import React from "react";

interface Props {
    employer: string;
    setEmployer: React.Dispatch<React.SetStateAction<string>>;
    startDate: string;
    setStartDate: React.Dispatch<React.SetStateAction<string>>;
    endDate: string;
    setEndDate: React.Dispatch<React.SetStateAction<string>>;
    toggle: boolean;
    setToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

const OccupationalHealthcareForm = ({
        employer,
        setEmployer,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        toggle,
        setToggle
    }:Props
    ) => {
    
    const showSickLeaveForm = () => (
        <>
            <InputLabel style={{ marginTop: 20 }}>Start Date</InputLabel> 
            <input
                type="date"
                value={startDate} 
                onChange={({target}) => setStartDate(target.value)}

            />
            <InputLabel style={{ marginTop: 20 }}>End Date</InputLabel> 
            <input
                type="date"
                value={endDate}
                onChange={({target}) => setEndDate(target.value)}

            />
        </>
    )
    
    return (
        <>
        <TextField
          label="Employer"
          fullWidth
          value={employer}
          onChange={({target}) => setEmployer(target.value)}
        />
        <FormControlLabel
            control={
                <Checkbox
                    checked={toggle}
                    onChange={({target}) => setToggle(target.checked)}
                />
            }
            label="Sick Leave"
        />
        {toggle && showSickLeaveForm()}
        </>
    )
};

export default OccupationalHealthcareForm;