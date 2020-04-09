import LacunaWebPki from 'web-pki'
import { actionTypes } from '../store'

export default class AzDigitalSignature {
    constructor({pki, store}) {
        this.store = store
        if (pki) {
            this.pki = pki
        } else {
            this.pki = new LacunaWebPki(this.store.state.loki.flowbee.license)
        }
    }

    async loadWebPki() { // iniciar
        return new Promise((resolve, reject) => {
            this.pki.init({
                ready: () => resolve(true),
                notInstalled: () => resolve(false),
                defaultError: message => reject(message)
            })
        })
    }

    async listCertificates() { //listarCertificados
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

    async sign(certificateThumbPrint, documentId) { // finalizarAssinaturaDigital

        const certificateContent = await this._readCertificate(certificateThumbPrint)

        const paramsToSign = await this._preprareDocumentToSign(certificateContent, documentId);

        const signHash = await this._pkiSign(certificateThumbPrint, paramsToSign);

        await this._finishSign(documentId, signHash, paramsToSign);
    }

    redirectToInstallWebPki() { //redirecionarParaInstalacaoWebPki
        this.pki.redirectToInstallPage()
    }

    async _finishSign(documentId, signHash, paramsToSign) {
        await this.store.dispatch(actionTypes.SIGNATURE.DIGITAL.FINISH, {
            documentId: documentId,
            signHash: signHash,
            temporarySubscription: paramsToSign.assinaturaTemporariaId
        })
    }

    async _pkiSign(certificateThumbPrint, paramsToSign) {
        return this._assinar({
            thumbprint: certificateThumbPrint,
            hash: paramsToSign.hashParaAssinar,
            algoritmo: paramsToSign.algoritmoHash
        })
    }

    async _preprareDocumentToSign(certificateContent, documentId) {
        return this.store.dispatch(actionTypes.SIGNATURE.DIGITAL.START, {
            certificadoConteudo: certificateContent,
            documentId: documentId
        })
    }

    async _readCertificate(thumbprint) {
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
