import { useEffect, useState, useRef } from 'preact/hooks';
import { Text } from 'preact-i18n';

import './LocationInput.css';

export function LocationInput(props) {
  const fieldId = `field-${Math.random()}`;
  const [nameValue, setNameValue] = useState(props.nameValue);
  const inputRef = useRef();

  const handleSubmit = (event) => {
    event.preventDefault();
    props.onChange(nameValue);
  };

  const handleInput = (event) => {
    const { value: newValue } = event.target;
    setNameValue(newValue);
  };

  useEffect(() => {
    setNameValue(props.nameValue);
  }, [props.nameValue]);

  const handleSetFocus = (event) => {
    event.target.select();
  };

  useEffect(
    () => {
      if (props.autoFocus && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      };
    },
    [props.autoFocus]
  );

  return (
    <form onSubmit={handleSubmit} className={props.coordValue && 'has-coords'}>
      <label htmlFor={fieldId}>{props.label}</label>
      <span>
        <input
          placeholder={props.placeholder}
          id={fieldId}
          value={nameValue}
          ref={inputRef}
          onInput={handleInput}
          onFocus={handleSetFocus}
        />
      </span>
      <button type="submit">
        <Text id="directions.search">Search</Text>
      </button>
    </form>
  );
}
