/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

export default function FreeSoloTeachers(props) {
  return (

      <Autocomplete
        freeSolo
        className="form-control inputRounded"
        id={props.id}
        // disableClearable
        onChange={props.onChangeClass}
        onInputChange={props.onInputChangeClass}
        options={props.options}
        getOptionLabel={option => option.className}
        renderInput={(params) => (
          <TextField
            {...params}
            label={props.label}
            // margin="none"
            // variant="standard"
            // InputProps={{ ...params.InputProps, type: 'search' }}
            dir="rtl"
          />
        )}
      />
  );
}
