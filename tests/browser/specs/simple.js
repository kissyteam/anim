/**
 * test case for simple anim
 * @author yiminghe@gmail.com
 */

var util = require('util');
var Dom = require('dom');
run(require('anim/timer'));
run(require('anim/transition'));

function run(Anim) {
    if (!Anim) {
        return;
    }
    /*jshint quotmark:false*/
    function matrix(transform) {
        transform = transform.split(")");
        var trim = util.trim,
            i = -1,
            l = transform.length - 1,
            split, prop, val,
            ret = cssMatrixToComputableMatrix([1, 0, 0, 1, 0, 0]),
            curr;

        // Loop through the transform properties, parse and multiply them
        while (++i < l) {
            split = transform[i].split("(");
            prop = trim(split[0]);
            val = split[1];
            curr = [1, 0, 0, 1, 0, 0];
            switch (prop) {
                case "translateX":
                    curr[4] = parseInt(val, 10);
                    break;

                case "translateY":
                    curr[5] = parseInt(val, 10);
                    break;

                case 'translate':
                    val = val.split(",");
                    curr[4] = parseInt(val[0], 10);
                    curr[5] = parseInt(val[1] || 0, 10);
                    break;

                case 'rotate':
                    val = toRadian(val);
                    curr[0] = Math.cos(val);
                    curr[1] = Math.sin(val);
                    curr[2] = -Math.sin(val);
                    curr[3] = Math.cos(val);
                    break;

                case 'scaleX':
                    curr[0] = +val;
                    break;

                case 'scaleY':
                    curr[3] = +val;
                    break;

                case 'scale':
                    val = val.split(",");
                    curr[0] = +val[0];
                    curr[3] = val.length > 1 ? +val[1] : +val[0];
                    break;

                case "skewX":
                    curr[2] = Math.tan(toRadian(val));
                    break;

                case "skewY":
                    curr[1] = Math.tan(toRadian(val));
                    break;

                case 'matrix':
                    val = val.split(",");
                    curr[0] = +val[0];
                    curr[1] = +val[1];
                    curr[2] = +val[2];
                    curr[3] = +val[3];
                    curr[4] = parseInt(val[4], 10);
                    curr[5] = parseInt(val[5], 10);
                    break;

                case 'matrix3d':
                    val = val.split(",");
                    curr[0] = +val[0];
                    curr[1] = +val[1];
                    curr[2] = +val[4];
                    curr[3] = +val[5];
                    curr[4] = parseInt(val[8], 10);
                    curr[5] = parseInt(val[9], 10);
                    break;
            }
            ret = multipleMatrix(ret, cssMatrixToComputableMatrix(curr));
        }

        return ret;
    }

    function cssMatrixToComputableMatrix(matrix) {
        return[
            [matrix[0], matrix[2], matrix[4]],
            [matrix[1], matrix[3], matrix[5]],
            [0, 0, 1]
        ];
    }

    function setMatrix(m, x, y, v) {
        if (!m[x]) {
            m[x] = [];
        }
        m[x][y] = v;
    }

    function multipleMatrix(m1, m2) {
        var i;
        if (arguments.length > 2) {
            var ret = m1;
            for (i = 1; i < arguments.length; i++) {
                ret = multipleMatrix(ret, arguments[i]);
            }
            return ret;
        }

        var m = [],
            r1 = m1.length,
            r2 = m2.length,
            c2 = m2[0].length;

        for (i = 0; i < r1; i++) {
            for (var k = 0; k < c2; k++) {
                var sum = 0;
                for (var j = 0; j < r2; j++) {
                    sum += m1[i][j] * m2[j][k];
                }
                setMatrix(m, i, k, sum);
            }
        }

        return m;
    }

// converts an angle string in any unit to a radian Float
    function toRadian(value) {
        return value.indexOf("deg") > -1 ?
            parseInt(value, 10) * (Math.PI * 2 / 360) :
            parseFloat(value);
    }

    function beAlmostEqualMatrix(actual, expected) {
        var m1 = actual;
        for (var i = 0; i < m1.length; i++) {
            var row = m1[i];
            for (var j = 0; j < row.length; j++) {
                if (Math.abs(m1[i][j]-expected[i][j]) > 0.01) {
                    return false;
                }
            }
        }
        return true;
    }

    describe(Anim._name_ + ": simple", function () {
        function padding(s) {
            if (s.length === 1) {
                return "0" + s;
            }
            return s;
        }

        function normalizeColor(c) {
            if (c.toLowerCase().lastIndexOf("rgb(") === 0) {
                var x = [];
                c.replace(/\d+/g, function (m) {
                    x.push(padding(Number(m).toString(16)));
                });
                c = "#" + x.join("");
            } else if (c.length === 4) {
                c = c.replace(/[^#]/g, function (c) {
                    return c + c;
                });
            }
            return c;
        }

        it("should start and end anim properly", function (done) {
            var test1 = Dom.create('<div style="position: absolute;' +
                ' text-align: center;' +
                'overflow: hidden">^o^</div>');
            Dom.append(test1, 'body');
            Dom.css(test1, {
                //'border-color':"#000",
                borderStyle: 'solid',
                width: "10px",
                height: "20px",
                left: "120px",
                top: "20px",
                color: "#000"
            });
            var initColor = normalizeColor(Dom.css(test1, "border-color"));

            var anim = new Anim(test1, {
                    'background-color': '#fcc',
                    //'border': '5px dashed #999',el
                    'border-width': '5px',
                    'border-color': "#999999",
                    //'border-style': "dashed",
                    'width': '100px',
                    'height': '50px',
                    'left': '900px',
                    'top': '285px',
                    'opacity': '.5',
                    'font-size': '48px',
                    'padding': '30px 0',
                    'color': '#FF3333'
                },
                0.5
            ).run();

            async.series([
                waits(300),

                runs(function () {
                    expect(normalizeColor(Dom.css(test1, "borderTopColor")))
                        .not.to.be(initColor);
                    expect(Dom.css(test1, 'width')).not.to.be("10px");
                    expect(Dom.css(test1, 'height')).not.to.be("20px");
                    expect(Dom.css(test1, 'left')).not.to.be("120px");
                    expect(Dom.css(test1, "top")).not.to.be("20px");
                }),

                waits(800),

                runs(function () {
                    expect(normalizeColor(Dom.style(test1, "border-color")))
                        .to.be("#999999");
                    expect(parseInt(Dom.css(test1, 'width'), 10) - 100).to.within(-5, 5);
                    expect(parseInt(Dom.css(test1, 'height'), 10) - 50).to.within(-5, 5);
                    expect(Dom.css(test1, 'left')).to.be("900px");
                    expect(Dom.css(test1, "top")).to.be("285px");
                    Dom.remove(test1);
                })], done);
        });

        it('support different easing for different property', function (done) {
            if (Anim._name_ === 'TransitionAnim') {
                // native does not support easing as function
                done();
                return;
            }
            var div = Dom.create('<div style="position:absolute;left:0;top:0;"></div>');
            document.body.appendChild(div);
            new Anim(div, {
                left: {
                    value: "100px",
                    easing: function () {
                        return 0.5;
                    }
                },
                top: {
                    value: "100px",
                    easing: function () {
                        return 0.2;
                    }
                }
            }, {
                duration: 0.3
            }).run();

            async.series([
                waits(100),

                runs(function () {
                    expect(parseInt(Dom.css(div, 'top'), 10)).to.be(20);
                    expect(parseInt(Dom.css(div, 'left'), 10)).to.be(50);
                }),

                waits(600),

                runs(function () {
                    expect(parseInt(Dom.css(div, 'top'), 10)).to.be(100);
                    expect(parseInt(Dom.css(div, 'left'), 10)).to.be(100);
                    Dom.remove(div);
                })], done);
        });

        it("works for width/height", function (done) {
            var div = Dom.create("<div style='border:1px solid red;'>" +
                "<div style='width:100px;height: 100px;'>" +
                "</div>" +
                "</div>");
            document.body.appendChild(div);

            // width height 特殊，
            // ie6 需要设置 overflow:hidden
            // 否则动画不对
            Dom.css(div, {
                height: 0,
                width: 0,
                overflow: 'hidden'
            });

            new Anim(div, {
                height: 100,
                width: 100
            }, {
                duration: 0.2,
                complete: function () {
                    Dom.remove(div);
                }
            }).run();

            expect(Dom.height(div)).to.be(0);
            expect(Dom.width(div)).to.be(0);

            async.series([
                waits(100),

                runs(function () {
                    // overflow hidden ie6 没设好
                    // https://github.com/kissyteam/kissy/issues/146
                    expect(Dom.height(div)).not.to.be(100);
                    expect(Dom.width(div)).not.to.be(100);
                    expect(Dom.height(div)).not.to.be(0);
                    expect(Dom.width(div)).not.to.be(0);
                }),

                waits(200),

                runs(function () {
                    expect(Dom.height(div)).to.be(100);
                    expect(Dom.width(div)).to.be(100);
                    Dom.remove(div);
                })], done);
        });

        it('support transform animation', function (done) {
            var div = Dom.create('<div style="position: absolute;' +
                'border:1px solid red;' +
                'left:100px;' +
                'top:100px;' +
                'width: 100px;height: 100px;"></div>');
            document.body.appendChild(div);

            expect(Dom.css(div, 'transform')).to.be('none');
            var val = 'rotate(30deg)';
            var expectedMatrix = matrix(val);
            new Anim(div, {
                transform: val
            }, {
                duration: 1,
                complete: function () {
                    expect(beAlmostEqualMatrix(matrix(Dom.css(div, 'transform')), expectedMatrix)).to.be.ok();
                    Dom.remove(div);
                    done();
                }
            }).run();
        });
    });
}