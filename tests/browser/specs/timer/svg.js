var Dom = require('dom');
var Color = require('color');
var Anim = require('anim/timer');
function svgSupported() {
    return !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;
}

if (svgSupported()) {
    describe('TimerAnim: svg works', function () {
        it('support svg attribute', function (done) {
            var div = Dom.create('<div></div>');
            document.body.appendChild(div);
            div.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">' +
                '<circle ' +
                'cx="100" ' +
                'cy="50" ' +
                'r="40" ' +
                'opacity="1" ' +
                'stroke="black" ' +
                'stroke-width="2" ' +
                'fill="#000"/>' +
                '</svg>';
            var circle = div.firstChild.firstChild;
            new Anim(circle, {
                fill: {
                    type: 'attr',
                    fxType: 'color',
                    value: '#fff'
                },
                opacity: {
                    type: 'attr',
                    value: '0'
                }
            }, {
                duration: 0.5
            }).run();
            async.series([
                waits(100),
                runs(function () {
                    var fill = Color.parse(circle.getAttribute('fill')).toHex();
                    var opacity = circle.getAttribute('opacity');
                    expect(opacity).not.to.be('0');
                    expect(opacity).not.to.be('1');
                    expect(fill).not.to.be('#000000');
                    expect(fill).not.to.be('#ffffff');
                }),
                waits(500),
                runs(function () {
                    var fill = Color.parse(circle.getAttribute('fill')).toHex();
                    var opacity = circle.getAttribute('opacity');
                    expect(opacity).to.be('0');
                    expect(fill).to.be('#ffffff');
                    document.body.removeChild(div);
                })], done);
        });
    });
}
