
var createDiv = $('#createEventDiv');

var uploadedEventPictures = [];
var uploadedEventPicturesFileSystem = [];
var eventPictureDropZone;

var uploadedEventDocuments = [];
var uploadedEventDocumentsFileSystem = [];
var eventDocumentDropZone;

function activeButton(id){
    if(!createDiv.find('#'+id).hasClass('disabled')){
        createDiv.find('#'+id).toggleClass('active');
    }
}

function allDayChanged() {
    var alldaybutton = createDiv.find('#allDayCheckBox');
    if(!alldaybutton.hasClass('active')) {
        createDiv.find('#startTime').attr('disabled',true);
        createDiv.find('#endTime').attr('disabled',true);
    } else {
        createDiv.find('#startTime').attr('disabled',false);
        createDiv.find('#endTime').attr('disabled',false);
    }
    alldaybutton.toggleClass('active');
}

function initUploadEventPhoto() {

    eventPictureDropZone = new Dropzone("#uploadEventPicture", {
        url: "/Groups/UploadEventPhoto",
        acceptedFiles: "image/jpeg,image/png,image/gif",
        maxFilesize: 5, // MB
        maxFiles: 1,
        accept: function (file, done) {
            var re = /(?:\.([^.]+))?$/;
            var ext = re.exec(file.name)[1];
            ext = ext.toUpperCase();
            if (ext == "JPG" || ext == "JPEG" || ext == "PNG" || ext == "GIF" || ext == "BMP") {
                document.getElementById("loadingDiv").style.display = 'block';

                done();
            } else {
                done("Veuillez sélectionner un fichier image.");
            }
        },
        success: function (file, response) {
            
            uploadedEventPicturesFileSystem.push(response);
            temporaryFilesToRemove.push(response);

            var res = '../' + response.substring(response.lastIndexOf("EventPhoto"));
            uploadedEventPictures.push(res);
            $("#uploadEventPicture").before('<div class="col-md-2" style="width: 160px!important;margin:5px 5px 5px 0px;padding: 0px;"><img src="' + res + '"/>'
                + '<button class="btn" style="position: absolute;z-index: 10;top: 2px;right: 2px;padding: 0px 2px 0px 2px;display:none;" onclick="removeEventPicture(\'' + res + '\')"><i class="fa fa-close"></button></div>');


            document.getElementById("loadingDiv").style.display = 'none';
            eventPictureDropZone.removeAllFiles();

        },
        complete: function (file) {
            if (file.size > 5 * 1024 * 1024) {

                $('#uploadEventPhotoMessage').html('<div class="alert alert-danger" style="margin: 0;">La taille du fichier est supèrieure à 5MB</div>');
                return false;
            }

            if (!file.type.match('image.*')) {
                $('#uploadEventPhotoMessage').html('<div class="alert alert-danger" style="margin: 0;">Le fichier n\'est pas une image</div>');
                return false;
            }
        },
        error: function () {
            $('#uploadEventPhotoMessage').html('<div class="alert alert-danger" style="margin: 0;">Une erreur s\'est produite, veuillez réessayer</div>');
            document.getElementById("loadingDiv").style.display = 'none';
        }
    });

};

function removeEventPicture(src) {
    if (src != '') {

        $("img[src$='" + src + "']").parent().remove();
        var fileSystemImageFile = src.replace("../", "");
        var fileToDelete = "";
        for (i = 0; i < uploadedEventPicturesFileSystem.length; i++) {
            if (uploadedEventPicturesFileSystem[i].indexOf(fileSystemImageFile) > -1) {
                fileToDelete = uploadedEventPicturesFileSystem[i];
                break;
            }
        }
        if (fileToDelete != "") {
            $.ajax({
                type: 'POST',
                url: '/Groups/DeleteFile',
                data: { "fileName": fileToDelete },
                success: function (data) {

                }
            });
        }
    }
};

