import { useEffect, useRef } from "preact/hooks"

export function PageTitle(props) {
    const headingRef = useRef();

    useEffect(() => {
        if (!headingRef.current) return;
        headingRef.current.focus();
    }, [headingRef.current])

    return (<h1 ref={headingRef} tabIndex={-1}>
        {props.title}
    </h1>)
}