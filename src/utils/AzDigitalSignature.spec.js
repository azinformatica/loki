import AzDigitalSignature from './AzDigitalSignature'

describe('AzDigitalSignature', () => {
    let pkiMock, assinatura

    it('Deve retornar true ao executar o método init - ready', async () => {
        pkiMock = {
            init({ ready }) {
                return ready()
            }
        }
        assinatura = new AzDigitalSignature({ pki: pkiMock })
        const resposta = await assinatura.loadWebPki()

        expect(resposta).toBeTruthy()
    })

    it('Deve retornar false ao executar o método init - extenão não instalada', async () => {
        pkiMock = {
            init({ notInstalled }) {
                return notInstalled()
            }
        }
        assinatura = new AzDigitalSignature({ pki: pkiMock })
        const resposta = await assinatura.loadWebPki()

        expect(resposta).toBeFalsy()
    })

    it('Deve retornar erro ao executar o método init - erro na execução', async () => {
        pkiMock = {
            init({ defaultError }) {
                return defaultError('erro ao iniciar')
            }
        }
        assinatura = new AzDigitalSignature({ pki: pkiMock })

        await expect(assinatura.loadWebPki()).rejects.toEqual('erro ao iniciar')
    })

    it('Deve listar os certificados corretamente', async () => {
        const listaCertificados = [
            {
                thumbprint: '1',
                subjectName: 'Certificado',
                issuerName: 'ICP BR',
                validityEnd: new Date('Thu Jan 12 3000 18:20:00 GMT-0400')
            },
            {
                thumbprint: '2',
                subjectName: 'Certificado 2',
                issuerName: 'ICP BR',
                validityEnd: new Date('Thu Jan 12 2017 18:20:00 GMT-0400')
            }
        ]
        pkiMock = {
            listCertificates() {
                return {
                    success(fn) {
                        fn(listaCertificados)
                    },
                    error() {

                    }
                }
            }
        }
        assinatura = new AzDigitalSignature({ pki: pkiMock })
        const certificados = await assinatura.listCertificates()

        expect(certificados[0].thumbprint).toEqual(listaCertificados[0].thumbprint)
        expect(certificados[0].subjectName).toEqual(listaCertificados[0].subjectName)
        expect(certificados[0].issuerName).toEqual(listaCertificados[0].issuerName)
        expect(certificados[0].prettyName).toEqual('Certificado (emitido por ICP BR)')
        expect(certificados[1].prettyName).toEqual('[EXPIRADO] Certificado 2 (emitido por ICP BR)')
    })

    it('Deve retornar a chave publica de um certificado', async () => {
        pkiMock = {
            readCertificate(certificado) {
                return {
                    success(fn) {
                        fn(`chave publica do certificado ${certificado}`)
                    },
                    error() {

                    }
                }
            }
        }
        assinatura = new AzDigitalSignature({ pki: pkiMock })
        const chave = await assinatura._readCertificate(123)

        expect(chave).toEqual('chave publica do certificado 123')
    })

    it('Deve retornar o hash de assinatura', async () => {
        pkiMock = {
            signHash() {
                return {
                    success(fn) {
                        fn('hash de assinatura')
                    },
                    error() {

                    }
                }
            }
        }
        assinatura = new AzDigitalSignature({ pki: pkiMock })
        const hash = await assinatura._assinar({ thumbprint: '1', hash: 'hash backend do lacuna', algoritmo: 'algum' })

        expect(hash).toEqual('hash de assinatura')
    })

    it('Deve redirecionar para página de instalação do pki', async () => {
        pkiMock = {
            redirectToInstallPage: jest.fn()
        }
        assinatura = new AzDigitalSignature({ pki: pkiMock })
        assinatura.redirectToInstallWebPki()

        expect(pkiMock.redirectToInstallPage).toHaveBeenCalledTimes(1)
    })
})