function removeEventDocument(src) {
    if (src != '') {

        $("div[value$='" + src + "']").parent().remove();
        var fileSystemDocumentFile = src.replace("../", "");
        var fileToDelete = "";
        for (i = 0; i < uploadedEventDocumentsFileSystem.length; i++) {
            if (uploadedEventDocumentsFileSystem[i].indexOf(fileSystemDocumentFile) > -1) {
                fileToDelete = uploadedEventDocumentsFileSystem[i];
                break;
            }
        }
        if (fileToDelete != "") {
            $.ajax({
                type: 'POST',
                url: '/Groups/DeleteFile',
                data: { "fileName": fileToDelete },
                success: function (data) {

                }
            });
        }
    }
};

function initUploadEventDocument() {
    eventDocumentDropZone = new Dropzone("#uploadEventDocument", {
        url: "/Groups/UploadEventDocument2",
        accept: function (file, done) {
            done();
            document.getElementById("loadingDiv").style.display = 'block';
        },
        success: function (file, response) {

            uploadedEventDocumentsFileSystem.push(response.TempFileName);
            temporaryFilesToRemove.push(response.TempFileName);

            var res = '../' + response.TempFileName.substring(response.TempFileName.lastIndexOf("EventDocument"));
            uploadedEventPictures.push(res);
            $("#uploadEventDocument").before('<div class="col-md-2" style="width: 160px!important;margin:5px 5px 5px 0px;padding: 0px;"><div class="overflowHidden" value="' + res + '" value="' + res + '">' + response.FileName + '</div>'
                + '<button class="btn" style="position: absolute;z-index: 10;top: 2px;right: 2px;padding: 0px 2px 0px 2px;display:none;" onclick="removeEventDocument(\'' + res + '\')"><i class="fa fa-close"></button></div>');

            document.getElementById("loadingDiv").style.display = 'none';
            eventDocumentDropZone.removeAllFiles();

        },
        complete: function (file) {
            if (file.size > 5 * 1024 * 1024) {

                $('#uploadEventDocumentMessage').html('<div class="alert alert-danger" style="margin: 0;">La taille du fichier est supèrieure à 5MB</div>');
                return false;
            }

            if (!file.type.match('image.*')) {
                $('#uploadEventDocumentMessage').html('<div class="alert alert-danger" style="margin: 0;">Le fichier n\'est pas une image</div>');
                return false;
            }
        },
        error: function () {
            $('#uploadEventPhotoMessage').html('<div class="alert alert-danger" style="margin: 0;">Une erreur s\'est produite, veuillez réessayer</div>');
            document.getElementById("loadingDiv").style.display = 'none';
        }
    });
};

function removeEventDoc(effect){
    if(effect){
        var eventDoc =  createDiv.find("#event-doc");
        eventDoc.find('button').addClass('disabled');
    }
    if(document.getElementById("eventDocumentName").value != ''){
        $.ajax({
            type: 'POST',
            url: '/Groups/DeleteFile',
            data: {"fileName" : document.getElementById("eventDocumentName").value},
            success: function (data){
                if(effect){
                    eventDoc.hide();
                    document.getElementById("eventDocumentName").value = '';
                    eventDoc.find('button').removeClass('disabled');
                }
            }
        });
    }
};
function removeEventPhoto(effect) {
    if (effect) {
        var eventPhoto = createDiv.find("#event-photo");
        eventPhoto.find('button').addClass('disabled');
    }
    if (document.getElementById("eventPhotoName").value != '') {
        $.ajax({
            type: 'POST',
            url: '/Groups/DeleteFile',
            data: { "fileName": document.getElementById("eventPhotoName").value },
            success: function (data) {
                if (effect) {
                    eventPhoto.hide();
                    document.getElementById("eventPhotoName").value = '';
                    eventPhoto.find('button').removeClass('disabled');
                }
            }
        });
    }
};

