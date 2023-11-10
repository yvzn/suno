import { Text } from 'preact-i18n'

import { formatDurationInMinutes } from '../services/duration'

import './SunPositionTable.css'

// defines the rotation to apply to the SVG icon for every heading from 0 to SECTOR_COUNT, as a CSS transform
const rotationByHeading = [...Array(8)].map((_, i) => (-45 * i - 135) % 360 + 'deg')

// defines the direction label for every heading from 0 to SECTOR_COUNT
const directionByHeading = [
    <Text id="sun.position.heading0">Front Left</Text>,
    <Text id="sun.position.heading1">Left Front</Text>,
    <Text id="sun.position.heading2">Left Rear</Text>,
    <Text id="sun.position.heading3">Rear Left</Text>,
    <Text id="sun.position.heading4">Rear Right</Text>,
    <Text id="sun.position.heading5">Right Rear</Text>,
    <Text id="sun.position.heading6">Right Front</Text>,
    <Text id="sun.position.heading7">Front Right</Text>,
]

export function SunPositionTable(props) {
    const hasValues = props.positions.some(durationInSeconds => durationInSeconds > 0);
    return (
        <section id="position-table">
            {hasValues && (
                <table>
                    <caption>
                        <Text id="sun.position.description">Duration per direction</Text>
                    </caption>
                    <tr>
                        <td></td>
                        <th><Text id="sun.position.direction">Direction</Text></th>
                        <th><Text id="sun.position.duration">Duration</Text></th>
                    </tr>
                    {props.positions.map((durationInSeconds, index) => {
                        if (durationInSeconds > 0)
                            return (
                                <tr key={"position-" + index}>
                                    <td>
                                        <svg
                                            viewBox="0 0 32 32"
                                            style={{ '--heading-rotation': rotationByHeading[index] }}
                                            role="presentation"
                                            aria-labelledby={'direction-' + index}>
                                            <title></title>
                                            <circle r="16" cx="16" cy="16" />
                                        </svg>
                                    </td>
                                    <td id={'direction-' + index}>
                                        {directionByHeading[index]}
                                    </td>
                                    <td>
                                        {formatDurationInMinutes(Math.ceil(durationInSeconds / 60))}
                                    </td>
                                </tr>
                            )
                    })}
                </table>
            )}
            {!hasValues && (
                <p>
                    <Text id="sun.positionsEmpty">No sun</Text>
                </p>
            )}
        </section>
    )
}