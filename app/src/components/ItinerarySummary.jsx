import { Text } from "preact-i18n";
import { Link } from "preact-router";

import './ItinerarySummary.css';

export function ItinerarySummary(props) {
    return (
        <section id="itinerary-summary">
            <div>
                <p>
                    <Text
                        id="directions.from"
                        fields={{
                            from: props.from,
                        }}
                    >
                        Itinerary from
                    </Text>
                </p>
                <p>
                    <Text
                        id="directions.to"
                        fields={{
                            to: props.to,
                        }}
                    >
                        to
                    </Text>
                </p>
                {props.startDate && props.startDate !== "now" && (
                    <p>
                        <Text
                            id="directions.leave"
                            fields={{
                                startDate: toDateString(props.startDate),
                                startTime: toTimeString(props.startDate),
                            }}
                        >
                            leaving at
                        </Text>
                    </p>
                )}
            </div>
            <div>
                <Link
                    href={'/journey' + window.location.search}
                >
                    <Text id="sun.editJourney">Edit</Text>
                </Link>
            </div>
        </section>
    );
}

function toDateString(someDate) {
    if (someDate instanceof Date) {
        return new Intl.DateTimeFormat([], { dateStyle: 'short' }).format(someDate);
    }
    return someDate;
}

function toTimeString(someDate) {
    if (someDate instanceof Date) {
        return new Intl.DateTimeFormat([], { timeStyle: 'short' }).format(someDate);
    }
    return someDate;
}
