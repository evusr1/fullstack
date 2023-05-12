import {  Icon, Paper } from "@mui/material";
import { Entry, EntryType } from "../../types";

import CreateIcon from '@mui/icons-material/Create';

interface Props {
    entry: Entry;
    handleDiagnosis: (code: string) => string;
}

const HospitalEntry = ({entry, handleDiagnosis}:Props) => {
    if(entry.type !== EntryType.Hospital)
        return (<></>);
    
    return (
        <Paper sx={{p: 2, mt: 2}}>
            {entry.date} 
            <Icon>
                <CreateIcon/>
            </Icon><br/>
            {entry.description}<br/>
            <ul>
                {entry.diagnosisCodes && entry.diagnosisCodes.map((code) => (
                    <li key={code}>{code} {handleDiagnosis(code)}</li>
                ))}
            </ul>
            Discharge: {entry.discharge.date} {entry.discharge.criteria}<br/>
            diagnose by {entry.specialist}
        </Paper>
    )
}

export default HospitalEntry;