var eventVideoDropZone;
function initUploadVideoModal(){

    eventVideoDropZone = new Dropzone("#uploadEventVideo", {
        url: "/Groups/UploadEventVideo",
        acceptedFiles : "video/mp4",
        maxFilesize: 10, // MB
        maxFiles: 1,
        init: function() {
            this.on("addedfile", function(file) { fileupload_flag = 1; });
            this.on("complete", function(file) { fileupload_flag = 0; });
        },
        accept: function(file, done) {
            var re = /(?:\.([^.]+))?$/;
            var ext = re.exec(file.name)[1];
            ext = ext.toUpperCase();
            if ( ext == "MP4")
            {
                done();
                document.getElementById("loadingDiv").style.display = 'block';

            }else {
                done("Veuillez sélectionner un fichier MP4.");
            }
        },
        success: function( file, response ){
            var eventVideoName = document.getElementById("eventVideoName")
            if(eventVideoName.value != '') {
                removeEventVideo(false);
            }

            eventVideoName.value = response;

            var res =  '../' + response.substring(response.lastIndexOf("EventVideo"));
            var eventVideo =  createDiv.find("#event-video");
            eventVideo.find("source").attr("src",res);
            eventVideo.find("video").load();
            eventVideo.show();

            document.getElementById("loadingDiv").style.display = 'none';
            $('#uploadVideoModal').modal('hide');
			eventVideoDropZone.removeAllFiles();
        },
        complete: function(file) {
            if (file.size > 10*1024*1024) {

                $('#uploadEventVideoMessage').html('<div class="alert alert-danger"  style="margin: 0;">La taille du fichier est supèrieure à 10MB</div>');
                return false;
            }

            if(!file.type.match('video.*')) {
                $('#uploadEventVideoMessage').html('<div class="alert alert-danger"  style="margin: 0;">Le fichier n\'est pas une video</div>');
                return false;
            }
        },
        error: function () {
            $('#uploadEventVideoMessage').html('<div class="alert alert-danger" style="margin: 0;">Une erreur s\'est produite, veuillez réessayer</div>');
            document.getElementById("loadingDiv").style.display = 'none';
        }
    });
}

function removeEventVideo(effect){
    if(effect){
        var eventVideo =  createDiv.find("#event-video");
        eventVideo.find('button').addClass('disabled');
    }
            
    if(document.getElementById("eventVideoName").value != ''){
        $.ajax({
            type: 'POST',
            url: '/Groups/DeleteFile',
            data: {"fileName" : document.getElementById("eventVideoName").value},
            success: function (data){
                if(effect){
                    eventVideo.hide();
                    document.getElementById("eventVideoName").value = '';
                    eventVideo.find('button').removeClass('disabled');
                }
            }
        });
    }
};

