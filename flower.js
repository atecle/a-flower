$(function() {
    var ctx = Sketch.create();  

    var flowers = [];

    var types = {
        "wave" : function(ctx, that) {
            ctx.fillStyle = that.colorPrimary;

            var radius = abs(that.x_0);
            ctx.beginPath();
            var angleStep = TWO_PI/140;

            ctx.moveTo(radius*cos(0.0), radius*sin(0.0));
            for(var angle = 0.0; angle < TWO_PI; angle += angleStep) {

                var rad = 
                    radius + 
                    that.params[0] * sin(angle * that.params[1]);

                ctx.lineTo(
                     rad * cos(angle), 
                     rad * sin(angle));
            };


            ctx.lineTo(
                radius*cos(0.0), 
                radius*sin(0.0));

            
            ctx.fill();
        }
    };

    function randomi(a, b) {
        return Math.floor(random(a,b));
    }


    function generateFlower() {
        var flower = [];

        var previousRadius = 0.0;
        while(previousRadius <= 1.0) {
            previousRadius += random(0.1, 0.2);
            if(previousRadius > 1.0) break;

            var colorPrimary = 
                'rgb(' + 
                    randomi(0, 255) + ',' +
                    randomi(0, 255) + ',' +
                    randomi(0, 255) + ')';

            var params = [
                random(0, 0.07),
                randomi(5, 20),
                random(5, 10),
                random(0.5, 2)
            ];  

            flower.unshift({
                radius          : previousRadius,
                colorPrimary    : colorPrimary,
                type            : random(['wave', 'wave']),
                params          : params,
                x_0             : random(0.0,0.1),
                x_1             : 0
            });
        }   

        return flower;
    }

    var n = 1;
    var rows_ = 1;

    for(var l = 0; l < n; ++l) {
        flowers.push(generateFlower());
    }

    ctx.draw = function() {
        var rows = (n < rows_) ? n : rows_;
        var columns = Math.ceil(flowers.length / rows);
        var min_ = min( 
            ctx.width/(rows + 1), 
            ctx.height/(columns + 1))/2;

        for(k = 0; k < flowers.length; ++k) {
            var flower = flowers[k];

            ctx.save();

            var row    = k%rows + 1;
            var column = (k -k%rows)/rows + 1;


            ctx.translate(
                row * ctx.width/(rows + 1),
             column * ctx.height/(columns + 1));    

            ctx.scale(min_ * 0.8, min_ * 0.8);

            for( var j = 0; j < flower.length; ++j ) {
                types[flower[j].type](ctx, flower[j]);
            }

            ctx.restore();
        }
    };


    ctx.update = function() {
        for(k = 0; k < flowers.length; ++k) {
            var flower = flowers[k];

            for( var j = 0; j < flower.length; ++j ) {
                var dt = 0.05;
                
                var _l = flower[j];

                var _v = (_l.x_0 - _l.x_1) / dt;

                var _f = 0.0;

                var r = abs(_l.x_0);
                if(r !== 0) {
                    _f += _l.params[2] * (_l.radius - r ) * _l.x_0 / (r) +  _l.params[3] * (-_v);
                }

                var _x = 2 * _l.x_0 - _l.x_1 + _f * dt * dt;

                _l.x_1 = _l.x_0;
                _l.x_0 = _x;
            }

        }
    };

});