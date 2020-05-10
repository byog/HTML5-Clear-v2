;(function () {
    /**
     * @inner
     * @var {Number}
     * @default 212
     * @name ListItem~baseH
     */
    var baseH = 212,
        /**
         * @inner
         * @var {Number}
         * @default 93
         * @name ListItem~baseS
         */
        baseS = 93,
        /**
         * @inner
         * @var {Number}
         * @default 53
         * @name ListItem~baseL
         */
        baseL = 53,
        /**
         * @inner
         * @var {Number}
         * @default -2.5
         * @name ListItem~stepH
         */
        stepH = -2.5,
        /**
         * @inner
         * @var {Number}
         * @default 1
         * @name ListItem~stepS
         */
        stepS = 1,
        /**
         * @inner
         * @var {Number}
         * @default 2.5
         * @name ListItem~stepL
         */
        stepL = 2.5,
        /**
         * @inner
         * @var {Number}
         * @default 5
         * @name ListItem~maxColorSpan
         */
        maxColorSpan = 5,
        /**
         * @inner
         * @var {Number}
         * @default maxColorSpan * stepH
         * @name ListItem~spanH
         */
        spanH = maxColorSpan * stepH,
        /**
         * @inner
         * @var {Number}
         * @default maxColorSpan * stepS
         * @name ListItem~spanS
         */
        spanS = maxColorSpan * stepS,
        /**
         * @inner
         * @var {Number}
         * @default maxColorSpan * stepL
         * @name ListItem~spanL
         */
        spanL = maxColorSpan * stepL

    /**
     * @constructor
     * @classdesc app's listitem
     * @extends C
     * @name ListItem
     * @param data
     */
    C.ListItem = function (data) {
        this.base = C.Item

        this.h = baseH

        this.s = baseS

        this.l = baseL

        this.todoCollection = null

        this.count = 0

        if (!data.items) data.items = []

        var i = data.items.length,
            item
        while (i--) {
            item = data.items[i]
            if (!item.done) this.count++
        }

        if (this.count === 0) {
            this.noDragRight = true
        }

        this.base.init.apply(this, arguments)
    }

    /**
     * @lends ListItem
     */
    C.ListItem.prototype = {
        /**
         * @static
         * @default C.Item
         */
        __proto__: C.Item,

        /**
         * @function
         * @static
         */
        render: function () {
            this.el = $(
                '<div class="item list-item' +
                    (this.count ? '' : ' empty') +
                    '">\
                    <div class="slider">\
                        <div class="inner">\
                            <span class="title"><span class="text">' +
                    this.data.title +
                    '</span></span>\
                            <div class="count">' +
                    this.count +
                    '</div>\
                            <input class="field" type="text" value="' +
                    this.data.title +
                    '">\
                        </div>\
                    </div>\
                </div>'
            )

            this.countEl = this.el.find('.count')
        },

        /**
         * @function
         * @static
         */
        updateColor: function () {
            var o = this.data.order,
                n = this.collection.count,
                sH = stepH,
                sS = stepS,
                sL = stepL

            if (n > maxColorSpan) {
                sH = spanH / n
                sS = spanS / n
                sL = spanL / n
            }

            this.sliderStyle.backgroundColor =
                'hsl(' +
                (baseH + o * sH) +
                ',' +
                Math.min(100, baseS + o * sS) +
                '%,' +
                Math.min(100, baseL + o * sL) +
                '%)'
        },

        /**
         * @function
         * @static
         * @param {*} e
         */
        onTap: function (e) {
            if (e.target.className === 'text') {
                this.onEditStart()
            } else {
                this.open()
            }
        },

        /**
         * @function
         * @static
         */
        open: function () {
            if (this.collection.inMomentum) return
            this.el.addClass('fade')

            C.listCollection.open(this.data.order)

            if (!this.todoCollection) {
                this.todoCollection = new C.TodoCollection(this.data, this)
            }
            this.todoCollection.load(this.data.order)

            C.setCurrentCollection(this.todoCollection)
        },

        /**
         * @function
         * @static
         */
        done: function () {
            if (
                !confirm(
                    'Are you sure you want to complete all your items in this list?'
                )
            )
                return

            var i = this.data.items.length
            while (i--) {
                this.data.items[i].done = true
            }
            this.count = 0
            this.updateCount()

            C.log('Completed entire list:' + this.data.title)
            C.db.save()
        },

        /**
         * @function
         * @static
         * @param {*} loopWithCallback
         */
        del: function (loopWithCallback) {
            var t = this

            if (t.count === 0) {
                t.base.del.apply(t)
            } else {
                if (loopWithCallback) {
                    loopWithCallback(ask)
                } else {
                    ask()
                }
            }

            function ask() {
                if (
                    confirm('Are you sure you want to delete the entire list?')
                ) {
                    // fix a bug in Firefox desktop here
                    // it seems after closing the confirm dialog, CSS transitions triggered within that frame (1000/60 ms)
                    // are executed as unseen and thus ends instantly
                    setTimeout(
                        function () {
                            t.base.del.apply(t)
                        },
                        C.client.isWebkit ? 1 : 20
                    )
                } else {
                    t.field.hide().val(t.title.text())
                    t.title.show()
                }
            }
        },

        /**
         * @function
         * @static
         */
        updateCount: function () {
            this.countEl.text(this.count)
            if (this.count === 0) {
                this.el.addClass('empty')
                this.noDragRight = true
            } else {
                this.el.removeClass('empty')
                this.noDragRight = false
            }
        },
    }
})()
