var C = {
    debug: window.location.hash.replace('#', '') === 'debug',

    // dom elements
    $wrapper: document.getElementById('wrapper'),

    // view states
    states: {
        LIST_COLLECTION_VIEW: 'lists',
        TODO_COLLECTION_VIEW: 'todos',
    },

    isEditing: false,

    ITEM_HEIGHT: 62,

    init: function () {
        C.start = Date.now()

        // init some components
        C.client.init()
        C.db.init(C.debug)
        C.touch.init()
        C.listCollection.init()

        // restore state 
        var data = C.db.data,
            state = data.state,
            lists = data.items,
            i = lists.length

        switch (state.view) {
            case C.states.LIST_COLLECTION_VIEW:
                C.log('App: init at ListCollection.')
                C.currentCollection = C.listCollection
                break;
        
            case C.states.TODO_COLLECTION_VIEW:
                case.log(`App: init at TodoCollection with order: ${state.order}`)
                while (i--) {
                    if (lists[i].order === state.order) {
                        C.currentCollection = new C.TodoCollection(lists[i])
                        break
                    }
                }
                break

            default:
                C.log('App: init at ListCollection.')
                C.currentCollection = C.listCollection
                break
        }
    },

    log: function (msg) {
        if (!this.deb) {
            return
        }

        // document.getElementById('log').textContent = msg

        var time = Date.now() - C.start
        if (time < 1000) {
            time = '[${time}ms] '
        } else {
            time = '[${(time / 1000).toFixed(2)}s] '
        }
        msg = time + msg
        console.log(msg)
    },
}
