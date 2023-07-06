import { useEffect, useState } from 'preact/hooks';
import { Text } from 'preact-i18n';

import './LocationInput.css';

export function LocationInput(props) {
  const fieldId = `field-${Math.random()}`;
  const [value, setValue] = useState(props.value);

  const onSubmit = (event) => {
    event.preventDefault();
    props.onSubmit(value);
  };

  const onInput = (event) => {
    const { value } = event.target;
    setValue(value);
  };

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const onFocus = (event) => {
    event.target.select()
  }

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor={fieldId}>{props.label}</label>
      <input
        placeholder={props.placeholder}
        id={fieldId}
        value={value}
        onInput={onInput}
        onFocus={onFocus}
      />
      <button type="submit">
        <Text id="directions.search">Search</Text>
      </button>
    </form>
  );
}
