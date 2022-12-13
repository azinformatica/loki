class DraggableUtil {
    constructor() {
        this.RECT_PROPERTIES = ['x', 'y', 'width', 'height']
        this.RECT_ATTRIBUTES = ['rect-x', 'rect-y', 'rect-width', 'rect-height']

        this.TARGET_ZONE_ITEM_ID_ATTRIBUTE = 'target-zone-item-id'
    }

    getElementRectRelativeToAnotherElementRect(element, relativeElement) {
        const relativeElementRect = relativeElement.getBoundingClientRect()
        const elementRect = element.getBoundingClientRect()
        return {
            x: Math.round(elementRect.x - relativeElementRect.x),
            y: Math.round(elementRect.y - relativeElementRect.y),
            width: Math.round(elementRect.width),
            height: Math.round(elementRect.height),
        }
    }

    getAttributeAsInt(element, attributeName) {
        return parseInt(element.getAttribute(attributeName) || 0)
    }

    saveRectAsElementAttributes(element, rect) {
        if (!rect) return
        this.RECT_ATTRIBUTES.forEach((attribute, attributeIndex) => {
            const property = this.RECT_PROPERTIES[attributeIndex]
            const value = rect[property]
            this.saveAttributeIfExists(element, attribute, value)
        })
    }

    saveTargetZoneItemIdAsElementAttribute(element, targetZoneItemId) {
        this.saveAttributeIfExists(element, this.TARGET_ZONE_ITEM_ID_ATTRIBUTE, targetZoneItemId)
    }

    getTargetZoneItemIdFromElementAttribute(element) {
        return element.getAttribute(this.TARGET_ZONE_ITEM_ID_ATTRIBUTE)
    }

    saveAttributeIfExists(element, attribute, value) {
        if (value == null) {
            element.removeAttribute(attribute)
        } else {
            element.setAttribute(attribute, value)
        }
    }

    getRectFromElementAttributes(element) {
        const rect = {}
        this.RECT_ATTRIBUTES.forEach((attribute, attributeIndex) => {
            const property = this.RECT_PROPERTIES[attributeIndex]
            rect[property] = this.getAttributeAsInt(element, attribute)
        })
        return rect
    }

    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0
            const v = c === 'x' ? r : (r & 0x3) | 0x8
            return v.toString(16)
        })
    }

    createDraggable() {
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

    isElementInsideAnotherElement(element, relativeElement) {
        const elementRect = element.getBoundingClientRect()
        const relativeElementRect = relativeElement.getBoundingClientRect()
        console.log({ elementRect })
        console.log({ relativeElementRect })
        return (
            elementRect.x >= relativeElementRect.x &&
            elementRect.y >= relativeElementRect.y &&
            elementRect.x + elementRect.width <= relativeElementRect.x + relativeElementRect.width &&
            elementRect.y + elementRect.height <= relativeElementRect.y + relativeElementRect.height
        )
    }
}

export default new DraggableUtil()