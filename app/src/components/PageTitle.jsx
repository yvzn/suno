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

    return (
        <>
            <h1 ref={headingRef} tabIndex={-1} {...ariaAttributes}>
                {props.title}
            </h1>
        </>
    )
}
