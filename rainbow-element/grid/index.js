import { RainbowElement } from '../base/index.js'

export class RGrid extends RainbowElement {
    static observedAttributes = this.$initProps({
        columns: { type: Number, default: 1 },
        gap: [Number, String],
        'row-gap': [Number, String],
        'column-gap': [Number, String],
        inline: Boolean,
        'min-auto-width': Number,
        wrap: Boolean,
        stretch: Boolean,
        onred: Function
    });

    $renderEvents = ['$onMutation', '$onWidthChange', '$onAttrsChange']

    get $columns() {
        if (this.$attrs['min-auto-width']) return Math.floor(this.offsetWidth / this.$attrs['min-auto-width']);
        return this.$attrs.columns
    };

    $bindStyle(props) {
        Object.assign(this.style, {
            "display": props.inline ? "inline-grid" : "grid",
            "grid-template-columns": ` repeat(${this.$columns}, 1fr)`,
            "grid-gap": props.gap + "px",
            "row-gap": (props['row-gap'] || props.gap) + "px",
            "column-gap": (props['column-gap'] || props.gap) + "px",
        })
    }

    $doLayout() {
        let props = this.$attrs;
        let children = Array.from(this.children)
        let clumnList = children.map(el => el.getAttribute('grid-column') * 1 || 1)
        let start = 1;
        let gridColumns = [];
        let maxColumn = this.$columns + 1;
        clumnList.forEach((num, index) => {
            let end = start + num;
            if (props.wrap) {
                if (end > maxColumn) {
                    if (props.stretch) {
                        if (gridColumns[index - 1]) gridColumns[index - 1].end = maxColumn;
                    }
                    start = 1;
                    let end2 = start + num
                    end = end2 > maxColumn ? maxColumn : end2;
                }
            } else {
                if (end > maxColumn) end = maxColumn
            }
            gridColumns.push({
                start: start,
                end: end,
                index
            })
            start = start + num
            if (start > this.$columns) start = 1
        });
        children.forEach((el, index) => {
            el.classList.add('r-grid-item')
            el.style['grid-column-start'] = gridColumns[index].start
            el.style['grid-column-end'] = gridColumns[index].end
        });
    }

    $onRender() {
        this.$bindStyle(this.$attrs);
        this.$doLayout();
        this.classList.add('r-grid')
    }

}

customElements.define("r-grid", RGrid);