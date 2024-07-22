import React from 'react';
import { Radio, RadioGroup, FormControlLabel, FormControl, Typography } from "@mui/material";

const RoleSelector = ({ role, setRole }) => {
    const handleChange = (event) => {
        setRole(event.target.value);
    };

    return (
        <FormControl>
            <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={role}
                onChange={handleChange}
                row
            >
                <FormControlLabel
                    value="user"
                    control={<Radio size="small" />}
                    label={<Typography variant="body2">User</Typography>}
                />
                <FormControlLabel
                    value="admin"
                    control={<Radio size="small" />}
                    label={<Typography variant="body2">Admin</Typography>}
                />
            </RadioGroup>
        </FormControl>
    );
}

export default RoleSelector;
