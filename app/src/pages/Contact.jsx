import { Text, withText } from 'preact-i18n'
import { useEffect, useState } from 'preact/hooks'

import { PageTitle } from '../components/PageTitle'
import { DocumentTitle } from '../components/DocumentTitle'
import { CustomLink } from '../components/CustomLink'
import { sendFeedback } from '../services/api'

import './Contact.css'

const Title = withText('contact.title')(PageTitle)
const SetDocumentTitle = withText('contact.title')(DocumentTitle)

export function Contact() {
  const [score, setScore] = useState(null)
  const [comment, setComment] = useState('')
  const [includeDetails, setIncludeDetails] = useState(false)
  const [technicalData, setTechnicalData] = useState('')
  const [submitState, setSubmitState] = useState('idle') // idle | loading | success | error

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const data = params.get('data')
    if (data) {
      setTechnicalData(data)
    }
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!score) return

    setSubmitState('loading')

    let technicalPayload = technicalData || undefined
    if (includeDetails) {
      const details = [technicalData, navigator.userAgent].filter(Boolean).join(' | ')
      technicalPayload = details || undefined
    }

    try {
      const response = await sendFeedback({
        score,
        comment: comment.trim() || undefined,
        technicalData: technicalPayload,
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
          <div class="contact-score">
            <p id="contact-score-label">
              <Text id="contact.score.label"></Text>
            </p>
            <div class="contact-score-buttons" role="group" aria-labelledby="contact-score-label">
              <button
                type="button"
                aria-pressed={score === 'up'}
                onClick={() => setScore('up')}
              >
                <Text id="contact.score.up"></Text>
              </button>
              <button
                type="button"
                aria-pressed={score === 'down'}
                onClick={() => setScore('down')}
              >
                <Text id="contact.score.down"></Text>
              </button>
            </div>
          </div>

          <div class="contact-field">
            <label for="contact-comment">
              <Text id="contact.comment.label"></Text>
            </label>
            <textarea
              id="contact-comment"
              value={comment}
              onInput={(e) => setComment(e.target.value)}
            />
          </div>

          {technicalData && (
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

          {submitState === 'error' && (
            <p class="contact-message contact-message-error" role="alert">
              <Text id="contact.error"></Text>
            </p>
          )}

          <button
            type="submit"
            class="btn btn-primary"
            disabled={!score || submitState === 'loading'}
          >
            <Text id="contact.submit"></Text>
          </button>
        </form>
      </main>
      <footer>
        <CustomLink href="/" className="btn btn-secondary">
          <Text id="notFound.home"></Text>
        </CustomLink>
      </footer>
    </>
  )
}
