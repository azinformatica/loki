import moment from 'moment-timezone'
import store from '@/commons/store'

const filter = (date, format = 'DD/MM/YYYY') => {
    if (date) {
        return moment(date).tz(store.state.loki.timezone).format(format)
    }
    return '-'
}

export default filter
