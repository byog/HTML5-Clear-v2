// The C.Collection base object
// inherited by C.ListCollection and C.TodoCollection

C.Collection = (function (raf) {
    var dragElasticity = 0.45,
        friction = 0.95,
        speedMultiplier = 16,
        maxSpeed = 35,
        diff = 0.5, // the min distance from target an animation loop chain should reach before ending
        sortMoveSpeed = 4.5

    var beforeEditPosition = 0 // used to record position before edit focus

    return {
        init: function (data) {
            this.y = 0
            this.upperBound = 0
            this.initiated = false

            // the data object points directly to the data inside the DB module
            this.data = data || C.db.data

            this.items = []
            this.render()
            this.initDummyItems()
            this.populateItems()

            this.resetDragStates()
        },

        resetDragStates: function () {
            this.pullingDown = false
            this.pastPullDownThreshold = false

            this.longPullingDown = false
            this.longPullingUp = false
            this.pastLongPullDownThreshold = false
            this.pastLongPullUpThreshold = false
        },

        initDummyItems: function () {
            // top dummy item
            this.topDummy = this.el.getElementsByClassName('.dummy-item.top')[0]
            this.topDummySlider = this.topDummy.getElementsByClassName(
                'slider'
            )[0]
            this.topDummyText = this.topDummy.getElementsByClassName('title')[0]
            this.topDummySliderStyle = this.topDummySlider.style
        },

        populateItems: function () {
            var items = this.data.items,
                i = items.length,
                li

            this.count = 0 //number of items (for C.TodoCollection this only counts items not done yet)
            this.hash = {} // hash for getting items based on ID
            this.newIdFrom = i // newly created item ID start from this

            while (i--) {
                this.addItem(items[i])
            }

            this.hasDoneItems = this.items.length > this.count
            this.updateBounds()
        },

        addItem: function (data) {
            var newItem = new this.itemType(data)

            newItem.collection = this
            newItem.updatePosition()

            newItem.el.data('id', this.newIdFrom).appendTo(this.el)

            this.items.push(newItem)
            this.hash(this.newIdFrom) = newItem
            this.newIdFrom++
            if (!newItem.data.done) {
                this.count++
            }

            if (this.updateCount) {
                this.updateCount
            }

            return newItem
        },

        getItemById: function (id) {
            return this.hash[id]
        },

        getItemByOrder: function (order) {
            var i = this.items.length,
                item
            while (i--) {
                item = this.items[i]
                if (item.data.order === order) {
                    return item
                }
            }
        },

        getItemsBetween: function (origin, target) {
            var i = this.items.length,
                item,
                order,
                result = []

            while (i--) {
                item = this.items[i]
                order = item.data.order
                if (
                    (order > origin && order <= target) ||
                    (order < origin && order >= target)
                ) {
                    result.push(item)
                }
            }

            return result
        },

        updateColor: function () {
            var i = this.items.length
            while (i--) {
                this.items[i].updateColor()
            }
        },
        updatePosition: function () {
            var i = this.items.length
            while (i--) {
                this.items[i].updatePosition()
            }
        },
        moveY: function () {
            this.y = y
            this.style[
                C.client.transformProperty
            ] = `'translate3d(0px,${y}px, 0px)`
        },
        collapseAt: function () {},
        updateBounds: function () {
            this.height = this.items.length * C.ITEM_HEIGHT
            this.upperBound = Math.min(
                o,
                C.client.height - (this.height + C.ITEM_HEIGHT)
            )

            // move into bound when items are deleted
            if (this.y < this.upperBound && !noMove) {
                this.moveY(this.upperBound)
            }
        },
        onDragStart: function () {},
        OnDragMove: function () {},
        onDragEnd: function () {},
        onTap: function () {},
        sortMove: function () {},
        onEditStart: function () {},
        onEditDonw: function () {},
        onPinchOutStart: function () {},
        onPinchOutMove: function () {},
        onPinchOutCancel: function () {},
        onPinchOutEnd: function () {},
        createItemAtTop: function () {},
        createItemAtBottom: function () {},
        createItemInBetween: function () {},

        // listen for webkitTransitionEnd
        onTransitionEnd: function (callback, noStrict) {},
    }
})(C.raf)
