import { useState } from 'react'
import { useLang } from '../../contexts/LanguageContext'
import { REPO_URL } from '../../version'
import './FeedbackPage.css'

const CATEGORIES = ['bug', 'feature', 'usability', 'data', 'other']
const RATING_LABELS = { 1: 'poor', 2: 'fair', 3: 'good', 4: 'veryGood', 5: 'excellent' }

function buildIssueUrl({ category, rating, description, contact, lang }) {
  const title = `[${category.toUpperCase()}] TravelMate feedback — ${rating}/5`
  const body = [
    `## Feedback`,
    '',
    `**Category:** ${category}`,
    `**Rating:** ${'★'.repeat(rating)}${'☆'.repeat(5 - rating)} (${rating}/5)`,
    `**Language:** ${lang}`,
    '',
    `### Description`,
    description || '_(no description)_',
    '',
    contact ? `### Contact\n${contact}` : '',
    '---',
    '_Submitted from TravelMate feedback form_',
  ].filter(Boolean).join('\n')
  return `${REPO_URL}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`
}

export function FeedbackPage() {
  const { t, lang } = useLang()
  const [category, setCategory] = useState('')
  const [rating, setRating] = useState(0)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [description, setDescription] = useState('')
  const [contact, setContact] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const canSubmit = category && rating > 0 && description.trim().length >= 10

  function handleSubmit(e) {
    e.preventDefault()
    if (!canSubmit) return
    const url = buildIssueUrl({ category, rating, description, contact, lang })
    window.open(url, '_blank', 'noopener,noreferrer')
    setSubmitted(true)
  }

  function handleReset() {
    setCategory('')
    setRating(0)
    setDescription('')
    setContact('')
    setSubmitted(false)
  }

  if (submitted) {
    return (
      <div className="fb">
        <div className="fb__card fb__card--success">
          <div className="fb__success-icon">✅</div>
          <h2 className="fb__success-title">{t.feedbackThanks || 'Thank you for your feedback!'}</h2>
          <p className="fb__success-sub">{t.feedbackThanksSub || 'Your feedback has been opened as a GitHub issue. We appreciate your contribution to making TravelMate better.'}</p>
          <button className="fb__btn fb__btn--primary" onClick={handleReset}>
            {t.submitAnother || 'Submit Another'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fb">
      <div className="fb__card">
        <h1 className="fb__title">{t.feedbackTitle || 'Share Your Feedback'}</h1>
        <p className="fb__subtitle">{t.feedbackSubtitle || 'Help us improve TravelMate for all Hyderabad commuters.'}</p>

        <form onSubmit={handleSubmit} className="fb__form">
          {/* Category */}
          <fieldset className="fb__field">
            <legend className="fb__label">{t.feedbackCategory || 'Category'} *</legend>
            <div className="fb__categories">
              {CATEGORIES.map(cat => {
                const icons = { bug: '🐞', feature: '💡', usability: '🎨', data: '📊', other: '💬' }
                const labels = {
                  bug: t.fbCatBug || 'Bug Report',
                  feature: t.fbCatFeature || 'Feature Request',
                  usability: t.fbCatUsability || 'Usability',
                  data: t.fbCatData || 'Data Issue',
                  other: t.fbCatOther || 'Other',
                }
                return (
                  <button
                    key={cat}
                    type="button"
                    className={`fb__cat-btn${category === cat ? ' fb__cat-btn--active' : ''}`}
                    onClick={() => setCategory(cat)}
                  >
                    <span className="fb__cat-icon">{icons[cat]}</span>
                    <span className="fb__cat-label">{labels[cat]}</span>
                  </button>
                )
              })}
            </div>
          </fieldset>

          {/* Rating */}
          <fieldset className="fb__field">
            <legend className="fb__label">{t.feedbackRating || 'Overall Experience'} *</legend>
            <div className="fb__rating" role="radiogroup" aria-label={t.feedbackRating || 'Rating'}>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  className={`fb__star${(hoveredStar || rating) >= star ? ' fb__star--filled' : ''}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  aria-label={`${star} ${t.starLabel || 'stars'}`}
                >
                  ★
                </button>
              ))}
              {rating > 0 && (
                <span className="fb__rating-label">
                  {t[RATING_LABELS[rating]] || RATING_LABELS[rating]}
                </span>
              )}
            </div>
          </fieldset>

          {/* Description */}
          <div className="fb__field">
            <label className="fb__label" htmlFor="fb-desc">
              {t.feedbackDescription || 'Description'} *
            </label>
            <textarea
              id="fb-desc"
              className="fb__textarea"
              rows={5}
              minLength={10}
              placeholder={t.feedbackDescPlaceholder || 'Tell us what happened, what you expected, or what feature you\'d like to see...'}
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
            <span className="fb__hint">{t.feedbackMinChars || 'Minimum 10 characters'}</span>
          </div>

          {/* Contact (optional) */}
          <div className="fb__field">
            <label className="fb__label" htmlFor="fb-contact">
              {t.feedbackContact || 'Contact (optional)'}
            </label>
            <input
              id="fb-contact"
              className="fb__input"
              type="text"
              placeholder={t.feedbackContactPlaceholder || 'Email or phone — only if you want a response'}
              value={contact}
              onChange={e => setContact(e.target.value)}
            />
          </div>

          {/* Submit */}
          <div className="fb__actions">
            <button
              type="submit"
              className="fb__btn fb__btn--primary"
              disabled={!canSubmit}
            >
              {t.feedbackSubmit || 'Submit Feedback'}
            </button>
            {!canSubmit && (
              <span className="fb__validation">
                {t.feedbackRequired || 'Please fill in category, rating, and description (10+ chars)'}
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Info card */}
      <div className="fb__info">
        <h3 className="fb__info-title">{t.feedbackHowItWorks || 'How it works'}</h3>
        <ul className="fb__info-list">
          <li>{t.feedbackInfo1 || 'Your feedback opens a GitHub issue in our repository'}</li>
          <li>{t.feedbackInfo2 || 'Our team reviews every submission'}</li>
          <li>{t.feedbackInfo3 || 'You can track progress on the issue page'}</li>
        </ul>
        <p className="fb__info-links">
          <a href={`${REPO_URL}/issues`} target="_blank" rel="noopener noreferrer" className="fb__link">
            {t.feedbackViewIssues || 'View all issues'} →
          </a>
        </p>
      </div>
    </div>
  )
}
