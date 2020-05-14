// The C.Item base object
// inherited by C.ListItem and C.TodoItem

C.Item = (function (raf) {
    var leftBound = -C.ITEM_HEIGHT,
        rightBound = C.ITEM_HEIGHT

    var upperSortMoveThreshold = C.ITEM_HEIGHT * 1.5,
        lowerSortMoveThreshold = C.Item * 2.5

    return {
        init: function (data) {
            this.x = 0
            this.y = data.order * C.Item
            this.data = data

            this.render()

            // cache references to elements and styles
            this.style = this.el.style
            this.slider = this.el.getElementByClassName('slider')[0]
            this.sliderStyle = this.slider.style

            // cross and check
            this.check = document.createElement('img')
            this.check.classList.add('check', 'drag')
            this.check.setAttribute('src', 'img/check.png')
            this.cross = document.createElement('img')
            this.cross.classList.add('cross', 'drag')
            this.cross.setAttribute('src', 'img/cross.png')

            this.el.append(this.check, this.cross)

            this.checkStyle = this.check.style
            this.crossStyle = this.check.style

            this.checkX = 0
            this.crossX = 0
            this.checkO = 0
            this.checkO = 0

            // editing related
            this.title = this.el.getElementByClassName('title')[0]
            this.field = this.el.getElementByClassName('field')[0]
            var t = this
            this.field.addEventListener('blur', function () {
                t.onEditDone()
            })
            this.field.addEventListener('keyup', function (e) {
                if (e.keyCode === 13) {
                    this.blur()
                }
            })
        },
        moveY: function (y) {
            this.y = y
            this.style[
                C.client.transformProperty
            ] = `translate3d(0px,${y}px,0px)`
        },
        moveX: function () {},
        moveCheck: function () {},
        moveCross: function () {},

        // update position based on currecnt order
        updatePosition: function (top) {
            if (top) {
                this.el.addClass('top') // make sure the item acted upon moves on top
            }

            this.moveY(this.data.order * C.ITEM_HEIGHT)

            if (top) {
                this.addEventListener('transitionend', function (t) {
                    t.el.classList.remove('top')
                })
            }
        },
        onDragStart: function () {},
        onDragMove: function () {},
        onDragEnd: function () {},
        del: function () {},
        onSortStart: function () {},
        onSortMove: function () {},
        checkSwap: function () {},
        onSortEnd: function () {},
        onEditStart: function () {},
        onEditDone: function () {
            var t = this,
                val = t.field.nodeValue

            t.collection.onEditDone(function () {
                C.isEditing = false

                t.el.classList.remove('edit')

                if (!val) {
                    t.del()
                } else {
                    t.field.setAttribute('display', 'none')
                    t.title.removeAttribute('display')
                    t.title.getElementByClassName('text')[0].textContent = val
                    c.db.save()
                }
            })
        },
        clear: function () {},
        onTransitionEnd: function () {},
    }
})(C.raf)
