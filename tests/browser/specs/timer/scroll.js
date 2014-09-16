/**
 * test case for anim scroll
 * @author yiminghe@gmail.com
 */
var Dom = require('dom');
var Anim = require('anim/timer');
var UA = require('ua');

describe('TimerAnim: anim-scroll', function () {
    var t;
    afterEach(function () {
        if (t) {
            Dom.remove(t);
            t = 0;
        }
    });
    it('should animate scroll correctly', function (done) {
        var test = Dom.create('<div style="width:100px;overflow:hidden;' +
            'border:1px solid red;">' +
            '<div style="width:500px;">' +
            '1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,' +
            '6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,' +
            '3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,' +
            '0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,' +
            '6,7,8,9,0,1,2,3,4,5' +
            ',6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,' +
            '3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,' +
            '</div>' +
            '</div>');
        t = test;
        Dom.append(test, 'body');
        test.scrollLeft = 500;
        var scrollLimit = test.scrollLeft;
        test.scrollLeft = 0;
        new Anim(test, {
            scrollLeft: scrollLimit
        }, 0.5).run();
        async.series([
            waits(100),
            runs(function () {
                expect(test.scrollLeft).not.to.be(0);
            }),
            waits(800),
            runs(function () {
                expect(test.scrollLeft).to.be(scrollLimit);
            })], done);
    });

    if (!window.frameElement && UA.android) {
        it('should animate scroll correctly for window', function (done) {
            Dom.append(t = Dom.create('<div style="height:2000px"/>'), document.body);
            Dom.scrollTop(window, 0);
            var anim;

            async.series([
                waits(300),

                runs(function () {
                    anim = new Anim(window, {
                        scrollTop: 100
                    }, 0.5).run();
                }),

                waits(300),
                runs(function () {
                    expect(Dom.scrollTop(window)).not.to.be(0);
                }),

                waits(600),
                runs(function () {
                    expect(Dom.scrollTop(window)).to.be(100);
                    anim.stop();
                }),

                runs(function () {
                    Dom.scrollTop(window, 0);
                    anim = new Anim(window, {
                        scrollTop: 100
                    }, 0.5).run();
                }),

                waits(300),
                runs(function () {
                    expect(Dom.scrollTop(window)).not.to.be(0);
                    anim.stop();
                }),

                waits(600),
                runs(function () {
                    expect(Dom.scrollTop(window)).not.to.be(100);
                    expect(Dom.scrollTop(window)).not.to.be(0);
                }),

                runs(function () {
                    Dom.scrollTop(window, 0);
                    anim = new Anim(window, {
                        scrollTop: 100
                    }, 0.5).run();
                }),

                waits(300),
                runs(function () {
                    expect(Dom.scrollTop(window)).not.to.be(0);
                    anim.stop(true);
                    expect(Dom.scrollTop(window)).to.be(100);
                    expect(Dom.scrollTop(window)).not.to.be(0);
                }) ], done);
        });
    }
});
