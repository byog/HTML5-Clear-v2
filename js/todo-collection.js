C.TodoCollection = function (data, listItem) {
    C.log(`TodoCollection: init <${data.titile}>`)

    this.stateType = C.states.TODO_COLLECTION_VIEW
    this.base = C.Collection
    this.itemType = C.TodoItem
    this.itemTypeText = 'item'

    this.listItem = listItem || C.listCollection.getItemByOrder(data.order)

    // apply shared init
    this.base.init.apply(this, arguments)
}

C.TodoCollection.prototype = {
    __proto__: C.Collection,

    render: function () {
        var tmpDiv = `
            <div class="collection">
                <div class="top-switch">
                    <img class="arrow" src="img/arrow.png"> <span class="text">Switch To Lists</span>
                </div>
                <div class="bottom-switch">
                    <div class="drawer"><img class="arrow-small" src="img/arrow-small.png"></div>
                    <span class="text">Pull to Clear</span>
                </div>
                <div class="item dummy-item top">
                    <div class="slider" style="background-color:rgb(235,0,23)"><div class="inner">
                        <span class="title">Pull to Create Item</span>
                    </div></div>
                </div>
            </div>
        `
        this.el = document.createElement('div')
        this.el.innerHTML = tmpDiv

        this.style = this.el.style

        // top switch
        this.topSwitch = this.el.getElementsByClassName('top-switch')[0]
        this.topArroww = this.topSwitch.getElementsByClassName('arrow')
        this.topText = this.topSwitch.getElementsByClassName('text')

        // bottom switch
        this.bottomSwitch = this.el.getElementsByClassName('bottom-switch')[0]
        this.drawer = this.bottomSwitch.getElementsByClassName('drawer')
        this.smallArrowStyle = this.bottomSwitch.getElementsByClassName(
            'arrow-small'
        )[0].style
    },
    load: function (at, noAnimation) {},
    floatUp: function (target) {},
    updateCount: function () {},
    onDragMove: function () {},
    onDragEnd: function () {},
    onPullDown: function () {},
    onPullUp: function () {},
    onPinchInStart: function () {},
    onPinchInMove: function (i, touch) {},
    onPinchInEnd: function () {},
    onPinchInCancel: function () {},
    positionForPullUp: function () {},
    resetTopSwitch: function () {},
}
