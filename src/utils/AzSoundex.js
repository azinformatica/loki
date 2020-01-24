import soundex from 'soundex'
import stringSimilarity from 'string-similarity'

class AzSoundex {
    gerarSoundex(str, longFormat) {
        return soundex(str, longFormat === true)
    }

    selecionarMaisParecido(listaSoundex, codigoSoundex) {
        return stringSimilarity.findBestMatch(codigoSoundex, listaSoundex)
    }
}

export default new AzSoundex()
