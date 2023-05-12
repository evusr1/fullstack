
import { SyntheticEvent, useState } from "react";
import { Diagnosis, EntryFormValues, EntryType, HealthCheckRating } from "../../types";
import { Button, Grid, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";

import AddIcon from '@mui/icons-material/Add';
import HealthCheckForm from "./HealthCheckForm";
import HospitalForm from "./HospitalForm";
import OccupationalHealthcareForm from "./OccupationalHealthcareForm";


interface Props {
  onCancel: () => void;
  onSubmit: (values: EntryFormValues) => void;
  diagnoses: Diagnosis[]
}

const AddEntryForm = ({onCancel, onSubmit, diagnoses}: Props) => {
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [specialist, setSpecialist] = useState('');
    const [type, setType] = useState<EntryType>(EntryType.HealthCheck);
    const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
    const [diagnosisCode, setDiagnosisCode] = useState<string>();

    const [healthCheckRating, setHealthCheckRating] = useState(HealthCheckRating.Healthy)

    const [dischargeDate, setDischargeDate] = useState('');
    const [dischargeCriteria, setDischargeCriteria] = useState('');

    const [occupationalEmployer, setOccupationalEmployer] = useState('')
    const [sickLeaveStartDate, setSickLeaveStartDate] = useState('');
    const [sickLeaveEndDate, setSickLeaveEndDate] = useState('');
    const [sickLeaveToggle, setSickLeaveToggle] = useState(true)

    const onTypeChange = (event: SelectChangeEvent<string>) => {
      event.preventDefault();
      if ( typeof event.target.value === "string") {
        const value = event.target.value;
        const type = Object.values(EntryType).find(g => g.toString() === value);
        if (type) {
          setType(type);
        }
      }
    };

    const onDiagnosisAddClick = () => {
      if(diagnosisCode)
        setDiagnosisCodes(diagnosisCodes.concat(diagnosisCode));
    }

    const showEntryTypeForm = () => {
      switch(type) {
        case EntryType.HealthCheck:
          return <HealthCheckForm
            rating={healthCheckRating}
            setRating={setHealthCheckRating}
          />
        case EntryType.Hospital:
          return <HospitalForm
            date={dischargeDate}
            setDate={setDischargeDate}
            criteria={dischargeCriteria}
            setCriteria={setDischargeCriteria}
          />
        case EntryType.OccupationalHealthcare:
          return <OccupationalHealthcareForm
              employer={occupationalEmployer}
              setEmployer={setOccupationalEmployer}
              startDate={sickLeaveStartDate}
              setStartDate={setSickLeaveStartDate}
              endDate={sickLeaveEndDate}
              setEndDate={setSickLeaveEndDate}
              toggle={sickLeaveToggle}
              setToggle={setSickLeaveToggle}
            />
      }
    }
    const addEntry = (event: SyntheticEvent) => {
      event.preventDefault();
      console.log(type,
        date,
        description,
        specialist,
        diagnosisCodes)
      switch(type) {
        case EntryType.HealthCheck:
          onSubmit({
            type,
            date,
            description,
            specialist,
            diagnosisCodes,
            healthCheckRating
          });
          break;
        case EntryType.Hospital:
          onSubmit({
            type,
            date,
            description,
            specialist,
            diagnosisCodes,
            discharge: {
              date: dischargeDate,
              criteria: dischargeCriteria
            }
          });
          break;
        case EntryType.OccupationalHealthcare:
          onSubmit({
            type,
            date,
            description,
            specialist,
            diagnosisCodes,
            employerName: occupationalEmployer,
            sickLeave: sickLeaveToggle ?
              {
                startDate: sickLeaveStartDate,
                endDate: sickLeaveEndDate
              }
            : undefined
          });
          break;
      }
    };
    return (
      <div>
      <form onSubmit={addEntry}>
        <InputLabel style={{ marginTop: 20 }}>Date</InputLabel> 
        <input
            type="date" 
            value={date}
            onChange={({ target }) => setDate(target.value)}
          />
        <InputLabel style={{ marginTop: 20 }}>Type</InputLabel>
        <Select
          label="Type"
          fullWidth
          value={type}
          onChange={onTypeChange}
        >
        {Object.values(EntryType).map(value =>
          <MenuItem
            key={value}
            value={value}
          >
            {value
          }</MenuItem>
        )}
        </Select>

        <TextField
          label="Description"
          fullWidth 
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />
        <TextField
          label="Specialist"
          fullWidth 
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
        />
        <TextField
          label="Diagnoses"
          fullWidth 
          value={diagnosisCodes.join(', ')}
          disabled={true}
        />
        <Grid container>
          <Grid item xs={11}>
          <Select
            fullWidth
            label="Diagnosis to add"
            onChange={({ target }) => setDiagnosisCode(target.value)}
            value={diagnosisCode ? diagnosisCode : diagnoses[0].code}
          >
          {diagnoses.map(diagnosis =>
            <MenuItem
              key={diagnosis.code}
              value={diagnosis.code}
            >
              {diagnosis.code} {diagnosis.name
            }</MenuItem>
          )}
          </Select>
          </Grid>
          <Grid item xs={1}>
            <IconButton onClick={onDiagnosisAddClick} >
              <AddIcon/>
            </IconButton>
          </Grid>
        </Grid>
        {showEntryTypeForm()}
        <Grid>
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              style={{ float: "left" }}
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              style={{
                float: "right",
              }}
              type="submit"
              variant="contained"
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
    )
}

export default AddEntryForm;