function createNewEvent() {
    var title = createDiv.find("#eventTitle").val();
    //var bulleId = createDiv.find("#eventBubble").val();
    //var groupId = createDiv.find("#eventGroup").val();
    var description = createDiv.find("#eventAbout").val();
    var startDate = createDiv.find("#startDate").val();
    var endDate = createDiv.find("#endDate").val();
    var startTime = createDiv.find("#startTime").val();
    var endTime = createDiv.find("#endTime").val();
    var eventInterval = createDiv.find("#interval").val();
    var address = createDiv.find("#eventAddress").val();
    var longitude = createDiv.find('#eventLongitude').val();
    var latitude = createDiv.find('#eventLatitude').val();
    var eventVideo = $("#eventVideoName").val();

    var selectedGroupsDivs = $("#selectedGroupsDiv").find("input[type=checkbox]:checked");
    if (selectedGroupsDivs.length < 1)
        return;
    var selectedGroupIds = [];
    for (i = 0; i < selectedGroupsDivs.length; i++) {
        selectedGroupIds.push(Number($(selectedGroupsDivs[i]).attr('data-groupid')));
    }

    startTime = getUTCTime(startTime);
    endTime = getUTCTime(endTime);

    if(createDiv.find('#allDayCheckBox').hasClass('active'))
    {
        startTime = "";
        endTime = "";
    }
    if (title == null || title == "") {
        $('body').scrollTop(createDiv.find('#eventTitleDiv').offset().top - 60);
        $("#tip1 #errorMessageEvent").html( "Veuillez saisir le titre de l'événement");
        tooltip.pop(createDiv.find("#eventTitleDiv")[0], '#tip1', { sticky: false, position: 3, cssClass: 'no-padding', relative: false });

        return false;
    }
    //if (bulleId == null || bulleId == "") {
    //    $('body').scrollTop(createDiv.find('#eventBubbleDiv').offset().top - 60);
    //    $("#tip1 #errorMessageEvent").html( "Veuillez choisir une bulle");
    //    tooltip.pop(createDiv.find("#eventBubbleDiv")[0], '#tip1', { sticky: false, position: 3, cssClass: 'no-padding', relative: false });

    //    return false;
    //}
    //if (groupId == null || groupId == "") {
    //    $('body').scrollTop(createDiv.find('#eventGroupDiv').offset().top - 60);
    //    $("#tip1 #errorMessageEvent").html(  "Veuillez choisir un groupe");
    //    tooltip.pop(createDiv.find("#eventGroupDiv")[0], '#tip1', { sticky: false, position: 3, cssClass: 'no-padding', relative: false });

    //    return false;
    //}

    if(endDate != null && endDate != "")
    {
        var dateStart = Date.parse(startDate);
        var dateEnd = Date.parse(endDate);
        if(dateEnd < dateStart)
        {
            $('body').scrollTop(createDiv.find('#endDateDiv').offset().top - 60); 
            $("#tip1 #errorMessageEvent").html( "La date de fin doit être supérieure à la date de début");
            tooltip.pop(createDiv.find("#endDateDiv")[0], '#tip1', { sticky: false, position: 3, cssClass: 'no-padding' });

            return false;
        }
    }

    var e = createDiv.find("#recurrenceSelectList");
    var recurrence = e.find(":selected").index();

    var interval = null;
    if(recurrence == 0)
        interval = 0;
    if (recurrence == 1)
    {
        if(eventInterval == null || eventInterval =="")
        {
            $('body').scrollTop(createDiv.find('#intervalDiv').offset().top - 60); 
            $("#tip1 #errorMessageEvent").html("Veuillez saisir l'intervalle de récurrence de l'événement");
            tooltip.pop(createDiv.find("#intervalDiv")[0], '#tip1', { sticky: false, position: 3, cssClass: 'no-padding' });
            return false;
        }
        interval = eventInterval;

    }
    if (recurrence == 2)
    {
        if(eventInterval == null || eventInterval =="")
        {
            $('body').scrollTop(createDiv.find('#intervalDiv').offset().top - 60); 
            $("#tip1 #errorMessageEvent").html( "Veuillez saisir l'intervalle de récurrence de l'événement");
            tooltip.pop(createDiv.find("#intervalDiv")[0], '#tip1', { sticky: false, position: 3, cssClass: 'no-padding' });
            return false;

        }
        interval = eventInterval;
    }
    if(recurrence == 3)
    {
        if(eventInterval == null || eventInterval =="")
        {
            $('body').scrollTop(createDiv.find('#intervalDiv').offset().top - 60); 
            $("#tip1 #errorMessageEvent").html( "Veuillez saisir l'intervalle de récurrence de l'événement");
            tooltip.pop(createDiv.find("#intervalDiv")[0], '#tip1', { sticky: false, position: 3, cssClass: 'no-padding' });
            return false;
        }
        interval = eventInterval;
    }

    var daysOfWeek = [];
    if (recurrence == 2)
    {
        if(createDiv.find('#weeklySunday').hasClass('active'))
            daysOfWeek.push(0);
        if(createDiv.find('#weeklyMonday').hasClass('active'))
            daysOfWeek.push(1);
        if(createDiv.find('#weeklyTuesday').hasClass('active'))
            daysOfWeek.push(2);
        if(createDiv.find('#weeklyWendsday').hasClass('active'))
            daysOfWeek.push(3);
        if(createDiv.find('#weeklyThursday').hasClass('active'))
            daysOfWeek.push(4);
        if(createDiv.find('#weeklyFriday').hasClass('active'))
            daysOfWeek.push(5);
        if(createDiv.find('#weeklySatudray').hasClass('active'))
            daysOfWeek.push(6);

        if(daysOfWeek.length < 1)
        {
            $('body').scrollTop(createDiv.find('#daysOfWeekDiv').offset().top - 60); 
            $("#tip1 #errorMessageEvent").html( "Veuillez sélectionner la liste des jours");
            tooltip.pop(createDiv.find("#daysOfWeekDiv")[0], '#tip1', { sticky:false, position: 3, cssClass: 'no-padding' });
            return false;
        }
    }

    $("#loadingDiv").show();

    var currentDate = new Date()
    var timeZoneOffset = -currentDate.getTimezoneOffset();
    var created = 0;
    for (i = 0; i < selectedGroupIds.length; i++)
    {
        $.ajax({
            type: "POST",
            url: "/Groups/CreateEvent",
            data: {
                "groupId": selectedGroupIds[i],
                "title": title,
                "about": description,
                "address": address,
                "longitude": longitude,
                "latitude": latitude,
                "startDate": startDate,
                "endDate": endDate,
                "startTime": startTime,
                "endTime": endTime,
                "recurrence": recurrence,
                "interval": interval,
                "daysOfWeek": daysOfWeek,
                "eventVideo": eventVideo,
                "timeDiffToUTC": timeZoneOffset,
                "pictures": uploadedEventPicturesFileSystem,
                "documents": uploadedEventDocumentsFileSystem
            },
            success: function (data) {

                window.onbeforeunload = null;
                window.onunload = null;

                closeCreateEvent();

                var htmlData = $(data.View);
                var txt = htmlData.find("#eventTime")[0];
                if (txt) {
                    var start = getLocalTime(txt.innerText.substring(0, 5));
                    var end = getLocalTime(txt.innerText.substring(8, 14));
                    htmlData.find("#eventTime")[0].innerText = start + ' à ' + end;
                }

                var attachments = data.Event.Pictures;
                var images = [];
                if (attachments != null && attachments != undefined) {
                    for (j = 0; j < attachments.length; j++) {
                        images.push(attachments[j].AttachmentUri);
                    }
                }
                if (images.length > 0) {
                    htmlData.find("#eventPhotosDiv" + data.Event.EventId).imagesGrid({
                        images: images,
                        align: true
                    });
                }


                $("#columns").prepend(htmlData[0]);
                initUploadEventPictureEdit(data.Event.EventId);
                initUploadEventDocumentEdit(data.Event.EventId);

                if (window.location.href.toLowerCase().indexOf('profile') > -1)
                {
                    initPartialMaps2($("#columns").children().first()[0]);
                    initDateTimeInputs($("#columns").children().first()[0]);
                    plyr.setup();
                }
               
                created++; if (created == selectedGroupIds.length) {
                    if (window.location.href.toLowerCase().indexOf('profile') > -1) {

                        $("#columns").children().first().find("video").load();
                        $('body').scrollTop($("#columns").children().first().offset().top - 60);
                    }
                    $("#loadingDiv").hide();


                    $("#uploadEventImagesDiv img").parent().remove();
                    $("#uploadEventDocumentsDiv .overflowHidden").parent().remove();
                    resetCreateDiv();
                }

            },
            error: function (data) {
                created++;
                if (created == selectedGroupIds.length) {
                    $("#loadingDiv").hide();
                }
            }
        });
    }
    
}

