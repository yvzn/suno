import { Text } from 'preact-i18n';

import { CustomLink } from './CustomLink';

import './ErrorMessage.css'

export function ErrorMessage(props) {
  const handleRetryClick = (event) => {
    event.preventDefault();
    props.onRetry();
  }

  const contactHref = props.error
    ? '/contact?data=' + encodeURIComponent(String(props.error))
    : '/contact'

  return <section id="error-message">
    <p role="alert">
      {props.error && (
        <Text id="fetch.error"></Text>
      )}
    </p>
    {props.error && (
      <>
        <button class="btn btn-primary" onClick={handleRetryClick}>
          <Text id="fetch.retry"></Text>
        </button>
        <CustomLink href={contactHref} className="btn btn-secondary">
          <Text id="contact.title"></Text>
        </CustomLink>
      </>
    )}
  </section>;
}
