import { useEffect, useState } from 'preact/hooks';
import { Text } from 'preact-i18n';

import './StartDateInput.css'

export function StartDateInput(props) {
    const [selectedOption, setSelectedOption] = useState(props.value === 'now' ? 'now' : 'at');
    const [departureDate, setDepartureDate] = useState(props.value instanceof Date ? props.value : new Date());

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
        if (e.target.value === 'now') {
            setDepartureDate(new Date());
        }
    };

    const handleDateChange = (e) => {
        const newDate = new Date(e.target.value);
        newDate.setHours(departureDate.getHours());
        newDate.setMinutes(departureDate.getMinutes());
        setDepartureDate(newDate);
    };

    const handleTimeChange = (e) => {
        const selectedTime = e.target.value;
        const [hours, minutes] = selectedTime.split(':');
        departureDate.setHours(parseInt(hours));
        departureDate.setMinutes(parseInt(minutes));
        setDepartureDate(new Date(departureDate));
    };

    useEffect(() => {
        if (selectedOption === 'now') {
            props.onChange('now');
        } else {
            props.onChange(departureDate);
        }
    }, [selectedOption, departureDate]);

    const earliestStartDate = toDateString(new Date());
    const earliestStartTime = isToday(departureDate) ? toTimeString(departureDate) : '00:00';

    return (
        <form id="start-date-input">
            <label for="start-at">
                <Text id="journey.departure">Departure:</Text>
            </label>
            <select id="start-at" value={selectedOption} onChange={handleOptionChange}>
                <option value="now">
                    <Text id="journey.leaveNow">Leave now</Text>
                </option>
                <option value="at">
                    <Text id="journey.leaveAt">Leave at ...</Text>
                </option>
            </select>
            {selectedOption === 'at' && (
                <>
                    <label for="start-date">
                        <Text id="journey.date">Date:</Text>
                    </label>
                    <span>
                        <input
                            id="start-date"
                            type="date"
                            value={toDateString(departureDate)}
                            min={earliestStartDate}
                            onChange={handleDateChange}
                            required="required"
                        />
                    </span>
                    <label for="start-time">
                        <Text id="journey.time">Time:</Text>
                    </label>
                    <span>
                        <input
                            id="start-time"
                            type="time"
                            value={toTimeString(departureDate)}
                            min={earliestStartTime}
                            onChange={handleTimeChange}
                            required="required"
                        />
                    </span>
                </>
            )}
        </form>
    );
}

function toDateString(someDate) {
    return someDate.getFullYear() + '-' + pad(someDate.getMonth() + 1) + '-' + pad(someDate.getDate());
}

function toTimeString(someDate) {
    return pad(someDate.getHours()) + ':' + pad(someDate.getMinutes());
}

function pad(value) {
    return String(value).padStart(2, '0')
}

function isToday(someDate) {
    const today = new Date();
    return someDate.getDate() == today.getDate() &&
        someDate.getMonth() == today.getMonth() &&
        someDate.getFullYear() == today.getFullYear()
}
