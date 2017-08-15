
function showShareEventModal(eventId)
{
    document.getElementById("shareEventModalFooter").innerHTML = '';
    document.getElementById("shareEventModalContent").innerHTML = '';

    document.getElementById("shareEventModalFooter").innerHTML = 
        '<button type="button" class="btn" data-dismiss="modal">ANNULER</button>'
        + '<button type="button" class="btn blue-text-color" onclick="shareEvent(this,' + eventId + ')">PARTAGER</button>'
    ;

    document.getElementById("shareEventModalContent").innerHTML = 

    '<div class="row noMarginRow">'
    + '<div class="col-md-12 noPaddingDiv" id="shareEventBubbleDiv">'
    + '<div class="required">*</div>'
    + '<select class="form-control createEventInput" style="width:100%;" id="shareEventBubble"></select>'
    + '</div>'
    + '</div>'                  
    + '<br />'               
    + '<div class="row noMarginRow">'          
    + '<div class="col-md-12 noPaddingDiv" id="hareEventGroupDiv">'                
    + '<div class="required">*</div>'                   
    + '<select class="form-control createEventInput" style="width:100%;" id="shareEventGroup" disabled></select>'                        
    + ' </div>'                      
     + '</div>';

    $('#shareEventModal').find('#shareEventBubble').select2({
        dropdownParent: $("#shareEventModal"),
        placeholder: "Bulle",
        ajax: {
            type: "POST",
            url: "/Bubbles/GetManagedBubbles",
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    withAdministratedGroups: true,
                    nameFilter: params.term, // search term
                };
            },
            processResults: function (data) {

                return {
                    results: data.map(function (item) {
                        return {
                            id: item.BubbleId,
                            text: item.Name
                        }
                    })
                };
            },
            cache: true
        },
        minimumInputLength: 2
    });

    $('#shareEventModal').find('#shareEventBubble').on('change', function (e) {
        $('#shareEventModal').find('#shareEventGroup').select2("val", "");
        if ($(this).val() == "") {
            $('#shareEventModal').find('#shareEventGroup').attr("disabled", true);
        } else {
            $('#shareEventModal').find('#shareEventGroup').attr("disabled", false);
        }
    });

    $('#shareEventModal').find('#shareEventGroup').select2({
        dropdownParent: $("#shareEventModal"),
        placeholder: "Groupe",
        ajax: {
            type: "POST",
            url: "/Bubbles/GetBubbleManagedGroups",
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    bubbleId: $('#shareEventModal').find('#shareEventBubble').val(),
                    pageIndex: 0,
                    pageSize: 10,
                    nameFilter: params.term, // search term
                };
            },
            processResults: function (data) {

                return {
                    results: data.map(function (item) {
                        return {
                            id: item.GroupId,
                            text: item.Name
                        }
                    })
                };
            },
            cache: true
        },
        minimumInputLength: 2
    });


    
    $('#shareEventModal').modal('show');

}


function shareEvent(item, eventId)
{
    document.getElementById("loadingDiv").style.display = 'block';
    var bulleId = $('#shareEventModal').find("#shareEventBubble").val();
    var groupId = $('#shareEventModal').find("#shareEventGroup").val();

    if (bulleId == null || bulleId == "") {
        $('body').scrollTop($('#shareEventModal').find('#shareEventBubbleDiv').offset().top - 60);
        $("#tip1 #errorMessageEvent").html( "Veuillez choisir une bulle");
        tooltip.pop($('#shareEventModal').find("#eventBubbleDiv")[0], '#tip1', { sticky: false, position: 3, cssClass: 'no-padding', relative: false });

        return false;
    }
    if (groupId == null || groupId == "") {
        $('body').scrollTop($('#shareEventModal').find('#shareEventGroupDiv').offset().top - 60);
        $("#tip1 #errorMessageEvent").html(  "Veuillez choisir un groupe");
        tooltip.pop($('#shareEventModal').find("#eventGroupDiv")[0], '#tip1', { sticky: false, position: 3, cssClass: 'no-padding', relative: false });

        return false;
    }

    $.ajax({
        type: "POST",
        url: "/Events/ShareEvent",
        data: {
            "groupId": groupId,
            "originalEventId" : eventId
        },

        success: function (data) {
            if (data.result != undefined) {
                if (data.result == false) {
                    document.getElementById("loadingDiv").style.display = 'none';
                    document.getElementById("shareEventModalFooter").innerHTML = '';
                    document.getElementById("shareEventModalContent").innerHTML = '';
                    document.getElementById("shareEventModalContent").innerHTML = data.errorMessage;
                    document.getElementById("shareEventModalFooter").innerHTML =
                    '<button type="button" class="btn" data-dismiss="modal">OK</button>'
                    ;
                    return false;
                }
                else {
                    document.getElementById("loadingDiv").style.display = 'none';

                    document.getElementById("shareEventModalFooter").innerHTML = '';
                    document.getElementById("shareEventModalContent").innerHTML = '';
                    document.getElementById("shareEventModalContent").innerHTML = 'Evénement partagé avec succès';
                    document.getElementById("shareEventModalFooter").innerHTML =
                    '<button type="button" class="btn" data-dismiss="modal">OK</button>'
                    ;
                }
            }
            else
            {
                document.getElementById("loadingDiv").style.display = 'none';
                document.getElementById("shareEventModalFooter").innerHTML = '';
                document.getElementById("shareEventModalContent").innerHTML = '';
                document.getElementById("shareEventModalContent").innerHTML = 'Une erreur s\'est produite';
                document.getElementById("shareEventModalFooter").innerHTML =
                '<button type="button" class="btn" data-dismiss="modal">OK</button>'
                ;
            }

        },
        error: function (data) {
            document.getElementById("loadingDiv").style.display = 'none';
            document.getElementById("shareEventModalFooter").innerHTML = '';
            document.getElementById("shareEventModalContent").innerHTML = '';
            document.getElementById("shareEventModalContent").innerHTML = 'Une erreur s\'est produite';
            document.getElementById("shareEventModalFooter").innerHTML =
            '<button type="button" class="btn" data-dismiss="modal">OK</button>'
            ;
        }
    });
}