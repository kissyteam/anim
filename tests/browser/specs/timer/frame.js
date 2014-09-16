/**
 * test case for anim frame config
 * @author yiminghe@gmail.com
 */

var Anim = require('anim/timer');
var UA = require('ua');
var Dom = require('dom');

describe('TimerAnim: anim-frame config', function () {
    var t;
    beforeEach(function () {
        t = Dom.create('<div style="height:100px;width:100px;overflow: hidden;"></div>');
        document.body.appendChild(t);
    });

    afterEach(function () {
        Dom.remove(t);
    });

    it('accept custom animation property', function (done) {
        //非标准的css属性渐变
        var anyPlainObject = {
            r: 1
        };
        //最终半径
        var finalRadius;

        var anim = new Anim(anyPlainObject, {
            r: 80
        }, {
            easing: 'swing',
            duration: 0.5,
            frame: function (anim, fx) {
                finalRadius = fx.val;
            }
        });
        anim.run();
        setTimeout(function () {
            expect(anim.isRunning()).not.to.be.ok();
            expect(finalRadius).to.be(80);
            done();
        }, 600);
    });

    it('support fx extension', function (done) {
        if (!UA.webkit) {
            done();
            return;
        }
        new Anim(t, {
            '-webkit-transform': {
                easing: 'linear',
                frame: function (anim, fx) {
                    Dom.css(t,fx.prop, 'translate(' +
                        (100 * fx.pos) + 'px,' +
                        (100 * fx.pos) + 'px' + ')');
                }
            }
        }, {
            duration: 2
        }).run();

        setTimeout(function () {
            var m = Dom.style(t, '-webkit-transform')
                .match(/translate\(([\d.]+)px\s*,\s*([\d.]+)px\)/);
            expect(Math.abs(50 - parseFloat(m[1]))).to.be.below(10);
            expect(Math.abs(50 - parseFloat(m[2]))).to.be.below(10);
            done();
        }, 1000);
    });

    it('should call frame', function (done) {
        var stoppedCalled = 0;

        var anim = new Anim(t, {
            width: 10
        }, {
            duration: 1,
            frame: function (_, fx) {
                if (fx.pos === 1) {
                    stoppedCalled = 1;
                }
                Dom.css(t, 'height', fx.val);
                Dom.css(t, fx.prop, fx.val);
            }
        });
        anim.run();
        async.series([
            waits(100),
            runs(function () {
                expect(Dom.css(t, 'width')).not.to.be('100px');
                expect(Dom.css(t, 'height')).not.to.be('100px');
                anim.stop(1);
            }),
            waits(100),
            runs(function () {
                expect(stoppedCalled).to.be(1);
                expect(Dom.css(t, 'width')).to.be('10px');
                expect(Dom.css(t, 'height')).to.be('10px');

            })], done);
    });

    it('frame can call stop', function (done) {
        var start = (+new Date());
        var called = 0;
        var anim = new Anim(t, {
            width: 10,
            height: 10
        }, {
            duration: 0.5,
            frame: function (_, fx) {
                if (fx.pos > 0.5 && fx.pos !== 1) {
                    anim.stop(1);
                } else {
                    Dom.css(t, fx.prop, fx.val);
                }
            },
            complete: function () {
                called++;
                expect((+new Date()) - start).to.be.below(1000);
            }
        });
        anim.run();
        async.series([
            waits(300),
            runs(function () {
                expect(Dom.css(t, 'width')).to.be('10px');
            }),
            waits(100),
            runs(function () {
                expect(called).to.be(1);
                expect(Dom.css(t, 'width')).to.be('10px');
            })], done);
    });

    it('frame can call stop', function (done) {
        var called = 0;
        var calledComplete = 0;
        var anim = new Anim(t, {
            width: 10,
            height: 10
        }, {
            duration: 1,
            frame: function (_, fx) {
                if (fx.pos > 0.5) {
                    called++;
                    anim.stop();
                } else {
                    Dom.css(t, fx.prop, fx.val);
                }
            },
            complete: function () {
                calledComplete++;
            }
        });
        anim.run();
        async.series([
            waits(600),
            runs(function () {
                expect(called).to.be(1);
                expect(Dom.css(t, 'width')).not.to.be('10px');
            }),
            waits(100),
            runs(function () {
                expect(calledComplete).to.be(0);
                expect(Dom.css(t, 'width')).not.to.be('10px');
            }),
            waits(500),
            runs(function () {
                expect(anim.isRunning()).not.to.be.ok();
            })], done);
    });

// to be removed, do not use this feature
    it('frame can ignore native update', function (done) {
        var anim = new Anim(t, {
            width: 10
        }, {
            duration: 1,
            frame: function () {
            }
        });

        anim.run();
        async.series([
            waits(100),
            runs(function () {
                expect(Dom.css(t, 'width')).to.be('100px');
                anim.stop(1);
            }),
            waits(100),
            runs(function () {
                expect(Dom.css(t, 'width')).to.be('100px');
            })], done);
    });

// to be removed, do not use this feature
    it('frame can stop early and ignore native update', function (done) {
        var start = (+new Date());
        var called = 0;
        var anim = new Anim(t, {
            width: 10
        }, {
            duration: 1,
            frame: function (anim, fx) {
                fx.pos = 1;
            },
            complete: function () {
                called = 1;
                expect((+new Date()) - start).to.be.below(1000);
            }
        });

        anim.run();
        async.series([
        waits(500),
        runs(function () {
            expect(called).to.be(1);
            expect(Dom.css(t, 'width')).to.be('100px');
            anim.stop(1);
        }),
        waits(500),
        runs(function () {
            expect(Dom.css(t, 'width')).to.be('100px');

        })],done);
    });

// to be removed, do not use this feature
    it('frame can stop early and perform native update', function (done) {
        var start = (+new Date());
        var called = 0;
        var anim = new Anim(t, {
            width: 10
        }, {
            duration: 1,
            frame: function (anim, fx) {
                fx.pos = 1;
                Dom.css(t, fx.prop, 10);
            },
            complete: function () {
                called = 1;
                expect((+new Date()) - start).to.be.below(1000);
            }
        });

        anim.run();
        async.series([
        waits(500),
        runs(function () {
            expect(called).to.be(1);
            expect(Dom.css(t, 'width')).to.be('10px');
            anim.stop(1);
        }),
        waits(500),
        runs(function () {
            expect(Dom.css(t, 'width')).to.be('10px');
        })],done);
    });
});
