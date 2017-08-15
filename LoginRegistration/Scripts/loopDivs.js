$(document).ready(function () {
    // constants
    var loopPeriod = 2000; // millisecond
    var duration = 500;

    //looping
    var interval = setInterval(function () {
        $('.looper').each(function () {
            if (isScrolledIntoView(this)) {
                if ($(this).children().length == 1) {
                    $(this).children().show();
                } else if ($(this).children().length > 1) {
                    if ($(this).children(':visible').length != 1) {
                        //initialisation
                        $(this).children().hide();
                        $(this).children().first().show();
                        return;
                    }
                    var next = $(this).children(':visible').index() + 1;
                    if (next >= $(this).children().length)
                        next = 0;
                    var toHide = $(this).children(':visible')
                    var toShow = $($(this).children().get(next));
                    toHide.hide();
                    toShow.show();
                }
            }
           
        });
    },loopPeriod);
});

function stopLoop(looper) {
    $(looper).removeClass('looper');
    $(looper).children().show();
}

function isScrolledIntoView(elem)
{
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}