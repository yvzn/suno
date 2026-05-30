import './LanguageToggle.css'

export function LanguageToggle({ value = 'en', onChange }) {
  return (
    <fieldset class="lang-toggle">
      <legend class="lang-toggle__legend">Language</legend>
      <div class="lang-toggle__option">
        <input
          type="radio"
          id="lang-en"
          name="language"
          value="en"
          class="lang-toggle__input"
          checked={value === 'en'}
          onChange={() => onChange && onChange('en')}
        />
        <label for="lang-en" class="lang-toggle__label">EN</label>
      </div>
      <div class="lang-toggle__option">
        <input
          type="radio"
          id="lang-fr"
          name="language"
          value="fr"
          class="lang-toggle__input"
          checked={value === 'fr'}
          onChange={() => onChange && onChange('fr')}
        />
        <label for="lang-fr" class="lang-toggle__label">FR</label>
      </div>
    </fieldset>
  )
}
