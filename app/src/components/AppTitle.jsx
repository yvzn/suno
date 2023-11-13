import { Text } from "preact-i18n";
import { useEffect, useRef } from "preact/hooks";

export function AppTitle(props) {
    const headingRef = useRef();
    const docTitleRef = useRef();

    useEffect(() => {
        if (!headingRef.current) return;
        headingRef.current.focus();
    }, [headingRef.current])

    useEffect(() => {
        if (!docTitleRef.current) return;
        docTitleRef.current.style.display = 'none';
        document.title = docTitleRef.current.innerText;
    }, [docTitleRef.current])

    return (
        <>
            <h1 ref={headingRef} tabIndex={-1} aria-live="polite">
                {props.title || (
                    <Text id="app.title"></Text>
                )}
            </h1>
            <h2 ref={docTitleRef} aria-hidden="true">
                {props.title && (
                    <>
                        <Text id="app.title"></Text>
                        {' : '}
                        {props.title}
                    </>
                )}
                {!props.title && (
                    <Text id="app.title"></Text>
                )}
            </h2>
        </>
    );
}
