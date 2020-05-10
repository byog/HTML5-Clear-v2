;(function () {
    /**
     * @inner
     * @var {Number}
     * @default 354
     * @name TodoItem~baseH
     */
    var baseH = 354,
        /**
         * @inner
         * @var {Number}
         * @default 100
         * @name TodoItem~baseS
         */
        baseS = 100,
        /**
         * @inner
         * @var {Number}
         * @default 46
         * @name TodoItem~baseL
         */
        baseL = 46,
        /**
         * @inner
         * @var {Number}
         * @default 7
         * @name TodoItem~stepH
         */
        stepH = 7,
        /**
         * @inner
         * @var {Number}
         * @default 2
         * @name TodoItem~stepL
         */
        stepL = 2,
        /**
         * @inner
         * @var {Number}
         * @default 7
         * @name TodoItem~maxColorSpan
         */
        maxColorSpan = 7,
        /**
         * @inner
         * @var {Number}
         * @default stepH * maxColorSpan
         * @name TodoItem~spanH
         */
        spanH = stepH * maxColorSpan,
        /**
         * @inner
         * @var {Number}
         * @default stepL * maxColorSpan
         * @name TodoItem~spanL
         */
        spanL = stepL * maxColorSpan

    /**
     * @inner
     * @var {Number}
     * @default -C.ITEM_HEIGHT
     * @name TodoItem~leftBound
     */
    var leftBound = -C.ITEM_HEIGHT,
        /**
         * @inner
         * @var {Number}
         * @default C.ITEM_HEIGHT
         * @name TodoItem~rightBound
         */
        rightBound = C.ITEM_HEIGHT

    /**
     * @classdesc app's todoitem
     * @constructor TodoItem
     * @param data
     * @extends C
     */
    C.TodoItem = function (data) {
        this.base = C.Item
        this.h = baseH
        this.s = baseS
        this.l = baseL

        this.base.init.apply(this, arguments)
    }

    /**
     * @lends TodoItem
     */
    C.TodoItem.prototype = {
        /**
         * @static
         * @var {*}
         * @default C.Item
         */
        __proto__: C.Item,

        /**
         * @function
         * @static
         */
        render: function () {
            this.el = $(
                '<div class="item todo-item' +
                    (this.data.done ? ' done' : '') +
                    '" style="z-index:' +
                    this.data.order +
                    '">\
                    <div class="slider">\
                        <div class="inner">\
                            <span class="title">\
                                <span class="text">' +
                    this.data.title +
                    '</span>\
                                <span class="line"></span>\
                            </span>\
                            <input class="field" type="text" value="' +
                    this.data.title +
                    '">\
                        </div>\
                    </div>\
                </div>'
            )

            this.lineStyle = this.el.find('.line')[0].style
            if (this.data.done) this.lineStyle.width = '100%'
        },

        /**
         * @function
         * @static
         * @param {*} order
         */
        updateColor: function (order) {
            var o = order || this.data.order,
                n = this.collection.count,
                sH = stepH,
                sL = stepL

            if (n > maxColorSpan && !order) {
                sH = spanH / n
                sL = spanL / n
            }

            this.sliderStyle.backgroundColor =
                'hsl(' +
                (baseH + o * sH) +
                ',' +
                (o ? baseS - 10 : baseS) +
                '%,' +
                (baseL + o * sL) +
                '%)'
        },

        /**
         * @function
         * @static
         */
        onTap: function () {
            if (!this.data.done) {
                this.onEditStart()
            } else {
                // tapping on a done item is equal to tapping on the collection
                this.collection.onTap()
            }
        },

        /**
         * @function
         * @static
         * @param {*} dx
         */
        onDragMove: function (dx) {
            var w = (
                Math.min(1, Math.max(0, this.x / C.ITEM_HEIGHT)) * 100
            ).toFixed(2)
            this.lineStyle.width = (this.data.done ? 100 - w : w) + '%'

            if (this.x >= rightBound) {
                if (!this.activated) {
                    this.activated = true
                    if (this.data.done) {
                        this.updateColor(
                            Math.min(this.data.order, maxColorSpan)
                        )
                        this.el.removeClass('done')
                    } else {
                        this.el.addClass('green')
                    }
                }
            } else {
                if (this.activated) {
                    this.activated = false
                    if (this.data.done) {
                        this.el.addClass('done')
                    } else {
                        this.el.removeClass('green')
                    }
                }
            }

            this.base.onDragMove.apply(this, arguments)
        },

        /**
         * @function
         * @static
         */
        onDragEnd: function () {
            if (this.x < rightBound) {
                if (this.data.done) {
                    this.lineStyle.width = '100%'
                } else {
                    this.lineStyle.width = '0%'
                }
            }

            this.base.onDragEnd.apply(this)
        },

        /**
         * @function
         * @static
         */
        onSortEnd: function () {
            if (!this.data.done) {
                if (this.data.order >= this.collection.count) {
                    // dragged into done zone
                    this.beDone()
                }
            } else {
                if (this.data.order < this.collection.count) {
                    // dragged back into undone zone!
                    this.unDone()
                }
            }

            this.base.onSortEnd.apply(this)
        },

        /**
         * @function
         * @static
         */
        done: function () {
            // this is todoItem specific

            if (!this.data.done) {
                //modify state
                this.beDone()

                //move myself
                var at = this.data.order
                this.data.order = this.collection.count
                this.updatePosition(true)

                //move others
                this.collection.collapseAt(at, this)
            } else {
                this.unDone()

                //float this one up from done ones, this is a todoCollection only method.
                this.collection.floatUp(this)
            }

            C.db.save()
        },
        /**
         * @function
         * @static
         */
        beDone: function () {
            this.data.done = true
            this.lineStyle.width = '100%'
            this.el.removeClass('green').addClass('done')
            this.collection.count--
            this.collection.updateCount()
        },

        /**
         * @function
         * @static
         */
        unDone: function () {
            this.data.done = false
            this.lineStyle.width = '0%'
            this.el.removeClass('done')
            this.collection.count++
            this.collection.updateCount()
        },
    }
})()
