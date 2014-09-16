/**
 * @ignore
 * animate on single property
 * @author yiminghe@gmail.com
 */
var util = require('util');
var Dom = require('dom');
var undef;
var NUMBER_REG = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i;

function load(self, cfg) {
    util.mix(self, cfg);
    self.pos = 0;
    self.unit = self.unit || '';
}

/**
 * basic animation about single css property or element attribute
 * @class Anim.Fx
 * @private
 */
function Fx(cfg) {
    load(this, cfg);
}

Fx.prototype = {
    // default to dom anim
    isCustomFx: 0,

    constructor: Fx,

    /**
     * reset config.
     * @param cfg
     */
    load: function (cfg) {
        load(this, cfg);
    },

    /**
     * process current anim frame.
     * @param pos
     */
    frame: function (pos) {
        if (this.pos === 1) {
            return;
        }

        var self = this,
            anim = self.anim,
            prop = self.prop,
            node = anim.node,
            from = self.from,
            propData = self.propData,
            to = self.to;

        if (pos === undef) {
            pos = getPos(anim, propData);
        }

        self.pos = pos;

        if (from === to || pos === 0) {
            return;
        }

        var val = self.interpolate(from, to, self.pos);

        self.val = val;

        if (propData.frame) {
            propData.frame.call(self, anim, self);
        } else if (!self.isCustomFx) {
            // in case completed in frame
            if (val === undef) {
                // 插值出错，直接设置为最终值
                self.pos = 1;
                val = to;
                console.warn('anim: ' + prop + 'anim update directly ! : ' + val + ' : ' + from + ' : ' + to);
            } else {
                val += self.unit;
            }
            self.val = val;
            if (self.type === 'attr') {
                Dom.attr(node, prop, val, 1);
            } else {
                Dom.css(node, prop, val);
            }
        }
    },

    /**
     * interpolate function
     *
     * @param {Number} from current css value
     * @param {Number} to end css value
     * @param {Number} pos current position from easing 0~1
     * @return {Number} value corresponding to position
     */
    interpolate: function (from, to, pos) {
        // 默认只对数字进行 easing
        if ((typeof from === 'number') &&
            (typeof to === 'number')) {
            return Math.round((from + (to - from) * pos) * 1e5) / 1e5;
        } else {
            return null;
        }
    },

    /**
     * current value
     *
     */
    cur: function () {
        var self = this,
            prop = self.prop,
            type, parsed, r,
            node = self.anim.node;
        //不是 css 或者 attribute 的缓动
        if (self.isCustomFx) {
            return node[prop] || 0;
        }
        if (!(type = self.type)) {
            type = self.type = ((r = isAttr(node, prop)) !== null) ? 'attr' : 'css';
        }
        if (type === 'attr') {
            r = r === undefined ? Dom.attr(node, prop, undef, 1) : r;
        } else {
            r = Dom.style(node, prop);
            var parts = r.match(NUMBER_REG);
            if (parts) {
                var unit = parts[3];
                // unit is not px
                if (unit && unit !== 'px') {
                    r = Dom.css(node, prop);
                }
            }
        }
        // Empty strings, null, undefined and 'auto' are converted to 0,
        // complex values such as 'rotate(1rad)' or '0px 10px' are returned as is,
        // simple values such as '10px' are parsed to Float.
        return isNaN(parsed = parseFloat(r)) ?
                !r || r === 'auto' ? 0 : r
            : parsed;
    }
};

function isAttr(node, prop) {
    var value;
    // support scrollTop/Left now!
    if ((!node.style || node.style[ prop ] == null) &&
        // undefined
        (value = Dom.attr(node, prop, undef, 1)) != null) {
        return value;
    }
    return null;
}

function getPos(anim, propData) {
    var t = util.now(),
        runTime,
        startTime = anim.startTime,
        delay = propData.delay,
        duration = propData.duration;
    runTime = t - startTime - delay;
    if (runTime <= 0) {
        return 0;
    } else if (runTime >= duration) {
        return 1;
    } else {
        return propData.easing(runTime / duration);
    }
}

Fx.Factories = {};
Fx.FxTypes = {};

Fx.getFx = function (cfg) {
    var Constructor = Fx,
        fxType,
        SubClass;
    if ((fxType = cfg.fxType)) {
        Constructor = Fx.FxTypes[fxType];
    } else if (!cfg.isCustomFx && (SubClass = Fx.Factories[cfg.prop])) {
        Constructor = SubClass;
    }
    return new Constructor(cfg);
};

module.exports = Fx;
/*
 TODO
 支持 transform ,ie 使用 matrix
 - http://shawphy.com/2011/01/transformation-matrix-in-front-end.html
 - http://www.cnblogs.com/winter-cn/archive/2010/12/29/1919266.html
 - 标准：http://www.zenelements.com/blog/css3-transform/
 - ie: http://www.useragentman.com/IETransformsTranslator/
 - wiki: http://en.wikipedia.org/wiki/Transformation_matrix
 - jq 插件: http://plugins.jquery.com/project/2d-transform
 */