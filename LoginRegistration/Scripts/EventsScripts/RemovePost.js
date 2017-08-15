

function showDeletePostModal(eventPostId,eventId)
{
    document.getElementById("removePostModalFooter").innerHTML = '';
    $("#removePostModalFooter").append(
        '<button type="button" class="btn" data-dismiss="modal">ANNULER</button>'
        + '<button type="button" class="btn blue-text-color" onclick="removePost(' + eventPostId + ',' + eventId+')">SUPPRIMER</button>'

    )
    $("#removeEventPostModal").modal('show');
}

function removePost(eventPostId, eventId) {

    $.ajax({
        type: "POST",
        url: "/Events/RemovePost",
        data: {
            "eventPostId": eventPostId
        },
        success: function (data) {
            
            if(data==true)
            {
                var value = parseInt(document.getElementById('postsCount' + eventId).innerHTML, 10);
                value = isNaN(value) ? 0 : value;
                value--;
                document.getElementById('postsCount' + eventId).innerHTML = value;

                document.getElementById("eventPost" + eventPostId).remove();
                $("#removeEventPostModal").modal('hide');
            }
            else
            {
                $("#removeEventPostModal").modal('hide');
            }

        },
        error: function (data) {

        }
    });
}
