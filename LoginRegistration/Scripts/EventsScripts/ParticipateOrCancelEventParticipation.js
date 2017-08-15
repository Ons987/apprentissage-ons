
function participateOrCancelEventParticipation(eventId) {
    var participateButton = document.getElementById("participateEventDiv" + eventId);
    var isParticipating = false;
    var urlAction = "/Events/ParticipateToEvent";

    if (participateButton.className == 'eventParticipationEnabled') {
        isParticipating = true;
        urlAction = "/Events/CancelParticipationToEvent";
    }
    else {
        urlAction = "/Events/ParticipateToEvent";
        
    }
    $.ajax({
        type: "POST",
        url: urlAction,
        data: {
            "eventId": eventId
        },
        success: function (data) {
            if (participateButton.className == 'eventParticipationEnabled')
            {
                participateButton.className = 'eventParticipationDisabled';
                var button = participateButton.getElementsByClassName("btn btn-info")[0];
                (button).className = "btn btn-default";
                (button).innerHTML = "Je participe";
            }
            else
            {
                participateButton.className = 'eventParticipationEnabled';
                var button = participateButton.getElementsByClassName("btn btn-default")[0];
                (button).className = "btn btn-info";
                (button).innerHTML = '<img class="participateIcon" src="../Content/Images/participateIcon.png" /> <label class="no-m">Je participe</label>';
            }
        },
        error: function (data) {

        }
    });
}