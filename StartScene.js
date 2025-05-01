import { startPageAni } from './sketch.js';

export function StartScene() {
    this.enter = function() {
        const self = this;

        select('#upperContainer').hide();
        select('#menuButton').hide();
        select('#startButton').show();
    }

    this.draw = function() {
        clear();
        let ratio = width / 1440;
        animation(startPageAni, width / 2, height / 2, 0, ratio, ratio);
    }
}