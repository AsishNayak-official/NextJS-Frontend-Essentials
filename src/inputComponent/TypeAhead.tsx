'use client'
import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Chip, { ChipProps as defaultChipProps } from '@mui/material/Chip';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import React, { useRef } from 'react';

interface ITypeAheadProps {
  textFieldProps?: TextFieldProps;
  chipProps?: defaultChipProps;
  options?: string[];
  name?: string;
  value: string[];
  onChange: any;
  setFieldValue?: any;
  disabled?:boolean
}

const TypeAhead: React.FC<ITypeAheadProps> = ({ textFieldProps, setFieldValue, chipProps, options, name, value, onChange, disabled }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = React.useState(false);
  const [hint, setHint] = React.useState('');

  return (
    <Autocomplete
      multiple
      fullWidth
      limitTags={2}
      value={value}   
      disabled={disabled}
      onKeyDown={(event) => {
        if (event.key === 'Tab') {
          if (hint !== '') {
            setFieldValue(name, [...value, hint]);
            setHint('');
            setOpen(false);
            event.preventDefault();
          }
        }
      }}
      renderInput={(params) => (
        <Box sx={{ position: 'relative' }}>
          {/* <Typography
            sx={{
              position: 'absolute',
              opacity: 0.5,
              left: 14,
              top: 16,
            }}
          >
            {hint}
          </Typography> */}
          <TextField
            {...textFieldProps}
            {...params}
            size='small'
            inputRef={inputRef}
            onChange={(e) => {
              const newValue = e.target.value;
              setHint('');
              const matchingOption = options?.find((option) =>
                option.toLowerCase().startsWith(newValue.toLowerCase().trim()),
              );

              if ((newValue && matchingOption) && !value?.includes(matchingOption)) {
                setHint(matchingOption);
              }
            }}
          />
        </Box>
      )}
      onBlur={() => setHint('')}
      onChange={onChange}
      autoComplete
      options={options ?? []}
      getOptionLabel={(option) => option || ''}
      filterSelectedOptions
      clearIcon={< CloseIcon />}
      onInputChange={(event, value, reason) => {
        if (reason === 'input' && value !== '') {
          setOpen(true);
        } else {
          setOpen(false);
        }
      }}
      open={open}
      onClose={() => setOpen(false)}
      renderTags={(value: readonly string[], getTagProps) => {
        return (
          <div ref={chipsRef}>
            {value.map((option: string, index: number) => (
              // eslint-disable-next-line react/jsx-key
              <Chip
                {...chipProps}
                variant="outlined"
                label={option}
                {...getTagProps({ index })}
                deleteIcon={<CloseIcon />}
                sx={{
                  borderRadius: '8px',
                  backgroundColor: 'whitesmoke',
                  border: '2px solid #79747E',
                  '& .MuiChip-deleteIcon': { color: '#79747E' },
                }}
              />
            ))}
          </div>
        );
      }}
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
}

export default TypeAhead;
