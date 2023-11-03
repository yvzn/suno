import { useEffect, useRef, useState } from 'preact/hooks';
import { Text } from 'preact-i18n';

export function StartDateInput(props) {
    const [selectedOption, setSelectedOption] = useState(props.value === 'now' ? 'now' : 'at');
    const [departureDate, setDepartureDate] = useState(props.value instanceof Date ? props.value : new Date());
    const startDateInputRef = useRef();
    const startTimeInputRef = useRef();

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
        if (startDateInputRef.current) startDateInputRef.current.focus();
    };

    const handleDateChange = (e) => {
        const newDate = new Date(e.target.value);
        newDate.setHours(departureDate.getHours());
        newDate.setMinutes(departureDate.getMinutes());
        setDepartureDate(newDate);
        if (startTimeInputRef.current) startTimeInputRef.current.focus();
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

    return (
        <form>
            <label>
                <select value={selectedOption} onChange={handleOptionChange}>
                    <option value="now">
                        <Text id="journey.leaveNow">Leave now</Text>
                    </option>
                    <option value="at">
                        <Text id="journey.leaveAt">Leave at ...</Text>
                    </option>
                </select>
            </label>
            {selectedOption === 'at' && (
                <>
                    <label for="start-date">
                        <Text id="journey.date">Date:</Text>
                    </label>
                    <span>
                        <input
                            id="start-date"
                            type="date"
                            value={departureDate.getFullYear() + '-' + pad(departureDate.getMonth() + 1) + '-' + pad(departureDate.getDate())}
                            onChange={handleDateChange}
                            ref={startDateInputRef}
                        />
                    </span>
                    <label for="start-time">
                        <Text id="journey.time">Time:</Text>
                    </label>
                    <span>
                        <input
                            id="start-time"
                            type="time"
                            value={pad(departureDate.getHours()) + ':' + pad(departureDate.getMinutes())}
                            onChange={handleTimeChange}
                            ref={startTimeInputRef}
                        />
                    </span>
                </>
            )}
        </form>
    );
}

function pad(value) {
    return String(value).padStart(2, '0')
}