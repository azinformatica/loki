import moment from 'moment-timezone'
import { state } from '../store'

const filter = (date, format = 'DD/MM/YYYY') => {
    if (date) {
        return moment(date).tz(state.timezone).format(format)
    }
    return '-'
}

export default filter
