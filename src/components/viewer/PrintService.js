class PrintService {
    constructor({ pdfDocument, pagesOverview }) {
        this.pdfDocument = pdfDocument
        this.pagesOverview = pagesOverview

        this.active = null
        this.currentPage = -1
        this.pageStyleSheet = document.createElement('style')
        this.scratchCanvas = document.createElement('canvas')
        this.printContainer = document.createElement('div')
        this.body = document.querySelector('body')

        // The size of the canvas in pixels for printing.
        this._PRINT_RESOLUTION = 200
        this._PRINT_UNITS = this._PRINT_RESOLUTION / 72.0
        this._CSS_UNITS = 96.0 / 72.0
    }

    layout() {
        this._warnIfHasNotEqualPageSizes()

        this.body.setAttribute('data-pdfjsprinting', true)

        this.printContainer.setAttribute('id', 'print-container')
        this.body.appendChild(this.printContainer)

        let pageSize = this.pagesOverview[0]
        this.pageStyleSheet.textContent =
            '@supports ((size:A4) and (size:1pt 1pt)) {' +
            '@page { size: ' +
            pageSize.width +
            'pt ' +
            pageSize.height +
            'pt;}' +
            '}'
        this.body.appendChild(this.pageStyleSheet)
    }

    destroy() {
        this.body.removeAttribute('data-pdfjsprinting')
        this.body.removeChild(this.printContainer)

        this.body.removeChild(this.pageStyleSheet)
        this.pageStyleSheet = null

        this.printContainer.textContent = ''

        this.scratchCanvas.width = this.scratchCanvas.height = 0
        this.scratchCanvas = null

        this.active = null
    }

    async renderPages(cb = (currentPage, pageCount) => {}) {
        const pageCount = this.pagesOverview.length

        const renderNextPage = async () => {
            if (++this.currentPage >= pageCount) {
                return
            }

            cb(this.currentPage + 1, pageCount)

            const index = this.currentPage
            const printItem = await this._renderPage(index + 1, this.pagesOverview[index])
            await this._useRenderedPage(printItem)

            await renderNextPage()
        }

        return await renderNextPage()
    }

    async _renderPage(pageNumber, size) {
        // The size of the canvas in pixels for printing.
        this.scratchCanvas.width = Math.floor(size.width * this._PRINT_UNITS)
        this.scratchCanvas.height = Math.floor(size.height * this._PRINT_UNITS)

        // The physical size of the img as specified by the PDF document.
        const width = Math.floor(size.width * this._CSS_UNITS) + 'px'
        const height = Math.floor(size.height * this._CSS_UNITS) + 'px'

        const ctx = this.scratchCanvas.getContext('2d')
        ctx.save()
        ctx.fillStyle = 'rgb(255, 255, 255)'
        ctx.fillRect(0, 0, this.scratchCanvas.width, this.scratchCanvas.height)
        ctx.restore()

        const pdfPage = await this.pdfDocument.getPage(pageNumber)
        const renderContext = {
            canvasContext: ctx,
            transform: [this._PRINT_UNITS, 0, 0, this._PRINT_UNITS, 0, 0],
            viewport: pdfPage.getViewport(1, size.rotation),
            intent: 'print'
        }
        await pdfPage.render(renderContext).promise

        return { width, height }
    }

    _useRenderedPage(printItem) {
        const img = document.createElement('img')
        // img.setAttribute('style', `width: ${printItem.width}; height: ${printItem.height}`)

        if ('toBlob' in this.scratchCanvas) {
            this.scratchCanvas.toBlob(blob => {
                img.src = URL.createObjectURL(blob)
            })
        } else {
            img.src = this.scratchCanvas.toDataURL()
        }

        const wrapper = document.createElement('div')
        wrapper.appendChild(img)
        this.printContainer.appendChild(wrapper)

        return new Promise((resolve, reject) => {
            img.onload = resolve
            img.onerror = reject
        })
    }

    _warnIfHasNotEqualPageSizes() {
        if (!this._hasEqualPageSizes()) {
            console.warn('Not all pages have the same size. The printed result may be incorrect!')
        }
    }

    _hasEqualPageSizes() {
        return this.pagesOverview.every(
            page => page.width === this.pagesOverview[0].width && page.height === this.pagesOverview[0].height
        )
    }
}

export default PrintService