function resetCreateDiv() {
    //createDiv.find('#eventBubble').select2("val", "");
    //createDiv.find('#eventGroup').select2("val", "");
    //createDiv.find('#eventGroup').attr("disabled", true);
    createDiv.find('#eventTitle').val('');
    createDiv.find("#eventAbout").val('');
    createDiv.find("#startDate").val('').change();
    createDiv.find("#endDate").val('');
    createDiv.find("#startTime").val('00:00:00');
    createDiv.find("#endTime").val('12:00:00');
    createDiv.find("#interval").val('');
    createDiv.find("#eventAddress").val('');
    createDiv.find('#eventLongitude').val('');
    createDiv.find('#eventLatitude').val('');
    createDiv.find('#recurrenceSelectList option').removeAttr('selected');
    createDiv.find('.dayButton').addClass('disabled').removeClass('active');
    createDiv.find('#interval').attr('disabled', true);
    createDiv.find('#allDayCheckBox').removeClass('active');
    createEventMap = null;
    $("#selectBubblesDiv").find("input[type=checkbox]").removeAttr('checked');
    $("#selectedGroupsDiv").find("input[type=checkbox]").removeAttr('checked');
    $("#selectBubblesDiv").show();
    $("#selectGroupsDiv").hide();
    $("#createEventProfileDiv").hide();
    $('#eventAddressDivCreate').html('<input type="text" class="form-control createEventInput" id="eventAddress" />'
        + '<div id="map" style="height:300px"></div>');

                        
    initMapCreateEvent();
    
}

