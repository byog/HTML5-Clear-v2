C.listCollection = {
    __proto__: C.Collection,

    init: function () {
        C.log('ListCollection: init')

        this.stateType = C.states.LIST_COLLECTION_VIEW
        this.base = C.Collection
        this.itemType = C.ListItem
        this.itemTypeText = 'List'

        // apply shared init
        this.base.init.apply(this, arguments)

        // private init jobs
        this.updateColor()
        this.updatePosition()

        this.openedAt = -1 // used to record currently opened list
    },

    render: function () {
        var tmpDiv = document.createElement('div')
        tmpDiv.innerHTML = `
            <div id="list-collection" class="collection">
                <div class="credit">
                    Made by Evan You <br>
                    Original IOS app by Realmac
                </div>
                <div class="item dummy-item top list-item empty">
                    <div class="slider" style="background-color:rgb(23,128,247)">
                        <div class="inner">
                            <span class="title">
                                Pull to Create List
                            </span>
                            <div class="count">0</div>
                        </div>
                    </div>
                </div>
            </div>
        `.trim()

        this.el = tmpDiv.firstChild
        this.style = this.el.style
    },

    load: function () {
        this.initiated = true
        C.$wrapper.appendChild(this.el)
    },
}
