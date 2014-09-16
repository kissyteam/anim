var Anim = require('anim/timer');
var Dom = require('dom');
describe('TimerAnim: promise api', function () {
    it('support progress', function (done) {
        var d = Dom.create('<div style="width:100px"></div>');
        document.body.appendChild(d);
        var anim = new Anim(d, {
            width: 200
        }, {
            duration: 0.3,
            complete: function () {
                expect(ps[0]).to.be.below(0.8);
                expect(ps[ps.length - 1]).to.be.above(0.9);
                Dom.remove(d);
                done();
            }
        }).run();
        var ps = [];
        anim.progress(function (v) {
            ps.push(v[1]);
        });
    });
});