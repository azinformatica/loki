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
