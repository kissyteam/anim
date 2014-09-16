/**
 * test case for anim pause/resume
 * @author yiminghe@gmail.com
 */

var Dom = require('dom');
var Anim = require('anim/timer');
describe('TimerAnim:  pause/resume', function () {
    var t;
    beforeEach(function () {
        t = Dom.create('<div style="height:100px;width:100px;overflow: hidden;"></div>');
        document.body.appendChild(t);
    });

    afterEach(function () {
        Dom.remove(t);
    });

    it('anim-pause/resume works', function (done) {
        var anim = new Anim(t, {
            width: '10px',
            height: '10px'
        }, {
            duration: 0.4
        }).run();

        var width, height;

        async.series([

            waits(100),

            runs(function () {
                anim.pause();
                expect(anim.isPaused()).to.be.ok();
                expect(anim.isRunning()).not.to.be.ok();
                expect(Anim.isRunning(t)).not.to.be.ok();
                expect(Anim.isPaused(t)).to.be.ok();
                width = Dom.width(t);
                height = Dom.height(t);
                expect(width).not.to.be(100);
                expect(width).not.to.be(100);
                expect(width).not.to.be(10);
                expect(width).not.to.be(10);
            }),
            waits(100),
            runs(function () {
                expect(Dom.width(t)).to.be(width);
                expect(Dom.height(t)).to.be(height);
                anim.resume();
                expect(anim.isPaused()).not.to.be.ok();
                expect(anim.isRunning()).to.be.ok();
                expect(Anim.isRunning(t)).to.be.ok();
                expect(Anim.isPaused(t)).not.to.be.ok();
            }),
            waits(600),
            runs(function () {
                expect(Dom.width(t)).to.be(10);
                expect(Dom.height(t)).to.be(10);
                expect(anim.isPaused()).not.to.be.ok();
                expect(anim.isRunning()).not.to.be.ok();
                expect(Anim.isRunning(t)).not.to.be.ok();
                expect(Anim.isPaused(t)).not.to.be.ok();
            })], done);
    });

    it('works on node', function (done) {
        new Anim(t, {
            width: '10px',
            height: '10px'
        }, {
            duration: 0.4
        }).run();

        var width, height;

        async.series([
            waits(100),

            runs(function () {
                Anim.pause(t);
                expect(Anim.isRunning(t)).not.to.be.ok();
                expect(Anim.isPaused(t)).to.be.ok();
                width = Dom.width(t);
                height = Dom.height(t);
                expect(width).not.to.be(100);
                expect(width).not.to.be(100);
                expect(width).not.to.be(10);
                expect(width).not.to.be(10);
            }),
            waits(100),
            runs(function () {
                expect(Dom.width(t)).to.be(width);
                expect(Dom.height(t)).to.be(height);
                Anim.resume(t);

                expect(Anim.isRunning(t)).to.be.ok();
                expect(Anim.isPaused(t)).not.to.be.ok();
            }),
            waits(600),
            runs(function () {
                expect(Dom.width(t)).to.be(10);
                expect(Dom.height(t)).to.be(10);
                expect(Anim.isRunning(t)).not.to.be.ok();
                expect(Anim.isPaused(t)).not.to.be.ok();
            })], done);
    });
});