function updateRecurrenceForm() {
    var e = createDiv.find("#recurrenceSelectList");
    var recurrence = e.find(":selected").index();
    if (recurrence == 0) {
        createDiv.find('.dayButton').addClass('disabled').removeClass('active');
        createDiv.find('#interval').attr('disabled',true);
    } else {

        createDiv.find('#interval').attr('disabled',false);

        if (recurrence == 1) {
            createDiv.find('.dayButton').addClass('disabled').removeClass('active');

        } else if (recurrence == 2) {
            createDiv.find('.dayButton').removeClass('disabled');

        } else if (recurrence == 3) {
            createDiv.find('.dayButton').addClass('disabled').removeClass('active');

        }
    }

}

function showCreateEvent() {
    $(".hideWhenCreateEvent").hide();
    $("#addItemsDiv").hide();
    $("#documentContentDiv").hide();
    $("#optionsOpenDiv").show();
    initMapCreateEvent();
    createDiv.show();
    google.maps.event.trigger($('#createEventDiv').find('#map')[0], 'resize');

    window.onbeforeunload= function(){
        if(  createDiv.is(":visible"))
            return 'Etes vous sure de quitter la page?  Vous allez perdre les données inserés.';
            
        return null;
    };
    window.onunload = function () {
        removeTemporaryFiles();
        removeEventVideo(false);
    };
}

function closeCreateEvent() {
    createDiv.hide();
    $("#optionsOpenDiv").hide();
    $(".hideWhenCreateEvent").show();
    $("#addItemsDiv").show();
    $("#documentContentDiv").show();
    removeEventVideo(true);
    resetCreateDiv();

    window.onbeforeunload= null;
    window.onunload= null;
}

$('.date-picker').datepicker({
    orientation: "top auto",
    isRTL: false,
    format: 'yyyy-mm-dd',
    autoclose: true,
    language: 'fr'
});

function openUploadPhotoModal()
{
    eventPhotoDropZone.removeAllFiles();
    $('#uploadEventPhotoMessage').html('<div class="alert alert-info" style="margin: 0;">Sélectionner un fichier</div>');
    $("#uploadPhotoModal").modal();
}
function openUploadFileModal()
{
    eventDocumentDropZone.removeAllFiles();
    $('#uploadEventDocMessage').html('<div class="alert alert-info" style="margin: 0;">Sélectionner un fichier</div>');
    $("#uploadDocumentModal").modal();
}

function openUploadVideoModal()
{
    eventVideoDropZone.removeAllFiles();
    $('#uploadEventVideoMessage').html('<div class="alert alert-info" style="margin: 0;">Sélectionner un fichier</div>');
    $("#uploadVideoModal").modal();
}

$(document).ready(function () {
    createDiv.find('#startDate').on('change paste keyup', function () {
        var startDate = $(this).val();

        if (startDate && startDate.length > 0) {
            createDiv.find('.hideIfNoStartDateOnCreate').slideDown();
        }
        else {
            createDiv.find('.hideIfNoStartDateOnCreate').slideUp();
            createDiv.find('.hideIfNoStartDateOnCreate input').val('');
        }
    });

    //createDiv.find('#eventBubble').select2({
    //    placeholder: "Bulle",
    //    ajax: {
    //        type: "POST",
    //        url: "/Bubbles/GetManagedBubbles",
    //        dataType: 'json',
    //        delay: 250,
    //        data: function (params) {
    //            return {
    //                withAdministratedGroups: true,
    //                nameFilter: params.term, // search term
    //            };
    //        },
    //        processResults: function (data) {
              
    //            return {
    //                results: data.map(function (item) {
    //                    return {
    //                        id: item.BubbleId,
    //                        text: item.Name
    //                    }
    //                })
    //            };
    //        },
    //        cache: true
    //    },
    //    minimumInputLength: 2
    //});

    //createDiv.find('#eventBubble').on('change', function (e) {
    //    createDiv.find('#eventGroup').select2("val", "");
    //    if ($(this).val() == "") {
    //        createDiv.find('#eventGroup').attr("disabled", true);
    //    } else {
    //        createDiv.find('#eventGroup').attr("disabled", false);
    //    }
    //});

    //createDiv.find('#eventGroup').select2({
    //    placeholder: "Groupe",
    //    ajax: {
    //        type: "POST",
    //        url: "/Bubbles/GetBubbleManagedGroups",
    //        dataType: 'json',
    //        delay: 250,
    //        data: function (params) {
    //            return {
    //                bubbleId: createDiv.find('#eventBubble').val(),
    //                pageIndex: 0,
    //                pageSize: 10,
    //                nameFilter: params.term, // search term
    //            };
    //        },
    //        processResults: function (data) {

    //            return {
    //                results: data.map(function (item) {
    //                    return {
    //                        id: item.GroupId,
    //                        text: item.Name
    //                    }
    //                })
    //            };
    //        },
    //        cache: true
    //    },
    //    minimumInputLength: 2
    //});
});

