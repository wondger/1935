setTimeout(function(){
    KISSY.config({
        debug: true,
        packages: {
            "libs": {
                path: "./libs"
            },
            "gallery/dragswitch" : {
                path: "./gallery",
                ignorePackageNameInUri: true
            }
        }
    })

    KISSY.ready(function(S){

        //Flipsnap('.slide');


        S.use(["node", "event", "gallery/dragswitch/"], function(S, Node, Event,DS){
            var $ = Node.all;

            document.documentElement.addEventListener('touchmove', function(ev){
                ev.preventDefault();
            });


            var wrapEl = $('.wrap'),
                viewsEl = wrapEl.one('.views-content'),
                nowView = 1;
            var ds1 = new DS(viewsEl, {
                senDistance : 10,
                angle       : Math.PI / 4,
                checkEnabled  : null,
                inertiaMove : false,
                disable     : false,
                binds       : [
                    {
                        moveSelf      : false,
                        moveEls       : ['.wrap'],
                        checkEnabled    : function() {
                            return !wrapEl.hasClass('search');
                        },
                        friction      : false,
                        transition    : true
                    }, 
                    {
                        moveSelf      : true,
                        moveEls       : [],
                        maxDistance   : wrapEl.width(),    //注意正负值
                        validDistance : 20, //wrapEl.width() / 10,   
                        checkEnabled    : function() {
                            return !(nowView === 5);
                        },
                        friction      : true,
                        transition    : true
                    }, 
                        null,
                    {
                        moveSelf      : true,
                        moveEls       : [],
                        maxDistance   : wrapEl.width(),    //注意正负值
                        validDistance : 20, //wrapEl.width() / 10, 
                        checkEnabled    : function() {
                            return !(nowView === 1);
                        },
                        friction      : true,
                        transition    : true
                    }
                ]
            });

            ds1.on('rightBeforeMove', function(ev){
                console.log("Before");
                viewsEl.all('.view-wrap')[nowView - 1].style.cssText="display:block";
            })
            ds1.on('rightMoveEnd', function(ev){
                console.log("END!!!");
            })
            ds1.on('rightPassed', function(ev){
                console.log("rightPassed");
                nowView++;
                viewsEl.removeClass("inview1 inview2 inview3");
                viewsEl.addClass("inview" + nowView);
            });
            ds1.on('leftPassed', function(ev){
                console.log("leftPassed");
                nowView--;
                viewsEl.removeClass("inview1 inview2 inview3");
                viewsEl.addClass("inview" + nowView);
            });
            ds1.on('topPassed', function(ev){
                wrapEl.attr("style", "");
                wrapEl.addClass('search');
            });
        });
    });
}, 0);

