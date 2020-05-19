;(function () {
    // color - HSL
    var baseH = 212,
        baseS = 93,
        baseL = 53,
        stepH = -2.5,
        stepS = 1,
        stepL = 2.5,
        maxColorSpan = 5,
        spanH = maxColorSpan * stepH,
        spanS = maxColorSpan * stepS,
        spanL = maxColorSpan * stepL

    C.ListItem = function (data) {
        this.base = C.Item
        this.h = baseH
        this.s = baseS
        this.l = baseL
        this.todoCollection = null // this one is lazy

        // private init jobs
        // count undone items
        this.count = 0

        if (!data.items) {
            data.items = []
        }

        var i = data.items.length,
            item
        while (i--) {
            item = data.items[i]
            if (!item.done) {
                this.count++
            }
        }

        if (this.count === 0) {
            this.onDragRight = true
        }

        this.base.init.apply(this, arguments)
    }

    C.ListItem.prototype = {
        __proto__: C.Item,

        render: function () {
            var tmpDiv = document.createElement('div')
            tmpDiv.innerHTML = `
                <div class="item list-item ${this.count ? '' : 'empty'}">
                    <div class="slider">
                        <div class="inner">
                            <span class="title">
                                <span class="text">
                                    ${this.data.title}
                                </span>    
                            </span>
                            <div class="count">
                                ${this.count}
                            </div>
                            <input class="field" type="text" value="${
                                this.data.title
                            }">
                        </div>
                    </div>
                </div>
            `.trim()
            this.el = tmpDiv.firstChild
            this.countEl = this.el.getElementsByClassName('count')[0]
        },
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

            this.sliderStyle.backgroundColor = `
                hsl(${baseH + o + sH},${Math.min(
                100,
                baseS + o + sS
            )}%,${Math.min(100, baseL + o + sL)}%)
            `
        },
        onTap: function () {},
        open: function () {},
        done: function () {},
        del: function () {},
        updateCount: function () {},
    }
})()
