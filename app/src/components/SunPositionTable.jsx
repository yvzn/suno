import { Text } from 'preact-i18n'

import { formatDurationInMinutes } from '../services/duration'

import './SunPositionTable.css'

// defines the rotation to apply to the SVG icon for every heading (N, E, S, W), as a CSS transform
const rotationByHeading = ['-135deg', '-225deg', '-315deg', '-45deg']

// defines the direction label for every heading (N, E, S, W)
const labelsByHeading = [
    <Text id="sun.position.heading0"></Text>,
    <Text id="sun.position.heading1"></Text>,
    <Text id="sun.position.heading2"></Text>,
    <Text id="sun.position.heading3"></Text>,
]

export function SunPositionTable(props) {
    const hasValues = props.positions.some(durationInSeconds => durationInSeconds > 0);

    if (!hasValues) {
        return (<section id="sun-position-table">
            <p>
                <Text id="sun.positionsEmpty"></Text>
            </p>
        </section>)
    }

    return (
        <section id="sun-position-table">
            <table>
                <caption>
                    <Text id="sun.position.description"></Text>
                </caption>
                <tr>
                    <td></td>
                    <th><Text id="sun.position.direction"></Text></th>
                    <th><Text id="sun.position.duration"></Text></th>
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
                                    {labelsByHeading[index]}
                                </td>
                                <td>
                                    {formatDurationInMinutes(Math.round(durationInSeconds / 60))}
                                </td>
                            </tr>
                        )
                })}
            </table>
        </section>
    )
}