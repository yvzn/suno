import { Text } from "preact-i18n"
import { useState } from "preact/hooks"

import './LanguagePicker.css'

export function LanguagePicker(props) {
    const [language, setLanguage] = useState(props.value)

    const selectLanguage = event => {
        event.preventDefault()
        setLanguage(event.target.value)
        props.onChange(event.target.value)
    }

    return (
        <form id="language-picker">
            <div>
                <Text id="home.language"></Text>
            </div>
            <div>
                <label for="language-en" lang="en">
                    <input type="radio" name="language" id="language-en" onChange={selectLanguage} value="en" required checked={language == 'en'} />
                    English
                </label>
            </div>
            <div>
                <label for="language-fr" lang="fr">
                    <input type="radio" name="language" id="language-fr" onChange={selectLanguage} value="fr" required checked={language == 'fr'} />
                    Français
                </label>
            </div>
        </form>
    )
}