import LacunaWebPki from 'web-pki'
import { actionTypes } from '../store'

/**
 * @module AzDigitalSignature
 * @description The methods must be called in the following order: constructor, loadWebPki,
 * listCertificates, sign.
 *
 * @method constructor requires a Vuex Store instance
 * @method loadWebPki return true if web-pki is installed. If returned false call redirectToInstallWebPki
 * @method listCertificates return list of available certificates in web-pki chrome
 * @method sign sign the document
 */
export default class AzDigitalSignature {
    /**
     * Create a new instance of AzDigitalSignature
     * @constructor
     * @param Object.pki: Object pki is required only for tests.
     * @param Object.store: Vuex Store.
     */
    constructor({ pki, store }) {
        this.store = store
        if (pki) {
            this.pki = pki
        } else {
            this.pki = new LacunaWebPki(this.store.state.loki.flowbee.license)
        }
    }

    /**
     * Start web-pki and return true if installed or return false case not installed.
     * If false call redirectToInstallWebPki
     * @return {void}
     */
    async loadWebPki() {
        return new Promise((resolve, reject) => {
            this.pki.init({
                ready: () => resolve(true),
                notInstalled: () => resolve(false),
                defaultError: (message) => reject(message),
            })
        })
    }

    /**
     * List all available certificates in your chrome plugin.
     * @return Array
     */
    async listCertificates() {
        return new Promise((resolve, reject) => {
            this.pki
                .listCertificates()
                .success((certificates) => {
                    const formatedCertificates = this._formatCertificatesTitles(certificates)
                    resolve(formatedCertificates)
                })
                .error((error) => reject(error))
        })
    }

    /**
     * Sign document
     * @param {String} certificateThumbPrint
     * @param {String} documentId
     * @param {String} rubricBase64 (optional)
     * @param {String} participation (optional)
     * @param {Array} visualPositionings (optional)
     * @param {Array} extraDatas (optional)
     * @return {void}
     */
    async sign(certificateThumbPrint, documentId, rubricBase64 = null, participation = null,
               visualPositionings = null, extraDatas = null) {
        const certificateContent = await this._readCertificate(certificateThumbPrint)

        const paramsToSign = await this._preprareDocumentToSign(certificateContent, documentId)

        const signHash = await this._sign({
            thumbprint: certificateThumbPrint,
            hash: paramsToSign.hashParaAssinar,
            algorithm: paramsToSign.algoritmoHash,
        })

        return await this._finishSign(
            documentId,
            signHash,
            paramsToSign,
            rubricBase64,
            participation,
            visualPositionings,
            extraDatas
        )
    }

    /**
     * Redirect to web-pki installation page
     * @return {void}
     */
    redirectToInstallWebPki() {
        this.pki.redirectToInstallPage()
    }

    async _finishSign(documentId, signHash, paramsToSign, rubricBase64, participation, visualPositionings, extraDatas) {
        return await this.store.dispatch(actionTypes.SIGNATURE.DIGITAL.FINISH, {
            documentId,
            signHash,
            temporarySubscription: paramsToSign.assinaturaTemporariaId,
            rubricBase64,
            participation,
            visualPositionings,
            extraDatas,
        })
    }

    async _preprareDocumentToSign(certificateContent, documentId) {
        return this.store.dispatch(actionTypes.SIGNATURE.DIGITAL.START, {
            certificateContent,
            documentId,
        })
    }

    async _readCertificate(thumbprint) {
        return new Promise((resolve, reject) => {
            this.pki
                .readCertificate(thumbprint)
                .success((informacoesPublicas) => resolve(informacoesPublicas))
                .error((error) => reject(error))
        })
    }

    async _sign({ thumbprint, hash, algorithm }) {
        return new Promise((resolve, reject) => {
            this.pki
                .signHash({
                    thumbprint,
                    hash,
                    digestAlgorithm: algorithm,
                })
                .success((signatureHash) => resolve(signatureHash))
                .error((error) => reject(error))
        })
    }

    _formatCertificatesTitles(certificados) {
        certificados.forEach((certificado) => {
            if (new Date() > certificado.validityEnd) {
                certificado.prettyName = `[EXPIRADO] ${certificado.subjectName} (emitido por ${certificado.issuerName})`
            } else {
                certificado.prettyName = `${certificado.subjectName} (emitido por ${certificado.issuerName})`
            }
        })
        return certificados
    }
}