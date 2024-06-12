import { useEffect, useState } from 'preact/hooks'
import { Text } from 'preact-i18n'

import './LocationInput.css'

export function LocationInput(props) {
  const fieldId = `field-${Math.random()}`
  const tooltipId = `tooltip-${Math.random()}`
  const [nameValue, setNameValue] = useState(props.nameValue)

  const handleSubmit = (event) => {
    event.preventDefault()
    props.onChange(nameValue)
  }

  const handleInput = (event) => {
    const { value: newValue } = event.target
    setNameValue(newValue)
  }

  useEffect(() => {
    setNameValue(props.nameValue)
  }, [props.nameValue])

  const handleSetFocus = (event) => {
    event.target.select()
  }

  return (
    <search>
      <form onSubmit={handleSubmit} className={'location-input ' + (props.coordValue && 'has-coords')} tabIndex={-1} ref={props.forwardRef}>
        <label htmlFor={fieldId}>{props.label}</label>
        <input
          type="search"
          placeholder={props.placeholder}
          id={fieldId}
          value={nameValue}
          onInput={handleInput}
          onFocus={handleSetFocus}
          enterKeyHint="search"
          autoComplete="street-address"
          required="required"
          spellCheck={false}
          disabled={props.disabled}
          aria-describedby={tooltipId}
        />
        <div id={tooltipId} role="tooltip">
          <Text id="journey.locationTooltip"></Text>
        </div>
        <button type="submit" disabled={props.disabled} className={props.primary ? 'btn btn-primary' : 'btn btn-secondary'}>
          <span class="visually-hidden on-large-device">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
              <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
            </svg>
          </span>
          <span class="visually-hidden on-small-device"><Text id="journey.search"></Text></span>
        </button>
      </form>
    </search>
  )
}
