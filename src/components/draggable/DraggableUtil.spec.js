import DraggableUtil from '@/components/draggable/DraggableUtil'

describe('DraggableUtil.spec.js', () => {
    describe('getElementRectRelativeToAnotherElementRect', () => {
        it('Should return the rect relative to another element', () => {
            const element = document.createElement('div')
            element.getBoundingClientRect = jest.fn(() => ({ x: 15, y: 15, width: 0, height: 0 }))

            const relativeElement = document.createElement('div')
            relativeElement.getBoundingClientRect = jest.fn(() => ({ x: 10, y: 10, width: 0, height: 0 }))

            const rect = DraggableUtil.getElementRectRelativeToAnotherElementRect(element, relativeElement)

            expect(rect.x).toBe(5)
            expect(rect.y).toBe(5)
        })
    })

    describe('getAttributeAsInt', () => {
        it('Should return element attribute as integer', () => {
            const element = document.createElement('div')
            element.setAttribute('test-integer', 10)

            const elementAttributeAsInt = DraggableUtil.getAttributeAsInt(element, 'test-integer')

            expect(elementAttributeAsInt).toBe(10)
        })
    })

    describe('saveRectAsElementAttributes', () => {
        it('Should save a rect as element attributes', () => {
            const element = document.createElement('div')
            const rect = { x: 5, y: 5, width: 100, height: 100 }

            DraggableUtil.saveRectAsElementAttributes(element, rect)

            DraggableUtil.RECT_ATTRIBUTES.forEach((attribute, attributeIndex) => {
                const property = DraggableUtil.RECT_PROPERTIES[attributeIndex]
                const value = String(rect[property])
                expect(element.getAttribute(attribute)).toEqual(value)
            })
        })
    })

    describe('saveTargetZoneItemIdAsElementAttribute', () => {
        it('Should save target zone item as element attribute', () => {
            const element = document.createElement('div')
            const targetZoneItemId = 'target-zone-item-id-spec'

            DraggableUtil.saveTargetZoneItemIdAsElementAttribute(element, targetZoneItemId)

            expect(element.getAttribute(DraggableUtil.TARGET_ZONE_ITEM_ID_ATTRIBUTE)).toEqual(targetZoneItemId)
        })
    })

    describe('getTargetZoneItemIdFromElementAttribute', () => {
        it('Should return target zone item from element attribute', () => {
            const element = document.createElement('div')
            const targetZoneItemId = 'target-zone-item-id-spec'
            element.setAttribute(DraggableUtil.TARGET_ZONE_ITEM_ID_ATTRIBUTE, targetZoneItemId)

            const value = DraggableUtil.getTargetZoneItemIdFromElementAttribute(element)

            expect(value).toEqual(targetZoneItemId)
        })
    })

    describe('saveAttributeIfExists', () => {
        it('Should save existing attribute', () => {
            const element = document.createElement('div')
            const attributeName = 'attribute-name-spec'
            const attributeValue = 'attribute-value-spec'

            DraggableUtil.saveAttributeIfExists(element, attributeName, attributeValue)

            expect(element.getAttribute(attributeName)).toEqual(attributeValue)
        })

        it('Should not save attribute that has null or undefined values', () => {
            const element = document.createElement('div')
            const attributeName = 'attribute-name-spec'
            const attributeValue = null

            DraggableUtil.saveAttributeIfExists(element, attributeName, attributeValue)

            expect(element.getAttribute(attributeName)).toBeNull()
        })
    })

    describe('getRectFromElementAttributes', () => {
        it('Should return rect from element attributes', () => {
            const element = document.createElement('div')
            const rectSaved = { x: 5, y: 5, width: 100, height: 100 }
            DraggableUtil.saveRectAsElementAttributes(element, rectSaved)

            const rectReturned = DraggableUtil.getRectFromElementAttributes(element)

            expect(rectReturned.x).toBe(5)
            expect(rectReturned.y).toBe(5)
            expect(rectReturned.width).toBe(100)
            expect(rectReturned.height).toBe(100)
        })
    })

    describe('isElementInsideAnotherElement', () => {
        it('Should return true if element is inside another element', () => {
            const element = document.createElement('div')
            element.getBoundingClientRect = jest.fn(() => ({ x: 50, y: 50, width: 25, height: 25 }))

            const relativeElement = document.createElement('div')
            relativeElement.getBoundingClientRect = jest.fn(() => ({ x: 0, y: 0, width: 100, height: 100 }))

            const isElementInsideAnotherElement = DraggableUtil.isElementInsideAnotherElement(element, relativeElement)

            expect(isElementInsideAnotherElement).toBeTruthy()
        })

        it('Should return false if element is outside another element', () => {
            const element = document.createElement('div')
            element.getBoundingClientRect = jest.fn(() => ({ x: 50, y: 50, width: 60, height: 60 }))

            const relativeElement = document.createElement('div')
            relativeElement.getBoundingClientRect = jest.fn(() => ({ x: 0, y: 0, width: 100, height: 100 }))

            const isElementInsideAnotherElement = DraggableUtil.isElementInsideAnotherElement(element, relativeElement)

            expect(isElementInsideAnotherElement).toBeFalsy()
        })
    })
})
