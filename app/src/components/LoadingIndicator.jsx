import { Text } from 'preact-i18n';

export function LoadingIndicator(props) {
  return <section role="status">{props.isLoading && (
      <Text id="fetch.loading"></Text>
  )}</section>;
}
