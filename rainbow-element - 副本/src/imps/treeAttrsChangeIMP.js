const events = new Map();

new MutationObserver((mutations) => {
    events.forEach((fun, item) => {
        if (fun instanceof Function) fun.call(item, mutations)
    })
    // console.log('document MutationObserver')
}).observe(document, { subtree: true, attributes: true, attributeOldValue: true })


export const treeAttrsChangeIMP = {
    simult: {
        init() {
            if (!this.$.changePropsRender) return;
            events.set(this, () => this.$.changePropsRender())
        },
        disconnected() {
            events.delete(this)
        },
    },
    settle: {
        init() { },
    },
    async: {
        init() { },
    }
}

