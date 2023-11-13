export function LanguagePicker(props) {
    const handleClick = event => {
        event.preventDefault();
        props.onChange(event.target.dataset.language);
    }

    return (
        <p>
            <a href="#" data-language="en" onClick={handleClick} lang="en">
                English
            </a>
            •
            <a href="#" data-language="fr" onClick={handleClick} lang="fr">
                Français
            </a>
        </p>
    );
}