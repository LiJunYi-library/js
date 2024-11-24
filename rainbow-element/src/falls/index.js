import { RainbowElement } from '../base/index.js'
import { arrayLoopMap } from '@rainbow_ljy/rainbow-js'
import './index.css'


export class RFalls extends RainbowElement {
    static observedAttributes = this.$registerProps({
        'r-min-auto-width': Number,
        'r-columns': { type: Number, default: 2 },
        'r-gap': { type: Number, default: 0 },
        'r-row-gap': { type: Number, default: 0 },
        'r-column-gap': { type: Number, default: 0 },
    });



    // get $col() {
    //     if (this.$attrs['min-auto-width']) return Math.floor(this.offsetWidth / this.$attrs['min-auto-width']);
    //     return this.$attrs.columns
    // };

    // get $coGap() {
    //     return (this.$attrs['column-gap'] || this.$attrs.gap)
    // }

    // get $roGap() {
    //     return (this.$attrs['row-gap'] || this.$attrs.gap)
    // }

    // get $itemWidth() {
    //     return `calc( ${100 / this.$col}% - ${((this.$col - 1) * this.$coGap) / this.$col}px )`;
    // }

    // $getLeft(i) {
    //     return `calc( ${(100 / this.$col) * i}% - ${(((this.$col - 1) * this.$coGap) / this.$col) * i}px + ${i * this.$coGap}px )`;
    // }

    // $createList() {
    //     const list = arrayLoopMap(this.$col, (i) => ({ height: 0, left: this.$getLeft(i), top: 0, index: i }));
    //     list.getMinHeightItem = () => {
    //         let item = list[0];
    //         list.forEach((el) => { if (el.height < item.height) item = el });
    //         return item;
    //     }
    //     list.getMaxHeightItem = () => {
    //         let item = list[0];
    //         list.forEach((el) => { if (el.height > item.height) item = el });
    //         return item;
    //     }
    //     return list
    // }

    $render() {
        // const list = this.$createList();
        let { rMinAutoWidth, rColumns, rGap, rRowGap, rColumnGap } = this.$.DATA
        rMinAutoWidth = this.$.computePixel(rMinAutoWidth);
        rGap= this.$.computePixel(rGap);
        rRowGap= this.$.computePixel(rRowGap);
        rColumnGap= this.$.computePixel(rColumnGap);

        console.log(rMinAutoWidth, rColumns, rGap, rRowGap, rColumnGap);
        const col = (() => {
            if (rMinAutoWidth) return Math.floor(this.offsetWidth / rMinAutoWidth);
            return rColumns;
        })();
        console.log(col);
        let colGap = this.$.computePixel(rColumnGap) || this.$.computePixel(rGap)
        let left = () => `calc( ${(100 / col) * i}% - ${(((col - 1) * this.$coGap) / col) * i}px + ${i * this.$coGap}px )`;
        const list = arrayLoopMap(col, (i) => ({ height: 0, left: this.$getLeft(i), top: 0, index: i }));


        Array.from(this.children).forEach(child => {
            child.classList.add('r-falls-item');
            // child.style.width = this.$itemWidth;
            // let node = list.getMinHeightItem();
            // if (node.height) node.height = node.height + this.$roGap;
            // child.style.left = node.left;
            // child.style.top = node.height + 'px';
            // node.height = node.height + child.offsetHeight;
        });

        // this.style.height = list.getMaxHeightItem().height + 'px'

    }

}

customElements.define("r-falls", RFalls);