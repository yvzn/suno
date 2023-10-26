import { Text } from 'preact-i18n';

export function ErrorMessage(props) {
  return <>
    {props.error && (
      <section>
        <p>
          <Text id="fetch.error">Error</Text>
        </p>
        <a href="#" onClick={props.onRetry}>
          <Text id="fetch.retry">Retry</Text>
        </a>
      </section>
    )}
  </>;
}
