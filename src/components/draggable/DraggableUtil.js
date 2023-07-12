import UUIDUtil from '../../utils/UUIDUtil'

class DraggableUtil {
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

    generateUUID() {
        return UUIDUtil.generateUUID()
    }

    isElementInsideAnotherElement(element, relativeElement) {
        const elementRect = element.getBoundingClientRect()
        const relativeElementRect = relativeElement.getBoundingClientRect()
        return (
            elementRect.x >= relativeElementRect.x &&
            elementRect.y >= relativeElementRect.y &&
            elementRect.x + elementRect.width <= relativeElementRect.x + relativeElementRect.width &&
            elementRect.y + elementRect.height <= relativeElementRect.y + relativeElementRect.height
        )
    }

    round(number) {
        return Math.round((number + Number.EPSILON) * 10000) / 10000
    }
}

export default new DraggableUtil()
