import { Text } from "preact-i18n"
import { useEffect, useRef } from "preact/hooks"

import './DocumentTitle.css'

/**
 * Update the title displayed in browser tab / window
 */
export function DocumentTitle(props) {
    const docTitleRef = useRef()

    useEffect(() => {
        if (!docTitleRef.current) return
        document.title = docTitleRef.current.innerText
    }, [docTitleRef.current, props.title])

    return (
        <>
            <h2 ref={docTitleRef} aria-hidden="true">
                {props.title}
                {' - '}
                <Text id="app.title"></Text>
            </h2>
        </>
    )
}
