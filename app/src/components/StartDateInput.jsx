import { useEffect, useState } from 'preact/hooks'
import { Text } from 'preact-i18n'

import './StartDateInput.css'

export function StartDateInput(props) {
    const [selectedOption, setSelectedOption] = useState(props.value === 'now' ? 'now' : 'at')
    const [departureDate, setDepartureDate] = useState(props.value instanceof Date ? props.value : new Date())
    const [startDateString, setStartDateString] = useState(toDateString(departureDate))
    const [startTimeString, setStartTimeString] = useState(toTimeString(departureDate))

    const earliestStartDate = toDateString(new Date())
    const earliestStartTime = isToday(departureDate) ? toTimeString(departureDate) : '00:00'

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value)
        if (e.target.value === 'now') {
            setDepartureDate(new Date())
        }
    }

    const handleDateChange = (e) => {
        const selectedDate = e.target.value
        setStartDateString(selectedDate)
    }

    const handleTimeChange = (e) => {
        const selectedTime = e.target.value
        setStartTimeString(selectedTime)
    }

    useEffect(() => {
        const newDate = new Date(startDateString)
        if (isNaN(newDate)) return

        const [startHourString, startMinuteString] = startTimeString.split(':')

        const newHours = parseInt(startHourString)
        if (isNaN(newHours)) return;

        newDate.setHours(newHours)

        const newMinutes = parseInt(startMinuteString)
        if (isNaN(newMinutes)) return;

        newDate.setMinutes(newMinutes)

        const isAfterEarliestStartDate = startDateString > earliestStartDate
        const isAfterEarliestStartTime = startTimeString >= earliestStartTime
        const isAfterEarliestStart = isAfterEarliestStartDate || isToday(newDate) && isAfterEarliestStartTime
        if (isAfterEarliestStart) {
            setDepartureDate(newDate)
        }
    }, [startDateString, startTimeString])

    useEffect(() => {
        if (selectedOption === 'now') {
            props.onChange('now')
        } else {
            props.onChange(departureDate)
        }
    }, [selectedOption, departureDate])

    const handleValidity = (e) => e.target.reportValidity()

    return (
        <form id="start-date-input">
            <label for="start-at">
                <Text id="journey.departure"></Text>
            </label>
            <select id="start-at" value={selectedOption} onChange={handleOptionChange}>
                <option value="now">
                    <Text id="journey.leaveNow"></Text>
                </option>
                <option value="at">
                    <Text id="journey.leaveAt"></Text>
                </option>
            </select>
            {selectedOption === 'at' && (
                <>
                    <label for="start-date">
                        <Text id="journey.date"></Text>
                    </label>
                    <span>
                        <input
                            id="start-date"
                            type="date"
                            value={startDateString}
                            min={earliestStartDate}
                            onChange={handleDateChange}
                            onBlur={handleValidity}
                            required="required"
                        />
                    </span>
                    <label for="start-time">
                        <Text id="journey.time"></Text>
                    </label>
                    <span>
                        <input
                            id="start-time"
                            type="time"
                            value={startTimeString}
                            min={earliestStartTime}
                            onChange={handleTimeChange}
                            onBlur={handleValidity}
                            required="required"
                        />
                    </span>
                </>
            )}
        </form>
    )
}

function toDateString(someDate) {
    return someDate.getFullYear() + '-' + pad(someDate.getMonth() + 1) + '-' + pad(someDate.getDate())
}

function toTimeString(someDate) {
    return pad(someDate.getHours()) + ':' + pad(someDate.getMinutes())
}

function pad(value) {
    return String(value).padStart(2, '0')
}

function isToday(someDate) {
    const today = new Date()
    return someDate.getDate() == today.getDate() &&
        someDate.getMonth() == today.getMonth() &&
        someDate.getFullYear() == today.getFullYear()
}