var groupsIndex = 0;
var groupsTake = 40;

function goToSelectGroups() {
    $("#bubbleSelectError").hide();
    var selectedBubbleDivs = $("#selectBubblesDiv").find("input[type=checkbox]:checked");
    if (selectedBubbleDivs.length < 1)
    {
        $("#bubbleSelectError").text('Veuillez sélectionner au moins une bulle');
        $("#bubbleSelectError").show();
        return;
    }
    var selectedBubbleIds = [];
    $("#selectedGroupsDiv").html('');
    $('#selectedGroupsDiv').unbind('scroll');
    $("#loadingDiv").show();
    for (i = 0; i < selectedBubbleDivs.length; i++) {
        selectedBubbleIds.push(Number($(selectedBubbleDivs[i]).attr('id')));
    }
    groupsIndex = 0;
    getGroups(selectedBubbleIds);
    $('#selectedGroupsDiv').on('scroll', function () {
        if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
            groupsIndex++;
            getGroups(selectedBubbleIds);
        }
    })
}
function goBackToSelectBubbles() {
    $("#selectGroupsDiv").hide();

    $("#selectBubblesDiv").show();
}
function goBackToSelectGroup() {
    $("#createEventProfileDiv").hide();
    $("#selectGroupsDiv").show();
}
function goToCreateEvent() {
    $("#groupSelectError").hide();
    var selectedGroupsDivs = $("#selectedGroupsDiv").find("input[type=checkbox]:checked");
    if (selectedGroupsDivs.length < 1) {
        $("#groupSelectError").text('Veuillez sélectionner au moins un groupe');
        $("#groupSelectError").show();
        return;
    }
    $("#selectGroupsDiv").hide();
    $("#createEventProfileDiv").show();
    google.maps.event.trigger($('#createEventDiv').find('#map')[0], 'resize');

}
function getGroups(selectedBubbleIds) {
    $.ajax({
        type: "POST",
        url: "/Bubbles/GetAdministratedGroupsByBubbles",
        data: JSON.stringify({
            bubbleIds: selectedBubbleIds,
            page: groupsIndex,
            take: groupsTake
        }),
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                var image = "";
                if (data[i].Picture != null)
                    image = data[i].Picture;
                else
                    image = "../Content/Images/DefaultGroupImage.png";
                var item =
                    '<div class="row">'
                    + '<div class="col-md-12" style="margin-top: 0px;vertical-align:middle;">'
                    + '<img class="" src="' + image + '" style="height:53px;width:53px;margin-top:10px;border-radius: 50%;object-fit:cover">'
                    + '<span style="margin-left:10px">' + data[i].Name + '</span>'
                    + '<div class="ios-switch pull-right switch-md" style="margin-top:25px;">'
                    + '<input type="checkbox" class="js-switch fixed-header-check" name="createEventSelectedGroup" id="' + data[i].GroupId + '" data-groupid="' + data[i].GroupId + '" >'
                    + '</div>'

                    + '</div>'
                    + '</div>'
                    + '<div class="separator"></div>'
                ;

                $("#selectedGroupsDiv").append(
                    item
                );
                new Switchery($("#selectedGroupsDiv").find("#" + data[i].GroupId + "[name=createEventSelectedGroup]"), { color: '#3490FF' });

            }

            $("#selectBubblesDiv").hide();
            $("#selectGroupsDiv").show();
            $("#loadingDiv").hide();

            //return data;
        },
        error: function (data) {
            $("#loadingDiv").hide();
            //return null;
        }
    });
}
