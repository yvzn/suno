import { Text } from 'preact-i18n';

import { CustomLink } from './CustomLink';

import './HomeLink.css';

export function HomeLink() {
    return (
        <CustomLink href="/" className="home-link">
            <Text id="nav.home"></Text>
        </CustomLink>
    );
}
