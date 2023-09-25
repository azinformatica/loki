const PX_THRESHOLD = 5.0

export default {
    bind(el, binding) {
        let previousScrollTop = el.scrollTop
        let previousScroll = {
            direction: 'none',
            max: false,
        }

        el._scrollHandler = () => {
            const scrollPosition = el.scrollTop

            const maxScroll = el.scrollHeight - el.clientHeight
            const maxScrollThreshold = maxScroll - PX_THRESHOLD

            const minScroll = 0
            const minScrollThreshold = minScroll + PX_THRESHOLD

            const scroll = {
                direction: 'none',
                max: false,
            }

            const isScrollingDown = scrollPosition > previousScrollTop
            if (isScrollingDown) {
                scroll.direction = 'down'
            }
            if (isScrollingDown && scrollPosition >= maxScrollThreshold) {
                scroll.max = true
                el.scrollTop = maxScroll
            }

            const isScrollingUp = scrollPosition < previousScrollTop
            if (isScrollingUp) {
                scroll.direction = 'up'
            }
            if (isScrollingUp && scrollPosition <= minScrollThreshold) {
                scroll.max = true
                el.scrollTop = minScroll
            }

            const modifiers = binding.modifiers
            const hasDirectionModifier = modifiers.down || modifiers.up
            const hasMaxModifier = modifiers.max
            const hasDesiredDirection = !hasDirectionModifier || modifiers[scroll.direction]
            const hasDesiredMax = !hasMaxModifier || scroll.max
            const isScrollingOutsideThreshold = previousScroll.max && scroll.max

            if (hasDesiredDirection && hasDesiredMax && !isScrollingOutsideThreshold) {
                binding.value(scroll)
            }

            previousScrollTop = scrollPosition
            previousScroll = scroll
        }

        el.addEventListener('scroll', el._scrollHandler)
    },
    unbind(el) {
        el.removeEventListener('scroll', el._scrollHandler)
        delete el._scrollHandler
    },
}
