import { Text } from 'preact-i18n';

export function LoadingIndicator(props) {
  return <>{props.isLoading && (
    <section>
      <Text id="fetch.loading">Loading...</Text>
    </section>
  )}</>;
}
