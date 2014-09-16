run(require('anim/timer'));
run(require('anim/transition'));
var Dom = require('dom');

function run(Anim) {
    if (!Anim) {
        return;
    }
    describe(Anim._name_ + ': support promise api', function () {
        var d;

        beforeEach(function () {
            d = Dom.create('<div style="width:100px"></div>');
            document.body.appendChild(d);
        });

        afterEach(function () {
            Dom.remove(d);
        });

        it('support then and complete callback', function (done) {
            var ok = 0;
            new Anim(d, {
                width: 200
            }, {
                duration: 0.1,
                complete: function () {
                    expect(Dom.css(d,'width')).to.be('200px');
                    ok++;
                    if (ok == 2) {
                        done();
                    }
                }
            }).run().then(function () {
                    expect(Dom.css(d,'width')).to.be('200px');
                    ok++;
                    if (ok == 2) {
                        done();
                    }
                });
        });

        it('support fail', function (done) {
            var fail = 0;
            var complete = 0;
            var anim = new Anim(d, {
                width: 200
            }, {
                duration: 0.3,
                complete: function () {
                    complete = 1;
                }
            }).run();
            anim.fail(function () {
                fail = 1;
            });
            async.series([
                waits(100),
                runs(function () {
                    anim.stop();
                }),
                waits(10),
                runs(function () {
                    expect(fail).to.be(1);
                    expect(complete).to.be(0);
                    expect(Dom.css(d,'width')).not.to.be('100px');
                    expect(Dom.css(d,'width')).not.to.be('200px');
                }),
                waits(300),
                runs(function () {
                    expect(fail).to.be(1);
                    expect(complete).to.be(0);
                    expect(Dom.css(d,'width')).not.to.be('100px');
                    expect(Dom.css(d,'width')).not.to.be('200px');
                })], done);
        });
    });
}