import { Text } from 'preact-i18n';

import './ErrorMessage.css'

export function ErrorMessage(props) {
  const handleRetryClick = (event) => {
    event.preventDefault();
    props.onRetry();
  }

  return <section id="error-message">
    <p role="alert">
      {props.error && (
        <Text id="fetch.error"></Text>
      )}
    </p>
    {props.error && (
      <button class="btn btn-primary" onClick={handleRetryClick}>
        <Text id="fetch.retry"></Text>
      </button>
    )}
  </section>;
}
