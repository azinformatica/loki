import StringMask from 'string-mask'

const filter = phone => {
    if (!phone) return 'Não informado'

    phone = phone.replace(/\D+/g, '')

    if (phone.length < 11) {
        return new StringMask('(##) ####-####').apply(phone)
    } else {
        return new StringMask('(##) #####-####').apply(phone)
    }
}

export default filter
