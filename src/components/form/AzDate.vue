<template>
    <v-layout row wrap>
        <v-flex xs12 sm2 d-flex>
            <v-menu
                    ref="menu"
                    :close-on-content-click="false"
                    v-model="menuDate"
                    nudge-right="450"
                    nudge-bottom="120"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    max-width="290px"
                    min-width="290px">
                <v-date-picker v-model="date" no-title @input="pickDateEvent()"
                               v-bind:value="value"
                               v-on:input="updateModelDate($event)"></v-date-picker>
            </v-menu>
            <v-text-field
                    v-model="dateFormatted"
                    label="Date"
                    mask="date"
                    :hint="dateFormat"
                    append-icon="event"
                    v-bind:append-icon-cb="openMenuDate"
                    @blur="validateAndParseDate(dateFormatted);updateModelDate(date);">
            </v-text-field>
        </v-flex>
        <v-flex xs12 sm1 d-flex v-if="dateWithTime">

            <v-menu
                    ref="menu"
                    :close-on-content-click="false"
                    v-model="menuTime"
                    nudge-right="540"
                    nudge-bottom="120"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    max-width="290px"
                    min-width="290px">
                <v-time-picker
                        v-if="menuTime"
                        v-model="time"
                        @change="changeTimeEvent();updateModelTime($event);"
                        format="24hr">
                </v-time-picker>
            </v-menu>
            <v-text-field
                    v-model="timeFormatted"
                    label="Time"
                    mask="time"
                    append-icon="access_time"
                    v-bind:append-icon-cb="openMenuTime"
                    @blur="validateTimeEvent();updateModelTime(time);"
            ></v-text-field>
        </v-flex>
    </v-layout>
</template>
<script>
    export default {
        name: 'AzDate',
        props: {
            dateFormat: {
                type: String,
                default: 'DD/MM/YYYY',
                validator: function (value) {
                    return ['DD/MM/YYYY', 'MM/DD/YYYY'].indexOf(value) !== -1
                }
            },
            dateWithTime: {
                type: Boolean,
                default: false
            },
            value: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                date: null,
                dateFormatted: null,
                time: null,
                timeFormatted: null,
                menuDate: false,
                menuTime: false
            }
        },
        methods: {
            getFormattedDate(day, month, year) {
                const getFnDateFormat = {
                    'DD/MM/YYYY': function () {
                        return `${day}${month}${year}`
                    },
                    'MM/DD/YYYY': function () {
                        return `${month}${day}${year}`
                    }
                }

                return getFnDateFormat[this.dateFormat]()
            },
            formatDate(date) {
                if (!date) return null

                const [year, month, day] = date.split('-')
                return this.getFormattedDate(day, month, year)
            },
            pickDateEvent() {
                this.menuDate = false
                this.dateFormatted = this.formatDate(this.date)
            },
            validateAndParseDate(date) {
                if (!date || !this.dateStringIsValid(date)) {
                    this.date = null
                    this.dateFormatted = ''
                    return
                }

                const dateObj = this.getDayMonthYearFromDateString(date)

                this.date = `${dateObj.year}-${dateObj.month}-${dateObj.day}`
            },
            getDayMonthYearFromDateString(date) {
                const getFnDateFormat = {
                    'DD/MM/YYYY': function () {
                        return {
                            day: date.substring(0, 2),
                            month: date.substring(2, 4),
                            year: date.substring(4, 8)
                        }
                    },
                    'MM/DD/YYYY': function () {
                        return {
                            day: date.substring(2, 4),
                            month: date.substring(0, 2),
                            year: date.substring(4, 8)
                        }
                    }
                }

                return getFnDateFormat[this.dateFormat]()
            },
            dayIsValidForMonthAndYear(day, month, year) {
                let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
                const isLeapYear = (!(year % 4) && year % 100) || !(year % 400)

                if (isLeapYear) {
                    daysInMonth[1] = 29;
                }

                return day > 0 && day <= daysInMonth[--month]
            },
            dateStringIsValid(date) {
                if (date.length < 8)
                    return false

                const dateObj = this.getDayMonthYearFromDateString(date)

                const monthIsValid = Number(dateObj.month) > 0 && Number(dateObj.month) < 13
                const yearIsValid = Number(dateObj.year) > 999

                if (!monthIsValid || !yearIsValid)
                    return false

                return this.dayIsValidForMonthAndYear(Number(dateObj.day), Number(dateObj.month), Number(dateObj.year))
            },
            timeStringIsValid() {
                if (this.timeFormatted.length < 4)
                    return false

                const firstTimeDigit = Number(this.timeFormatted.substring(0, 2))
                const secondTimeDigit = Number(this.timeFormatted.substring(2, 4))

                return firstTimeDigit < 24 && secondTimeDigit < 60
            },
            validateTimeEvent() {
                if (!this.timeStringIsValid()) {
                    this.time = null
                    this.timeFormatted = ''
                    return
                }

                const hour = Number(this.timeFormatted.substring(0, 2))
                const minute = Number(this.timeFormatted.substring(2, 4))

                this.time = hour + ':' + minute
            },
            changeTimeEvent() {
                this.timeFormatted = this.time.replace(':', '')
                this.$refs.menu.save(this.time)
            },
            openMenuDate() {
                this.menuDate = true
            },
            openMenuTime() {
                this.menuTime = true
            },
            updateModelDate(value) {
                if (this.time && value) {
                    this.$emit('input', value + ' ' + this.time)
                    return
                }
                if (this.time && !value) {
                    this.$emit('input', value)
                    return
                }
                if (!this.time)
                    this.$emit('input', value)
            },
            updateModelTime(value) {
                if (this.date && value) {
                    this.$emit('input', this.date + ' ' + value)
                    return
                }
                if (this.date && !value)
                    this.$emit('input', this.date)
            }
        }
    }
</script>
<style scoped lang="stylus">
</style>
