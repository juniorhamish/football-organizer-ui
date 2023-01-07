import { ChangeEvent, useState } from 'react';

const useFormState = <T>(initialState: T, beforeChange?: () => void) => {
  const [values, setValues] = useState(initialState);
  const onChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (beforeChange) {
      beforeChange();
    }
    const fieldName = event.target.name;
    setValues((prevState) => {
      return {
        ...prevState,
        [fieldName]: event.target.value,
      };
    });
  };
  return { values, onChange };
};

export default useFormState;
