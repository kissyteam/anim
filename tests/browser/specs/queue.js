/**
 * test case for anim queue
 * @author yiminghe@gmail.com
 */
run(require('anim/timer'));
run(require('anim/transition'));
var Dom = require('dom');


function run(Anim) {
    if (!Anim) {
        return;
    }
    var ANIM_KEY = Anim.Q.queueCollectionKey;
    describe(Anim._name_ + ': anim-queue', function () {
        var test;
        beforeEach(function () {
            test = Dom.create('<div style="width: 100px;' +
                'height: 100px;' +
                'border: 1px solid red;"></div>');
            document.body.appendChild(test);
        });

        afterEach(function () {
            Dom.remove(test);
        });

        /**
         *  default : all anims are in the default queue (one for each element)
         */
        it('should support queue', function (done) {
            var width = Dom.width(test),
                height = Dom.height(test);

            new Anim(test, {
                width: '200px'
            }, {
                duration: 0.3
            }).run();
            new Anim(test, {
                height: '200px'
            }, {
                duration: 0.3
            }).run();

            async.series([
                waits(100),

                runs(function () {
                    expect(Dom.width(test)).not.to.be(width);
                    expect(Dom.height(test)).to.be(height);
                }),

                waits(800),

                runs(function () {
                    expect(Anim.isRunning(test)).not.to.be.ok();
                    var anims = Dom.data(test, ANIM_KEY);
                    expect(Dom.hasData(test, ANIM_KEY)).to.be(false);
                    expect(anims).to.be(undefined);
                })], done);
        });

        it('support wait queue', function (done) {
            var t = Dom.create('<div></div>');
            var time = 0;
            var start = (+new Date());
            new Anim(t, {}, {
                duration: 0.2
            }).run();
            new Anim(t, {}, {
                duration: 0.2,
                complete: function () {
                    time = (+new Date()) - start;
                    expect(time).to.be.above(200);
                    done();
                }
            }).run();
        });

        it('should support single anim stoppage', function (done) {
            var width = Dom.width(test),
                width2,
                height = Dom.height(test);

            var anim1 = new Anim(test, {
                width: '200px'
            }, {
                duration: 0.3
            }).run();

            new Anim(test, {
                height: '200px'
            }, {
                duration: 0.3
            }).run();

            async.series([
                waits(100),

                runs(function () {
                    expect(width2 = Dom.width(test)).not.to.be(width);
                    expect(Dom.height(test)).to.be(height);
                    anim1.stop();
                }),

                waits(800),

                runs(function () {
                    expect(Anim.isRunning(test)).not.to.be.ok();
                    var anims = Dom.data(test, ANIM_KEY);
                    expect(Dom.hasData(test, ANIM_KEY)).to.be(false);
                    expect(anims).to.be(undefined);

                    expect(Dom.width(test)).not.to.be(200);
                    expect(Dom.width(test)).to.be(width2);
                    expect(Dom.height(test)).to.be(200);
                })], done);
        });

        it('can ignore queue', function (done) {
            var width = Dom.width(test),
                height = Dom.height(test);
            new Anim(test, {
                width: '200px'
            }, {
                duration: 0.1,
                queue: false
            }).run();
            new Anim(test, {
                height: '200px'
            }, {
                duration: 0.1,
                queue: false
            }).run();

            async.series([
                waits(100),

                runs(function () {
                    expect(Dom.width(test)).not.to.be(width);
                    expect(Dom.height(test)).not.to.be(height);
                }),

                waits(200),

                runs(function () {
                    expect(Anim.isRunning(test)).not.to.be.ok();
                    var anims = Dom.data(test, ANIM_KEY);
                    expect(Dom.hasData(test, ANIM_KEY)).to.be(false);
                    expect(anims).to.be(undefined);
                })], done);
        });

        it('should support multiple queue', function (done) {
            var
                width = Dom.width(test),
                height = Dom.height(test);
            new Anim(test, {
                width: '200px'
            }, {
                duration: 0.1,
                queue: 'now'
            }).run();
            new Anim(test, {
                height: '200px'
            }, {
                duration: 0.1,
                queue: 'before'
            }).run();

            async.series([
                waits(100),

                runs(function () {
                    expect(Dom.width(test)).not.to.be(width);
                    expect(Dom.height(test)).not.to.be(height);
                }),

                waits(200),

                runs(function () {
                    expect(Anim.isRunning(test)).not.to.be.ok();
                    var anims = Dom.data(test, ANIM_KEY);
                    expect(Dom.hasData(test, ANIM_KEY)).to.be(false);
                    expect(anims).to.be(undefined);
                })], done);
        });

        it('should support specified queue stoppage', function (done) {
            var width = Dom.width(test),
                height = Dom.height(test);

            new Anim(test, {
                width: '200px'
            }, {
                duration: 0.2,
                queue: 'now'
            }).run();
            new Anim(test, {
                height: '200px'
            }, {
                duration: 0.2,
                queue: 'before'
            }).run();

            new Anim(test, {
                width: '300px'
            }, {
                duration: 0.2,
                queue: 'now'
            }).run();
            new Anim(test, {
                height: '300px'
            }, {
                duration: 0.2,
                queue: 'before'
            }).run();

            async.series([
                waits(100),

                runs(function () {
                    Anim.stop(test, 0, 1, 'now');
                    expect(Dom.width(test)).not.to.be(width);
                    expect(Dom.height(test)).not.to.be(height);
                }),

                waits(600),

                runs(function () {
                    expect(Anim.isRunning(test)).not.to.be.ok();
                    var anims = Dom.data(test, ANIM_KEY);
                    expect(Dom.hasData(test, ANIM_KEY)).to.be(false);
                    expect(anims).to.be(undefined);
                    expect(Dom.width(test)).not.to.be(300);
                    expect(Dom.height(test)).to.be(300);
                })], done);
        });

        it('should support stopping current anim in specified queue ', function (done) {
            var width2,
                width = Dom.width(test),
                height = Dom.height(test);
            new Anim(test, {
                width: '200px'
            }, {
                duration: 0.3,
                queue: 'now'
            }).run();

            new Anim(test, {
                height: '200px'
            }, {
                duration: 0.3,
                queue: 'before'
            }).run();

            new Anim(test, {
                width: '300px'
            }, {
                callback: function () {
                },
                duration: 0.1,
                queue: 'now'
            }).run();

            new Anim(test, {
                height: '300px'
            }, {
                duration: 0.1,
                queue: 'before'
            }).run();

            async.series([
                waits(100),

                runs(function () {
                    Anim.stop(test, 0, 0, 'now');
                    expect(width2 = Dom.width(test)).not.to.be(width);
                    expect(Dom.height(test)).not.to.be(height);
                }),

                waits(600),

                runs(function () {
                    expect(Anim.isRunning(test)).not.to.be.ok();
                    var anims = Dom.data(test, ANIM_KEY);
                    expect(Dom.hasData(test, ANIM_KEY)).to.be(false);
                    expect(anims).to.be(undefined);
                    expect(Dom.width(test)).to.be(300);
                    expect(Dom.height(test)).to.be(300);
                })], done);
        });

        it('should support stopping any queue in the middle', function (done) {
            var width = Dom.width(test),
                height = Dom.height(test);
            new Anim(test, {
                width: '200px'
            }, {
                duration: 0.3,
                queue: 'now'
            }).run();
            new Anim(test, {
                height: '200px'
            }, {
                duration: 0.3,
                queue: 'before'
            }).run();
            new Anim(test, {
                width: '300px'
            }, {
                duration: 0.1,
                queue: 'now'
            }).run();
            new Anim(test, {
                height: '300px'
            }, {
                duration: 0.1,
                queue: 'before'
            }).run();

            async.series([
                waits(150),

                runs(function () {
                    Anim.stop(test, 0, 1);
                    expect(Dom.width(test)).not.to.be(width);
                    expect(Dom.height(test)).not.to.be(height);
                }),

                waits(600),
                runs(function () {
                    expect(Anim.isRunning(test)).not.to.be.ok();
                    expect(Dom.width(test)).not.to.be(width);
                    expect(Dom.height(test)).not.to.be(height);
                    expect(Dom.width(test)).not.to.be(200);
                    expect(Dom.height(test)).not.to.be(200);
                    expect(Dom.width(test)).not.to.be(300);
                    expect(Dom.height(test)).not.to.be(300);
                    var anims = Dom.data(test, ANIM_KEY);
                    expect(Dom.hasData(test, ANIM_KEY)).to.be(false);
                    expect(anims).to.be(undefined);
                })], done);
        });

        it('should support stopping any queue and set value to end right away', function (done) {
            Dom.css(test, {
                width: 10,
                height: 10
            });

            new Anim(test, {
                width: '200px'
            }, {
                duration: 0.2,
                queue: 'now'
            }).run();
            new Anim(test, {
                height: '200px'
            }, {
                duration: 0.2,
                queue: 'before'
            }).run();
            new Anim(test, {
                width: '300px'
            }, {
                duration: 0.2,
                queue: 'now'
            }).run();
            new Anim(test, {
                height: '300px'
            }, {
                duration: 0.2,
                queue: 'before'
            }).run();

            async.series([
                waits(120),

                runs(function () {
                    Anim.stop(test, 1, 1);
                    expect(Dom.width(test)).to.be(200);
                    expect(Dom.height(test)).to.be(200);
                }),
                waits(300),
                runs(function () {
                    expect(Anim.isRunning(test)).not.to.be.ok();
                    expect(Dom.width(test)).to.be(200);
                    expect(Dom.height(test)).to.be(200);
                    var anims = Dom.data(test, ANIM_KEY);
                    expect(Dom.hasData(test, ANIM_KEY)).to.be(false);
                    expect(anims).to.be(undefined);
                })], done);
        });
    });
}