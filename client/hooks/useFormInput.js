import { useState } from 'react';

const useFormInput = (initialState) => {
  const [value, setValue] = useState(initialState);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return { value, onChange: handleChange };
};

export default useFormInput;
