import {  Icon, Paper } from "@mui/material";
import { Entry, EntryType } from "../../types";

import WorkIcon from '@mui/icons-material/Work';

interface Props {
    entry: Entry;
    handleDiagnosis: (code: string) => string;
}

const OccupationalHealthcareEntry = ({entry, handleDiagnosis}:Props) => {
    if(entry.type !== EntryType.OccupationalHealthcare)
        return (<></>);
    
    return (
        <Paper sx={{p: 2, mt: 2}}>
            {entry.date}
            <Icon>
                <WorkIcon/>
            </Icon>
            {entry.employerName}<br/>
            {entry.description}<br/>
            {entry.sickLeave && <>Sick Leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}<br/></>}
            <ul>
                {entry.diagnosisCodes && entry.diagnosisCodes.map((code) => (
                <li key={code}>{code} {handleDiagnosis(code)}</li>
                ))}
            </ul>
            diagnose by {entry.specialist}
        </Paper>
    )
}

export default OccupationalHealthcareEntry;