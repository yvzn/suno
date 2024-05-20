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
                <input type="radio" name="language" id="language-en" onChange={selectLanguage} value="en" required checked={language=='en'} />
                <label for="language-en" lang="en">English</label>
            </div>
            <div>
                <input type="radio" name="language" id="language-fr" onChange={selectLanguage} value="fr" required checked={language=='fr'}/>
                <label for="language-fr" lang="fr">Français</label>
            </div>
        </form>
    )
}