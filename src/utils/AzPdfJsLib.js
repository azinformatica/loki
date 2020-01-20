import pdfjs from 'pdfjs-dist/build/pdf'
pdfjs.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/buid/pdf.worker'

class AzPdfJsLib {
    async fetchDocument(src) {
        return await pdfjs.getDocument(src).promise
    }

    async getPages(pdf) {
        let promises = []
        for (let page = 1; page <= pdf.numPages; page++) promises.push(pdf.getPage(page))
        return Promise.all(promises)
    }

    getPageContainer(page, scale) {
        return page.getViewport({ scale })
    }

    async renderPage({ page, scale, canvasContext }) {
        let viewport = page.getViewport({ scale })
        await page.render({ canvasContext, viewport }).promise
    }
}

export default new AzPdfJsLib()