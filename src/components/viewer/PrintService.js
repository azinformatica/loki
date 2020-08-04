class PrintService {
    constructor({ pdfDocument, pagesOverview }) {
        this.pdfDocument = pdfDocument
        this.pagesOverview = pagesOverview

        this.currentPage = -1
        this.pageStyleSheet = document.createElement('style')
        this.scratchCanvas = document.createElement('canvas')
        this.printContainer = document.createElement('div')
        this.body = document.querySelector('body')

        this._PRINT_RESOLUTION = 200
        this._PRINT_UNITS = this._PRINT_RESOLUTION / 72.0
        this._CSS_UNITS = 96.0 / 72.0
    }

    async print(renderProgressCb) {
        this._prepareLayout()
        await this._renderPages(renderProgressCb)
        window.print()
        this._destroy()
    }

    _prepareLayout() {
        this._warnIfHasNotEqualPageSizes()

        this.body.setAttribute('data-pdf-printing', true)

        this.printContainer.setAttribute('id', 'print-container')
        this.body.appendChild(this.printContainer)

        const pageSize = this.pagesOverview[0]
        this.pageStyleSheet.textContent =
            '@supports ((size:A4) and (size:1pt 1pt)) {' +
            `@page { size: ${pageSize.width}pt ${pageSize.height}pt }` +
            '}'
        this.body.appendChild(this.pageStyleSheet)
    }

    // eslint-disable-next-line no-unused-vars
    async _renderPages(cb = (currentPage, pageCount) => {}) {
        const renderNextPage = async () => {
            if (++this.currentPage >= this.pagesOverview.length) return

            cb(this.currentPage + 1, this.pagesOverview.length)

            await this._renderPage(this.currentPage + 1, this.pagesOverview[this.currentPage])
            await this._useRenderedPage()
            await renderNextPage()
        }

        return await renderNextPage()
    }

    _destroy() {
        this.body.removeAttribute('data-pdf-printing')

        this.body.removeChild(this.printContainer)
        this.printContainer.textContent = ''

        this.body.removeChild(this.pageStyleSheet)
        this.pageStyleSheet.textContent = ''

        this.scratchCanvas.width = this.scratchCanvas.height = 0
    }

    async _renderPage(pageNumber, size) {
        this.scratchCanvas.width = Math.floor(size.width * this._PRINT_UNITS)
        this.scratchCanvas.height = Math.floor(size.height * this._PRINT_UNITS)

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
    }

    _useRenderedPage() {
        const img = document.createElement('img')

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
            // eslint-disable-next-line no-console
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
