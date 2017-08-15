
function likeOrUnlikeEvent(eventId) {
    var likeButton = document.getElementById("likeEventDiv" + eventId);
    var liked = false;
    var urlAction = "/Events/LikeEvent";
    if (likeButton.className == 'eventLikeEnabled') {
        liked = true;
        urlAction = "/Events/UnlikeEvent";
        likeButton.className = 'eventLikeDisabled';
    }
    else {
        likeButton.className = 'eventLikeEnabled';
    }
    $.ajax({
        type: "POST",
        url: urlAction,
        data: {
            "eventId": eventId
        },
        success: function (data) {
                var value = parseInt(document.getElementById('likesCount' + eventId).innerHTML, 10);
                value = isNaN(value) ? 0 : value;
                if (liked)
                    value--;
                else
                    value++;

                document.getElementById('likesCount' + eventId).innerHTML = value;
        },
        error: function (data) {

        }
    });
}