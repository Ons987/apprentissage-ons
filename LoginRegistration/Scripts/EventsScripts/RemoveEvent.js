
function removeEvent(eventId) {
    document.getElementById("removeEventModalFooter").innerHTML = '';
    document.getElementById("removeEventModalContent").innerHTML = 'Etes vous sûr de vouloir supprimer cet événement?';
    document.getElementById("removeEventModalHeader").innerHTML = 'Suppression d\'un événement';
    $("#removeEventModalFooter").append(
        '<button type="button" class="btn" data-dismiss="modal">ANNULER</button>'
        + '<button type="button" class="btn blue-text-color" onclick="removeEventConfirmed(this,' + eventId + ')">CONFIRMER</button>'

    )
    $("#removeEventModal").modal('show');
}

function removeEventConfirmed(sender, eventId) {
    $(sender).addClass('disabled');
    $('#loadingDiv').show();
    $.ajax({
        type: "POST",
        url: "/Events/RemoveEvent",
        data: {
            "eventId": eventId
        },
        success: function (data) {
            if (data.result == true) {
                
                $("#removeEventModal").modal('hide');
                if(window.location.href.indexOf("/Events?eventId=" + eventId) > -1) {
                    window.location = "/Bubbles";
                }
                else
                {
                    $("#eventFeed" + eventId).remove();
                }
            }
            else {
                document.getElementById("removeEventModalContent").innerHTML = data.errorMessage;
                document.getElementById("removeEventModalHeader").innerHTML = 'Une erreur s\'est produite';
                document.getElementById("removeEventModalFooter").innerHTML = '<button type="button" class="btn" data-dismiss="modal">OK</button>';
            }
            $('#loadingDiv').hide();
        },
        error: function (data) {
            $('#loadingDiv').hide();
        }
    });
}