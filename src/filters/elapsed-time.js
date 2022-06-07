import moment from 'moment-timezone'
import { state } from '../store'

const filter = (date) => {
    if (!date) {
        return ''
    }

    const refDate = getReferenceDate(date)
    const currentTime = getCurrentTime()

    if (isLessThanMinute(refDate, currentTime)) {
        return `${getElapsedTime(refDate, currentTime, 'seconds')} seg.`
    } else if (isLessThanHour(refDate, currentTime)) {
        return `${getElapsedTime(refDate, currentTime, 'minutes')} min.`
    } else if (isLessThanDay(refDate, currentTime)) {
        return `${getElapsedTime(refDate, currentTime, 'hours')} horas`
    } else if (isLessThanWeek(refDate, currentTime)) {
        return `${getElapsedTime(refDate, currentTime, 'days')} dias`
    } else if (isLessThanMonth(refDate, currentTime)) {
        return `${getElapsedTime(refDate, currentTime, 'weeks')} semanas`
    } else if (isLessThanYear(refDate, currentTime)) {
        return `${getElapsedTime(refDate, currentTime, 'months')} meses`
    } else {
        return `${getElapsedTime(refDate, currentTime, 'years')} anos`
    }
}

function getReferenceDate(date) {
    return moment(date).tz(state.timezone)
}

function getCurrentTime() {
    return moment().tz(state.timezone)
}

function isLessThanMinute(refDate, currentTime) {
    return getElapsedTime(refDate, currentTime, 'seconds') < 60
}

function isLessThanHour(refDate, currentTime) {
    return getElapsedTime(refDate, currentTime, 'minutes') < 60
}

function isLessThanDay(refDate, currentTime) {
    return getElapsedTime(refDate, currentTime, 'hours') < 24
}

function isLessThanWeek(refDate, currentTime) {
    return getElapsedTime(refDate, currentTime, 'days') < 7
}

function isLessThanMonth(refDate, currentTime) {
    return getElapsedTime(refDate, currentTime, 'weeks') < 4
}

function isLessThanYear(refDate, currentTime) {
    return getElapsedTime(refDate, currentTime, 'months') < 12
}

function getElapsedTime(refDate, currentTime, unit) {
    return Math.abs(refDate.diff(currentTime, unit))
}

export default filter
