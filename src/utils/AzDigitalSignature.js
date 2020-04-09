import LacunaWebPki from 'web-pki'
import { actionTypes } from '../store'

export default class AzDigitalSignature {
    constructor({pki, store}) {
        this.store = store
        if (pki) {
            this.pki = pki
        } else {
            this.pki = new LacunaWebPki(this.store.flowbee.license)
        }
    }

    async iniciar() {
        return new Promise((resolve, reject) => {
            this.pki.init({
                ready: () => resolve(true),
                notInstalled: () => resolve(false),
                defaultError: message => reject(message)
            })
        })
    }

    async listarCertificados() {
        return new Promise((resolve, reject) => {
            this.pki
                .listCertificates()
                .success(certificados => {
                    const certificadosFormatados = this._formatarApresentacaoCertificados(certificados)
                    resolve(certificadosFormatados)
                })
                .error(error => reject(error))
        })
    }

    //todo: melhorar esse método
    async finalizarAssinaturaDigital(certificadoThumbprint, documentoId) {
        const certificadoConteudo = await this._lerChavePublicaCertificado(certificadoThumbprint)

        const assinatura = await this.store.dispatch(actionTypes.ASSINATURA.DIGITAL.INICIAR, {
            certificadoConteudo: certificadoConteudo,
            documentoId: documentoId
        })

        const hashAssinatura = await this._assinar({
            thumbprint: certificadoThumbprint,
            hash: assinatura.hashParaAssinar,
            algoritmo: assinatura.algoritmoHash
        })

        await this.store.dispatch(actionTypes.ASSINATURA.DIGITAL.FINALIZAR, {
            documentoId: documentoId,
            assinatura: hashAssinatura,
            assinaturaTemporariaId: assinatura.assinaturaTemporariaId
        })
    }

    redirecionarParaInstalacaoWebPki() {
        this.pki.redirectToInstallPage()
    }

    async _lerChavePublicaCertificado(thumbprint) {
        return new Promise((resolve, reject) => {
            this.pki
                .readCertificate(thumbprint)
                .success(informacoesPublicas => resolve(informacoesPublicas))
                .error(error => reject(error))
        })
    }

    async _assinar({ thumbprint, hash, algoritmo }) {
        return new Promise((resolve, reject) => {
            this.pki
                .signHash({
                    thumbprint,
                    hash,
                    digestAlgorithm: algoritmo
                })
                .success(hashAssinatura => resolve(hashAssinatura))
                .error(error => reject(error))
        })
    }

    _formatarApresentacaoCertificados(certificados) {
        certificados.forEach(certificado => {
            if (new Date() > certificado.validityEnd) {
                certificado.prettyName = `[EXPIRADO] ${certificado.subjectName} (emitido por ${certificado.issuerName})`
            } else {
                certificado.prettyName = `${certificado.subjectName} (emitido por ${certificado.issuerName})`
            }
        })
        return certificados
    }
}
