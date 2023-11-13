import { useEffect, useState } from 'preact/hooks';
import { Text } from 'preact-i18n';

import './LocationInput.css';

export function LocationInput(props) {
  const fieldId = `field-${Math.random()}`;
  const [nameValue, setNameValue] = useState(props.nameValue);

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

  return (
    <form onSubmit={handleSubmit} className={props.coordValue && 'has-coords'}>
      <label htmlFor={fieldId}>{props.label}</label>
      <span>
        <input
          type="text"
          placeholder={props.placeholder}
          id={fieldId}
          value={nameValue}
          onInput={handleInput}
          onFocus={handleSetFocus}
          enterKeyHint="search"
          autoComplete="street-address"
          required="required"
          disabled={props.disabled}
        />
      </span>
      <button type="submit" disabled={props.disabled}>
        <Text id="directions.search"></Text>
      </button>
    </form>
  );
}
