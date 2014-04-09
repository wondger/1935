window.addEventListener('DOMContentLoaded', function() {
    var targets = document.getElementsByClassName('special-op-button');
    Array.prototype.forEach.call(targets, function(e) {
        e.addEventListener('click', function(e) {
            var title = e.currentTarget.title;
            switch(title) {
                case '嬉':
                    console.log(title);
                    break;
                case '笑':
                    console.log(title);
                    break;
                case '怒':
                    console.log(title);
                    break;
                case '骂':
                    console.log(title);
                    break;
                default:
                    console.log(title);
                    break;
            }
        });
    });
});
