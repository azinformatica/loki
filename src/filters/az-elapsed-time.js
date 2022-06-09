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
        return `${getElapsedTime(refDate, currentTime, 'hours')} ${isOneHour(refDate, currentTime) ? 'hora' : 'horas'}`
    } else if (isLessThanWeek(refDate, currentTime)) {
        return `${getElapsedTime(refDate, currentTime, 'days')} ${isOneDay(refDate, currentTime) ? 'dia' : 'dias'}`
    } else if (isLessThanMonth(refDate, currentTime)) {
        return `${getElapsedTime(refDate, currentTime, 'weeks')} ${
            isOneWeek(refDate, currentTime) ? 'semana' : 'semanas'
        }`
    } else if (isLessThanYear(refDate, currentTime)) {
        return `${getElapsedTime(refDate, currentTime, 'months')} ${isOneMonth(refDate, currentTime) ? 'mês' : 'meses'}`
    } else {
        return `${getElapsedTime(refDate, currentTime, 'years')} ${isOneYear(refDate, currentTime) ? 'ano' : 'anos'}`
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

function isOneHour(refDate, currentTime) {
    return getElapsedTime(refDate, currentTime, 'hours') === 1
}

function isLessThanWeek(refDate, currentTime) {
    return getElapsedTime(refDate, currentTime, 'days') < 7
}

function isOneDay(refDate, currentTime) {
    return getElapsedTime(refDate, currentTime, 'days') === 1
}

function isLessThanMonth(refDate, currentTime) {
    return getElapsedTime(refDate, currentTime, 'weeks') < 4
}

function isOneWeek(refDate, currentTime) {
    return getElapsedTime(refDate, currentTime, 'weeks') === 1
}

function isLessThanYear(refDate, currentTime) {
    return getElapsedTime(refDate, currentTime, 'months') < 12
}

function isOneMonth(refDate, currentTime) {
    return getElapsedTime(refDate, currentTime, 'months') === 1
}

function isOneYear(refDate, currentTime) {
    return getElapsedTime(refDate, currentTime, 'years') === 1
}

function getElapsedTime(refDate, currentTime, unit) {
    return Math.abs(refDate.diff(currentTime, unit))
}

export default filter
