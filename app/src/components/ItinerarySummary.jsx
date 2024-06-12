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
                    ></Text>
                </p>
                <p>
                    <Text
                        id="directions.to"
                        fields={{
                            to: props.to,
                        }}
                    ></Text>
                </p>
                {props.startDate && props.startDate !== "now" && (
                    <p>
                        <Text
                            id="directions.leave"
                            fields={{
                                startDate: toDateString(props.startDate),
                                startTime: toTimeString(props.startDate),
                            }}
                        ></Text>
                    </p>
                )}
            </div>
            <div>
                <Link
                    href={'/journey' + window.location.search}
                    className="btn btn-secondary"
                >
                    <span class="visually-hidden on-large-device">
                        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                            <path d="M15.7279 9.57627L14.3137 8.16206L5 17.4758V18.89H6.41421L15.7279 9.57627ZM17.1421 8.16206L18.5563 6.74785L17.1421 5.33363L15.7279 6.74785L17.1421 8.16206ZM7.24264 20.89H3V16.6473L16.435 3.21231C16.8256 2.82179 17.4587 2.82179 17.8492 3.21231L20.6777 6.04074C21.0682 6.43126 21.0682 7.06443 20.6777 7.45495L7.24264 20.89Z"></path>
                        </svg>
                    </span>
                    <span class="visually-hidden on-small-device"><Text id="sun.editJourney"></Text></span>
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
