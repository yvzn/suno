import { Text } from "preact-i18n";

export function ItinerarySummary(props) {
    return (
        <>
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
        </>
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
