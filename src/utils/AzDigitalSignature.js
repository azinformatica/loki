import LacunaWebPki from 'web-pki'
import { actionTypes } from '../store'

// eslint-disable-next-line max-len
const _license = 'AkAAY29tZXJjaWFsLmNsbS5lZmNhei5jb20uYnIsaG9tLmNsbS5lZmNhei5jb20uYnIsd3d3LmVmY2F6LmNvbS5icm4AYXBwLWNsbS5lZmNhei5jb20uYnIsYXBwLXNpZ24uZWZjYXouY29tLmJyLGlwNDoxMC4wLjAuMC84LGlwNDoxMjcuMC4wLjAvOCxpcDQ6MTcyLjE2LjAuMC8xMixpcDQ6MTkyLjE2OC4wLjAvMTYDAFBybwAAAAGt1zPH8daw9s2OYnuTo4eipGD/zJr438EiNx0emQvnSkqfLwaK2Kfeyi+dRzf32wiuBrfx4UNg9vZd71H5PMg9ZafgkRrIcVVcgBXJfUdlMWIKMGqcdt/4/0H+uoBdV0SwqX3fiFsV0m3/Lh47YWBwkvX35hWM4gq6se/8c+CiDFA7Qp312F1RIoCtvmggovdIjHx6mMMUvt3SA8fC2os+NTRH/QzN7b5G1YNz2Z4rXi8J6MQQsapiIDo+qXjIRN0rCZZd5++23t8Uq/oGrIjZXtK/3BGRNArIUWpJ1NFqovXgO9d0R3a3g2UYUOpCxpfuzDYD4JbnaUmSIeo9GAjz'

export default class AzDigitalSignature {
    constructor({pki, store}) {
        this.store = store
        if (pki) {
            this.pki = pki
        } else {
            this.pki = new LacunaWebPki(_license)
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
