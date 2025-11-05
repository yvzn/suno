// https://joshuatz.com/posts/2021/deploy-preact-from-subdirectory/

import { Link } from 'preact-router';

export function CustomLink(props) {
    const href = `${import.meta.env.VITE_APP_BASE}${props.href}`;
    const { href: _, ...propsWithoutHref } = props;

    return (
        <Link href={href} {...propsWithoutHref} />
    );
}
