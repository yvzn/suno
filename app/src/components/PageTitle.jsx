import { useEffect, useRef } from "preact/hooks"

export function PageTitle(props) {
    const headingRef = useRef()

    useEffect(() => {
        if (!headingRef.current) return
        headingRef.current.focus()
    }, [headingRef.current])

    const ariaAttributes = { 'aria-live': 'polite' };
    if (props['aria-describedby']) {
        ariaAttributes['aria-describedby'] = props['aria-describedby'];
    }

    const goToHomePage = () => {
        // use onClick instead of a link, to avoid breaking accessibility focus flow
        window.location.href = import.meta.env.VITE_APP_BASE;
    }

    return (
        <>
            <h1 ref={headingRef} tabIndex={-1} onClick={goToHomePage} className="pointer" {...ariaAttributes}>
                {props.title}
            </h1>
        </>
    )
}
