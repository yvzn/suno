import { useEffect, useState, useRef } from 'preact/hooks';
import { Text } from 'preact-i18n';

import './LocationInput.css';

export function LocationInput(props) {
  const fieldId = `field-${Math.random()}`;
  const [nameValue, setNameValue] = useState(props.nameValue);
  const inputRef = useRef();

  const onSubmit = (event) => {
    event.preventDefault();
    props.onChange(nameValue);
  };

  const onInput = (event) => {
    const { value: newValue } = event.target;
    setNameValue(newValue);
  };

  useEffect(() => {
    setNameValue(props.nameValue);
  }, [props.nameValue]);

  const onFocus = (event) => {
    event.target.select();
  };

  useEffect(
    () => props.autoFocus && inputRef.current && inputRef.current.focus(),
    [props.autoFocus]
  );

  return (
    <form onSubmit={onSubmit} className={props.coordValue && 'has-coords'}>
      <label htmlFor={fieldId}>{props.label}</label>
      <span>
        <input
          placeholder={props.placeholder}
          id={fieldId}
          value={nameValue}
          ref={inputRef}
          onInput={onInput}
          onFocus={onFocus}
        />
      </span>
      <button type="submit">
        <Text id="directions.search">Search</Text>
      </button>
    </form>
  );
}
