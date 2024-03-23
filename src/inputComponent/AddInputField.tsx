import React, { useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { TextInputField } from './TextInputField';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteIcon from '@mui/icons-material/Delete';

interface AddInputFieldProps {
  onTextFieldsChange: (updatedTextFields: string[]) => void;
  disabled?: boolean,
  values?: string[]
}

const AddInputField: React.FC<AddInputFieldProps> = ({ onTextFieldsChange, disabled, values }) => {
  const [textFields, setTextFields] = useState<string[]>(['', '', '', '', '']);

  const addTextField = () => {
    setTextFields(prevFields => [...prevFields, '']);
  };

  const removeTextField = (index: number) => {
    if (textFields.length == 1) return;
    setTextFields(prevFields => prevFields.filter((_, idx) => idx !== index));
  };

  const handleTextFieldChange = (value: string, index: number) => {
    setTextFields(prevFields => {
      const updatedFields = [...prevFields];
      updatedFields[index] = value;
      return updatedFields;
    });
  };

  // Call the parent function with updated text fields array

  React.useEffect(() => {
    if (values?.length) {
      setTextFields([...values]);
    }
  }, [values]);

  React.useEffect(() => {
    onTextFieldsChange(textFields);
  }, [textFields, onTextFieldsChange]);

  return (
    <Box
      border={1}
      p={2}
      display="flex"
      flexDirection="column"
      className="w-[100%]"
      style={{
        borderStyle: 'dotted',
        borderWidth: 2,
        borderRadius: 8,
        borderColor: '#ccc',
      }}
    >
      <div className="max-h-[230px] overflow-y-auto flex flex-col items-stretch">
        {textFields.map((value, index) => (
          <div key={index} className="flex items-center my-1">
            <TextInputField
              className='w-[75%]'
              value={value}
              label={`Round ${index + 1}`}
              onChange={e => handleTextFieldChange(e.target.value, index)}
              disabled={disabled}
            />
            <div className='flex ml-2 min-w-[15%]'>
              <div>
                {textFields.length > 1 && <IconButton onClick={() => removeTextField(index)} disabled={disabled}>
                  <DeleteIcon />
                </IconButton>}
              </div>
              {index === textFields.length - 1 ? (
                <IconButton onClick={addTextField} disabled={disabled}>
                  <AddOutlinedIcon />
                </IconButton>
              ) : <></>}
            </div>
          </div>
        ))}
      </div>
    </Box>
  );
};

export default AddInputField;
