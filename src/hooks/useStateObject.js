import { useState } from 'react';

const useStateObject = (value = {}) => {
    const [state, setState] = useState(value);
    const [update, setUpdate] = useState(true);
    return [
        state,
        (newValue) => {
            setState(newValue);
            setUpdate(!update);
        },
    ];
};

export default useStateObject;
