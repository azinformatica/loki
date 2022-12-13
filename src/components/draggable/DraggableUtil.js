export default class DraggableUtil {
    static RECT_PREFIX = 'rect'
    static RECT_PROPERTIES = ['x', 'y', 'width', 'height']

    static getElementRectRelativeToAnotherElementRect(element, relativeElement) {
        const relativeElementRect = relativeElement.getBoundingClientRect()
        const elementRect = element.getBoundingClientRect()
        return {
            x: Math.round(elementRect.x - relativeElementRect.x),
            y: Math.round(elementRect.y - relativeElementRect.y),
            width: Math.round(elementRect.width),
            height: Math.round(elementRect.height),
        }
    }

    static getElementRectRelativeToParentRect(element) {
        return this.getElementRectRelativeToAnotherElementRect(element, element.parentElement)
    }

    static getAttributeAsInt(element, attributeName) {
        return parseInt(element.getAttribute(attributeName) || 0)
    }

    static getAttributeName(property) {
        return `${this.RECT_PREFIX}-${property}`
    }

    static saveRectAsElementAttributes(element, rect) {
        for (const property of this.RECT_PROPERTIES) {
            const attributeName = this.getAttributeName(property)
            const value = rect[property]
            if (!value) {
                element.removeAttribute(attributeName)
            } else {
                element.setAttribute(attributeName, value)
            }
        }
    }

    static getRectFromElementAttributes(element) {
        const rect = {}
        for (const property of this.RECT_PROPERTIES) {
            const attributeName = this.getAttributeName(property)
            rect[property] = this.getAttributeAsInt(element, attributeName)
        }
        return rect
    }

    static generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0
            const v = c === 'x' ? r : (r & 0x3) | 0x8
            return v.toString(16)
        })
    }

    static createDraggable() {
        return {
            rect: {
                x: null,
                y: null,
                width: null,
                height: null,
            },
            pageNumber: null,
            id: this.generateUUID(),
        }
    }

    static isDraggableElementInsideTargetZoneElement(draggableElement, targetZoneElement) {
        const draggableElementRect = draggableElement.getBoundingClientRect()
        const targetZoneElementRect = targetZoneElement.getBoundingClientRect()
        return (
            draggableElementRect.x >= 0 &&
            draggableElementRect.y >= 0 &&
            draggableElementRect.x + draggableElementRect.width <= targetZoneElementRect.width &&
            draggableElementRect.y + draggableElementRect.height <= targetZoneElementRect.height
        )
    }
}
