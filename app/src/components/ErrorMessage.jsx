import { Text } from 'preact-i18n';

import { CustomLink } from './CustomLink';

import './ErrorMessage.css'

export function ErrorMessage(props) {
  const showContactLink = props.showContactLink !== false

  const handleRetryClick = (event) => {
    event.preventDefault();
    if (props.onRetry) props.onRetry();
  }

  const contactHref = '/contact'
    + '?data=' + encodeURIComponent(String(props.error))
    + '&url=' + encodeURIComponent(window.location.href)

  return <section id="error-message">
    <p role="alert">
      {props.error && (
        <Text id="fetch.error"></Text>
      )}
    </p>
    {props.error && (
      <div class="error-actions">
        <button class="btn btn-primary" onClick={handleRetryClick}>
          <Text id="fetch.retry"></Text>
        </button>
        {showContactLink && (
          <CustomLink href={contactHref} className="btn btn-secondary">
            <Text id="contact.title"></Text>
          </CustomLink>
        )}
      </div>
    )}
  </section>;
}
