export function formatDurationInSeconds(durationInSeconds) {
    const durationInMinutes = Math.round(durationInSeconds / 60);
    return formatDurationInMinutes(durationInMinutes);
}

export function formatDurationInMinutes(durationInMinutes) {
    if (durationInMinutes > 60) {
        const durationInHours = Math.floor(durationInMinutes / 60)
        return `${durationInHours}h ${durationInMinutes % 60}min`
    }
    if (durationInMinutes < 1) {
        return '< 1min';
    }
    return `${durationInMinutes}min`;
}
