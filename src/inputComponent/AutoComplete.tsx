import React from 'react';
import CustomAutocomplete from '@mui/material/Autocomplete';
import TextField, { TextFieldProps } from '@mui/material/TextField';

interface IAutoComplete {
  textFieldProps?: TextFieldProps;
  options: Array<string>;
  onChange: any;
  setFieldValue?: any;
  disabled?: boolean
  value?: string
}

const AutoComplete: React.FC<IAutoComplete> = ({
  textFieldProps,
  setFieldValue,
  options,
  onChange,
  disabled,
  value
}) => {
  const [open, setOpen] = React.useState(false);
  return (
    <CustomAutocomplete
      fullWidth
      disablePortal
      size='small'
      disabled={disabled}
      autoComplete
      value={value}
      options={options ?? []}
      getOptionLabel={(option) => option || ''}
      filterSelectedOptions
      onChange={onChange}
      onInputChange={(event, value, reason) => {
        if (reason === 'input' && value !== '') {
          setOpen(true);
        } else {
          setOpen(false);
        }
      }}
      open={open}
      onClose={() => setOpen(false)}
      renderInput={(params) => <TextField
        {...params}
        {...textFieldProps}
        onKeyDown={(e) => {
          if (e.key === 'Tab') {
            if (open) {
              e.preventDefault();
              setOpen(false);
            }
          }
        }}
      />}
      sx={{
        '& .MuiAutocomplete-endAdornment': { display: 'none' },
        "& .MuiOutlinedInput-root": {
          "&:hover fieldset": {
            borderColor: '#79747E',
          },
          "&.Mui-focused fieldset": {
            borderColor: '#79747E',
          },
        },
        '& label.Mui-focused': {
          color: '#49454F',
        },
      }}
    />
  );
};

export default AutoComplete;
