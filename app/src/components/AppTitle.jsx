import { Text } from "preact-i18n";
import { useEffect, useRef } from "preact/hooks";

export function AppTitle(props) {
    const headingRef = useRef();

    useEffect(() => {
        if (!headingRef.current) return;

        headingRef.current.focus();
        document.title = headingRef.current.innerText;
    }, [headingRef.current])

    return (
        <h1 ref={headingRef} tabIndex={-1}>
            {props.title && (
                <>
                    <Text id="app.title">Suno</Text>
                    {' : '}
                    {props.title}
                </>
            )}
            {!props.title && (
                <Text id="app.title">Suno</Text>
            )}
        </h1>
    );
}
