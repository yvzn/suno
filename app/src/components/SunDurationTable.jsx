import { Text } from 'preact-i18n'

import { formatDurationInMinutes } from '../services/duration'

import './SunDurationTable.css'

export function SunDurationTable({ totalDurationInSeconds, durationWithSunInSeconds }) {
    if (totalDurationInSeconds === null || totalDurationInSeconds === undefined) return null;

    const durationWithoutSunInSeconds = totalDurationInSeconds - durationWithSunInSeconds;
    const hasNighttime = durationWithoutSunInSeconds > 0;

    return (
        <section id="sun-duration-table">
            <table>
                <caption>
                    <Text id="sun.duration.description"></Text>
                </caption>
                <tbody>
                    <tr>
                        <td></td>
                        <th scope="col"><Text id="sun.position.duration"></Text></th>
                    </tr>
                    <tr>
                        <th scope="row"><Text id="sun.duration.total"></Text></th>
                        <td>{formatDurationInMinutes(Math.round(totalDurationInSeconds / 60))}</td>
                    </tr>
                    {hasNighttime && (
                        <>
                            <tr>
                                <th scope="row"><Text id="sun.duration.withSun"></Text></th>
                                <td>{formatDurationInMinutes(Math.round(durationWithSunInSeconds / 60))}</td>
                            </tr>
                            <tr>
                                <th scope="row"><Text id="sun.duration.withoutSun"></Text></th>
                                <td>{formatDurationInMinutes(Math.round(durationWithoutSunInSeconds / 60))}</td>
                            </tr>
                        </>
                    )}
                </tbody>
            </table>
        </section>
    )
}
