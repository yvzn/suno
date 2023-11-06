import { Text } from 'preact-i18n';

export function ErrorMessage(props) {
  const handleRetryClick = (event) => {
    event.preventDefault();
    props.onRetry();
  }

  return <>
    {props.error && (
      <section>
        <p>
          <Text id="fetch.error">Error</Text>
        </p>
        <a href="#" onClick={handleRetryClick}>
          <Text id="fetch.retry">Retry</Text>
        </a>
      </section>
    )}
  </>;
}
