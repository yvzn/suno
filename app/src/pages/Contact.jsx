import { Text, withText } from 'preact-i18n'
import { useCallback, useEffect, useRef, useState } from 'preact/hooks'

import { PageTitle } from '../components/PageTitle'
import { DocumentTitle } from '../components/DocumentTitle'
import { CustomLink } from '../components/CustomLink'
import { LoadingIndicator } from '../components/LoadingIndicator'
import { ErrorMessage } from '../components/ErrorMessage'
import { sendFeedback, sendFeedbackWithRetry } from '../services/api'

import './Contact.css'

const Title = withText('contact.title')(PageTitle)
const SetDocumentTitle = withText('contact.title')(DocumentTitle)

export function Contact() {
  const scoreRef = useRef(null)
  const [hasScore, setHasScore] = useState(false)
  const [includeDetails, setIncludeDetails] = useState(false)
  const [technicalData, setTechnicalData] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [submitState, setSubmitState] = useState('idle') // idle | loading | success | error
  const commentRef = useRef(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const data = params.get('data')
    if (data) {
      setTechnicalData(data)
    }
    const url = params.get('url')
    if (url) {
      setSourceUrl(url)
    }
  }, [])

  const handleScoreChange = useCallback((e) => {
    scoreRef.current = e.target.value
    setHasScore(true)
  }, [])

  const submitFeedback = async (submitFn = sendFeedback) => {
    if (!scoreRef.current) return

    setSubmitState('loading')

    const commentValue = commentRef.current?.value?.trim() || ''

    try {
      const response = await submitFn({
        score: scoreRef.current,
        comment: commentValue || undefined,
        technicalData: technicalData || undefined,
        userAgent: includeDetails ? navigator.userAgent : undefined,
        sourceUrl: sourceUrl || undefined,
      })

      if (response.ok) {
        setSubmitState('success')
      } else {
        setSubmitState('error')
      }
    } catch {
      setSubmitState('error')
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (submitState === 'loading') return;
    submitFeedback();
  }

  const handleRetry = () => {
    submitFeedback(sendFeedbackWithRetry)
  }

  if (submitState === 'success') {
    return (
      <>
        <header>
          <Title />
          <SetDocumentTitle />
        </header>
        <main id="contact">
          <p class="contact-message contact-message-success" role="status">
            <Text id="contact.success"></Text>
          </p>
        </main>
        <footer>
          <CustomLink href="/" className="btn btn-primary">
            <Text id="notFound.home"></Text>
          </CustomLink>
        </footer>
      </>
    )
  }

  return (
    <>
      <header>
        <Title />
        <SetDocumentTitle />
      </header>
      <main id="contact">
        <p id="contact-tagline">
          <Text id="contact.tagline"></Text>
        </p>
        <form onSubmit={handleSubmit} aria-describedby="contact-tagline">
          <fieldset class="contact-score">
            <legend id="contact-score-label">
              <Text id="contact.score.label"></Text>
            </legend>
            <div class="contact-score-buttons">
              <div>
                <input
                  type="radio"
                  id="contact-score-up"
                  name="score"
                  value="up"
                  required
                  onChange={handleScoreChange}
                />
                <label for="contact-score-up">
                  <Text id="contact.score.up"></Text>
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="contact-score-down"
                  name="score"
                  value="down"
                  required
                  onChange={handleScoreChange}
                />
                <label for="contact-score-down">
                  <Text id="contact.score.down"></Text>
                </label>
              </div>
            </div>
          </fieldset>

          <div class="contact-field">
            <label for="contact-comment">
              <Text id="contact.comment.label"></Text>
            </label>
            <textarea
              id="contact-comment"
              ref={commentRef}
            />
          </div>

          {(technicalData || sourceUrl) && (
            <div class="contact-details">
              <div class="contact-details-checkbox">
                <input
                  type="checkbox"
                  id="contact-include-details"
                  checked={includeDetails}
                  onChange={(e) => setIncludeDetails(e.target.checked)}
                />
                <label for="contact-include-details">
                  <Text id="contact.includeDetails"></Text>
                </label>
              </div>
            </div>
          )}

          <LoadingIndicator isLoading={submitState === 'loading'} />
          <ErrorMessage error={submitState === 'error' ? true : undefined} onRetry={handleRetry} showContactLink={false} />

          <div class="contact-actions">
            <button
              type="submit"
              class="btn btn-primary"
            >
              <Text id="contact.submit"></Text>
            </button>
            <CustomLink href="/" className="btn btn-secondary">
              <Text id="contact.cancel"></Text>
            </CustomLink>
          </div>
        </form>
      </main>
    </>
  )
}
