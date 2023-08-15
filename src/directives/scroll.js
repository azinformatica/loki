export default {
    bind(el, binding) {
        let prevScrollTop = el.scrollTop

        el._scrollHandler = () => {
            const scrollPosition = el.scrollTop
            const maxScroll = el.scrollHeight - el.clientHeight
            const minScroll = 0

            const scroll = {}
            scroll.direction = 'none'
            scroll.max = false

            const isScrollingDown = scrollPosition > prevScrollTop
            if (isScrollingDown) {
                scroll.direction = 'down'
                if (scrollPosition >= maxScroll) {
                    scroll.max = true
                }
            }

            const isScrollingUp = scrollPosition < prevScrollTop
            if (isScrollingUp) {
                scroll.direction = 'up'
                if (scrollPosition === minScroll) {
                    scroll.max = true
                }
            }

            prevScrollTop = scrollPosition

            const modifiers = binding.modifiers
            const hasDirectionModifier = modifiers.down || modifiers.up
            const hasMaxModifier = modifiers.max
            const hasDesiredDirection = !hasDirectionModifier || modifiers[scroll.direction]
            const hasDesiredMax = !hasMaxModifier || scroll.max

            if (hasDesiredDirection && hasDesiredMax) {
                binding.value(scroll)
            }
        }

        el.addEventListener('scroll', el._scrollHandler)
    },
    unbind(el) {
        el.removeEventListener('scroll', el._scrollHandler)
        delete el._scrollHandler
    },
}
