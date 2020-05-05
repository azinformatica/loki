import pdfjs from 'pdfjs-dist/build/pdf'
pdfjs.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/buid/pdf.worker'

class AzPdfJsLib {
    async fetchDocument(src, httpHeader) {
        return await pdfjs.getDocument({
            url: src,
            httpHeaders: httpHeader,
            withCredentials: true
        }).promise
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

    async getFileName(pdf) {
        return pdf._transport._fullReader._filename || 'download.pdf'
    }
}

export default new AzPdfJsLib()
