
var uploadedEventEditPictures = [];
var uploadedEventEditPicturesFileSystem = [];
var eventPictureEditDropZone;

var uploadedEventEditDocuments = [];
var uploadedEventEditDocumentsFileSystem = [];
var eventDocumentEditDropZone;

var eventEditImagesToRemove = [];
var eventEditDocumentsToRemove = [];

function removeEventPictureEdit(src, id) {

    if (src != '') {
        if (id != null && id != undefined) {
            eventEditImagesToRemove.push(id);
            $("img[src$='" + src + "']").parent().hide();
            return;
        }

        $("img[src$='" + src + "']").parent().remove();
        var fileSystemImageFile = src.replace("../", "");
        var fileToDelete = "";
        var i = 0;
        for (i = 0; i < uploadedEventEditPicturesFileSystem.length; i++) {
            if (uploadedEventEditPicturesFileSystem[i].indexOf(fileSystemImageFile) > -1) {
                fileToDelete = uploadedEventEditPicturesFileSystem[i];
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

}

function initUploadEventPictureEdit(eventId) {
    if (document.getElementById("uploadEventPictureEdit" + eventId) != null && document.getElementById("uploadEventPictureEdit" + eventId) != undefined)
        eventPictureEditDropZone = new Dropzone("#uploadEventPictureEdit" + eventId, {
            url: "/Groups/UploadEventPhoto",
            acceptedFiles: "image/jpeg,image/png,image/gif",
            maxFilesize: 5, // MB
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
                var res = '../' + response.substring(response.lastIndexOf("EventPhoto"));

                uploadedEventEditPicturesFileSystem.push(response);
                temporaryFilesToRemove.push(response);

                $("#uploadEventPictureEdit" + eventId).before(
                    '<div class="col-md-2 partnershipItemAttachment" style="width: 160px;margin:5px 5px 5px 0px;padding: 0px;" id="eventPictureEdit' + eventId + '">'
                    + '<img src="' + res + '" />'
                    + '<button class="btn" style="position: absolute;z-index: 10;top: 2px;right: 2px;padding: 0px 2px 0px 2px;display:none;" onclick="removeEventPictureEdit(\'' + res + '\', null)">'
                    + '<i class="fa fa-close"> </i>'
                    + '</button>'
                    + '</div>'
                )

                document.getElementById("loadingDiv").style.display = 'none';
                eventPictureEditDropZone.removeAllFiles();

            },
            complete: function (file) {
                if (file.size > 5 * 1024 * 1024) {

                    $('#uploadEventPictureMessage' + eventId).html('<div class="alert alert-danger" style="margin: 0;">La taille du fichier est supèrieure à 5MB</div>');
                    $('#uploadEventPictureMessage' + eventId).show();
                    return false;
                }

                if (!file.type.match('image.*')) {
                    $('#uploadEventPictureMessage' + eventId).html('<div class="alert alert-danger" style="margin: 0;">Le fichier n\'est pas une image</div>');
                    $('#uploadEventPictureMessage' + eventId).show();
                    return false;
                }
            },
            error: function (data) {
                $('#uploadEventPictureMessage' + eventId).html('<div class="alert alert-danger" style="margin: 0;">Une erreur s\'est produite, veuillez réessayer</div>');
                $('#uploadEventPictureMessage' + eventId).show();
                document.getElementById("loadingDiv").style.display = 'none';
            }
        });

};

function removeEventDocumentEdit(src, id) {

    if (src != '') {
        if (id != null && id != undefined) {
            eventEditDocumentsToRemove.push(id);
            $("div[value$='" + src + "']").parent().hide();
            return;
        }

        $("div[value$='" + src + "']").parent().remove();
        var fileSystemDocumentFile = src.replace("../", "");
        var fileToDelete = "";
        var i = 0;
        for (i = 0; i < uploadedEventEditDocumentsFileSystem.length; i++) {
            if (uploadedEventEditDocumentsFileSystem[i].indexOf(fileSystemDocumentFile) > -1) {
                fileToDelete = uploadedEventEditDocumentsFileSystem[i];
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

}

function initUploadEventDocumentEdit(eventId) {
    if (document.getElementById("uploadEventDocumentEdit" + eventId) != null && document.getElementById("uploadEventDocumentEdit" + eventId) != undefined)
        eventDocumentEditDropZone = new Dropzone("#uploadEventDocumentEdit" + eventId, {
            url: "/Groups/UploadEventDocument2",
            acceptedFiles: "image/jpeg,image/png,image/gif",
            maxFilesize: 5, // MB
            accept: function (file, done) {
                done();
            },
            success: function (file, response) {

                uploadedEventEditDocumentsFileSystem.push(response.TempFileName);
                temporaryFilesToRemove.push(response.TempFileName);

                var res = '../' + response.TempFileName.substring(response.TempFileName.lastIndexOf("EventDocument"));
                uploadedEventEditDocuments.push(res);
                $("#uploadEventDocumentEdit" + eventId).before('<div class="col-md-2" style="width: 160px!important;margin:5px 5px 5px 0px;padding: 0px;"><div class="overflowHidden" value="' + res + '" value="' + res + '">' + response.FileName + '</div>'
                    + '<button class="btn" style="position: absolute;z-index: 10;top: 2px;right: 2px;padding: 0px 2px 0px 2px;display:none;" onclick="removeEventDocument(\'' + res + '\')"><i class="fa fa-close"></button></div>');

                document.getElementById("loadingDiv").style.display = 'none';
                eventDocumentDropZone.removeAllFiles();

            },
            complete: function (file) {
                if (file.size > 5 * 1024 * 1024) {

                    $('#uploadEventDocumentMessage' + eventId).html('<div class="alert alert-danger" style="margin: 0;">La taille du fichier est supèrieure à 5MB</div>');
                    return false;
                }

                if (!file.type.match('image.*')) {
                    $('#uploadEventDocumentMessage' + eventId).html('<div class="alert alert-danger" style="margin: 0;">Le fichier n\'est pas une image</div>');
                    return false;
                }
            },
            error: function () {
                $('#uploadEventDocumentMessage' + eventId).html('<div class="alert alert-danger" style="margin: 0;">Une erreur s\'est produite, veuillez réessayer</div>');
                document.getElementById("loadingDiv").style.display = 'none';
            }
        });

};

function activeButtonEdit(eventId, id) {
    if(!$('#eventFeed'+eventId).find('#'+id).hasClass('disabled')){
        $('#eventFeed'+eventId).find('#'+id).toggleClass('active');
    }
}

function allDayChangedEdit(eventId) {
    var alldaybutton = $('#eventFeed'+eventId).find('#allDayCheckBox');
    if(!alldaybutton.hasClass('active')) {
        $('#eventFeed'+eventId).find('#startTime').attr('disabled',true);
        $('#eventFeed'+eventId).find('#endTime').attr('disabled',true);
    } else {
        $('#eventFeed'+eventId).find('#startTime').attr('disabled',false);
        $('#eventFeed'+eventId).find('#endTime').attr('disabled',false);
    }
    alldaybutton.toggleClass('active');
}

var eventIdUpload;
function defineEventId(eventId){
    eventIdUpload = eventId;
};

//function removeEditEventPhoto(eventId, effect) {
//    var eventPhoto = $('#eventFeed' + eventId).find("#event-photo");
//    if(effect){
//        eventPhoto.find('button').addClass('disabled');
//    }
//    if ($("#eventPhotoNameEdit").val() != '') {
//        $.ajax({
//            type: 'POST',
//            url: '/Groups/DeleteFile',
//            data: { "fileName": $("#eventPhotoNameEdit").val() },
//            success: function (data) {
//                if (effect) {
//                    eventPhoto.find("img").removeAttr("src");
//                    eventPhoto.hide();
//                    eventPhoto.find('button').removeClass('disabled');
//                }
//                $("#eventPhotoNameEdit").val('');
//            }
//        });
//    } else if (eventPhoto.find("img").attr("src")) {
//        if (effect) {
//            eventPhoto.find("img").removeAttr("src");
//            eventPhoto.hide();
//            eventPhoto.find('button').removeClass('disabled');
//        }
//    }
//};

function initEditUploadDocumentModal(eventId){
    var uploadEventDocumentEdit = new Dropzone("#uploadEventDocumentEdit", {
        url: "/Groups/UploadEventDocument",
        maxFilesize: 5, // MB
        maxFiles: 1,
        init: function() {
            this.on("addedfile", function(file) { fileupload_flag = 1; });
            this.on("complete", function(file) { fileupload_flag = 0; });
        },
        accept: function(file, done) {
            done();
            document.getElementById("loadingDiv").style.display = 'block';
        },
        success: function( file, response ){
            if($("#eventDocumentNameEdit").val() != '') {
                removeEditEventDoc(eventIdUpload,false);
            }

            $("#eventDocumentNameEdit").val(response);

            var res = response.substring(response.lastIndexOf(".") + 1);
            var eventDoc = $('#eventFeed' + eventIdUpload).find("#event-doc");

            eventDoc.find('p').html('un fichier ' + res);
            eventDoc.show();

            document.getElementById("loadingDiv").style.display = 'none';
            $('#uploadDocumentModalEdit').modal('hide');
			uploadEventDocumentEdit.removeAllFiles();
        },
        complete: function(file) {
            if (file.size > 5*1024*1024) {

                $('#uploadEventDocMessageEdit').html('<div class="alert alert-danger"  style="margin: 0;">La taille du fichier est supèrieure à 5MB</div>');
                return false;
            }
        },
        error: function () {
            $('#uploadEventDocMessageEdit').html('<div class="alert alert-danger" style="margin: 0;">Une erreur s\'est produite, veuillez réessayer</div>');
            document.getElementById("loadingDiv").style.display = 'none';
        }
    });

}

function removeEditEventDoc(eventId, effect) {
    var eventDoc = $('#eventFeed' + eventId).find("#event-doc");
    if(effect){
        eventDoc.find('button').addClass('disabled');
    }
    
    if($("#eventDocumentNameEdit").val() != ''){
        $.ajax({
            type: 'POST',
            url: '/Groups/DeleteFile',
            data: {"fileName" : $("#eventDocumentNameEdit").val()},
            success: function (data){
                if (effect) {
                    eventDoc.find('p').html("");
                    eventDoc.hide();
                    eventDoc.find('button').removeClass('disabled');
                }
                    $("#eventDocumentNameEdit").val('');
            }
        });
    } else if (eventDoc.find('p').html() != "") {
        if (effect) {
            eventDoc.find('p').html("");
            eventDoc.hide();
            eventDoc.find('button').removeClass('disabled');
        }
    }
};


function initEditUploadVideoModal(eventId){

    var uploadEventVideoEdit = new Dropzone("#uploadEventVideoEdit", {
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
        },success : function (file, response) {
            
            if ($("#eventVideoNameEdit").val() != '') {
                removeEditEventVideo(eventIdUpload,false);
            }

            $("#eventVideoNameEdit").val(response);

            var res =  '../' + response.substring(response.lastIndexOf("EventVideo"));
            var eventVideo = $('#eventFeed' + eventIdUpload).find("#event-video");
            eventVideo.find("source").attr("src",res);
            eventVideo.find("video").load();
            eventVideo.show();

            document.getElementById("loadingDiv").style.display = 'none';
            $('#uploadVideoModalEdit').modal('hide');
			uploadEventVideoEdit.removeAllFiles();
        },
        
        complete: function(file) {
            if (file.size > 10*1024*1024) {

                $('#uploadEventVideoMessageEdit').html('<div class="alert alert-danger"  style="margin: 0;">La taille du fichier est supèrieure à 10MB</div>');
                return false;
            }

            if(!file.type.match('video.*')) {
                $('#uploadEventVideoMessageEdit').html('<div class="alert alert-danger"  style="margin: 0;">Le fichier n\'est pas une video</div>');
                return false;
            }
        },
        error: function () {
            $('#uploadEventVideoMessageEdit').html('<div class="alert alert-danger" style="margin: 0;">Une erreur s\'est produite, veuillez réessayer</div>');
            document.getElementById("loadingDiv").style.display = 'none';
        }
    });
}

function removeEditEventVideo(eventId, effect) {
    var eventVideo = $('#eventFeed' + eventId).find("#event-video");
    if(effect){
        eventVideo.find('button').addClass('disabled');
    }
    
    if ($("#eventVideoNameEdit").val() != '') {
        $.ajax({
            type: 'POST',
            url: '/Groups/DeleteFile',
            data: { "fileName": $("#eventVideoNameEdit").val() },
            success: function (data) {
                if (effect) {
                    eventVideo.find("source").removeAttr("src");
                    eventVideo.hide();
                    eventVideo.find('button').removeClass('disabled');
                }
                $("#eventVideoNameEdit").val('');
            }
        });
    } else if (eventVideo.find("source").attr("src")) {
        if (effect) {
            eventVideo.find("source").removeAttr("src");
            eventVideo.hide();
            eventVideo.find('button').removeClass('disabled');
        }
        
    }
};


function deleteEventFile(eventId,eventAttachmentType) {
        $.ajax({
            type: 'POST',
            url: '/Events/DeleteEventAttachment',
            data: {
                "eventId": eventId,
                "eventAttachmentType": eventAttachmentType
            },
            success: function (data) {
            }
        });
}


function editEvent(eventId) {

    var title = $('#eventFeed'+eventId).find("#eventTitle").val();
    var description = $('#eventFeed'+eventId).find("#eventAbout").val();
    var startDate = $('#eventFeed' + eventId).find("#startDate").val();
    var endDate = $('#eventFeed'+eventId).find("#endDate").val();
    var startTime = $('#eventFeed' + eventId).find("#startTime").val();
    var endTime = $('#eventFeed' + eventId).find("#endTime").val();
    var eventInterval = $('#eventFeed' + eventId).find("#interval").val();
    var address = $('#eventFeed' + eventId).find("#eventAddress").val();
    var longitude = $('#eventFeed' + eventId).find('#eventLongitude').attr('value');
    var latitude = $('#eventFeed' + eventId).find('#eventLatitude').attr('value');
    var eventVideo = $("#eventVideoNameEdit").val();

    startTime = getUTCTime(startTime);
    endTime = getUTCTime(endTime);

    if($('#eventFeed'+eventId).find('#allDayCheckBox').hasClass('active'))
    {
        startTime = "";
        endTime = "";
    }
    if(title == null || title =="")
    {
        $('body').scrollTop($('#eventFeed'+eventId).find('#eventTitleDiv').offset().top - 60); 
        $("#tip1 #errorMessageEvent").html("Veuillez saisir le titre de l'événement");
        tooltip.pop($('#eventFeed' + eventId).find("#eventTitleDiv")[0], '#tip1', { sticky: false, position: 3, cssClass: 'no-padding' });

        return false;
    }

    //if(startDate == null || startDate =="")
    //{
    //    $('body').scrollTop($('#eventFeed'+eventId).find('#startDateDiv').offset().top - 60); 
    //    $("#tip1 #errorMessageEvent").html("Veuillez saisir la date de début de l'événement");
    //    tooltip.pop($('#eventFeed' + eventId).find("#startDateDiv")[0], '#tip1', { sticky: false, position: 3, cssClass: 'no-padding' });

    //    return false;
    //}

    if(endDate != null && endDate != "")
    {
        var dateStart = Date.parse(startDate);
        var dateEnd = Date.parse(endDate);
        if(dateEnd < dateStart)
        {
            $('body').scrollTop($('#eventFeed'+eventId).find('#endDateDiv').offset().top - 60); 
            $("#tip1 #errorMessageEvent").html("La date de fin doit être supérieure à la date de début");
            tooltip.pop($('#eventFeed' + eventId).find("#endDateDiv")[0], '#tip1', { sticky: false, position: 3, cssClass: 'no-padding' });

            return false;
        }
    }

    var e = $('#eventFeed' + eventId).find("#recurrenceSelectList");
    var recurrence = e.find(":selected").index();

    var interval = null;
    if(recurrence == 0)
        interval = 0;
    if (recurrence == 1)
    {
        if(eventInterval == null || eventInterval =="")
        {
            $("#tip1 #errorMessageEvent").html("Veuillez saisir l'intervalle de récurrence de l'événement");
            tooltip.pop($('#eventFeed' + eventId).find("#intervalDiv")[0], '#tip1', { sticky: false, position: 3, cssClass: 'no-padding' });
            return false;
        }
        interval = eventInterval;

    }
    if (recurrence == 2)
    {
        if(eventInterval == null || eventInterval =="")
        {
            $("#tip1 #errorMessageEvent").html("Veuillez saisir l'intervalle de récurrence de l'événement");
            tooltip.pop($('#eventFeed' + eventId).find("#intervalDiv")[0], '#tip1', { sticky: false, position: 3, cssClass: 'no-padding' });
            return false;

        }
        interval = eventInterval;
    }
    if(recurrence == 3)
    {
        if(eventInterval == null || eventInterval =="")
        {
            $("#tip1 #errorMessageEvent").html("Veuillez saisir l'intervalle de récurrence de l'événement");
            tooltip.pop($('#eventFeed' + eventId).find("#intervalDiv")[0], '#tip1', { sticky: false, position: 3, cssClass: 'no-padding' });
            return false;
        }
        interval = eventInterval;
    }

    var daysOfWeek = [];
    if (recurrence == 2)
    {
        if($('#eventFeed'+eventId).find('#weeklySunday').hasClass('active'))
            daysOfWeek.push(0);
        if($('#eventFeed'+eventId).find('#weeklyMonday').hasClass('active'))
            daysOfWeek.push(1);
        if($('#eventFeed'+eventId).find('#weeklyTuesday').hasClass('active'))
            daysOfWeek.push(2);
        if($('#eventFeed'+eventId).find('#weeklyWendsday').hasClass('active'))
            daysOfWeek.push(3);
        if($('#eventFeed'+eventId).find('#weeklyThursday').hasClass('active'))
            daysOfWeek.push(4);
        if($('#eventFeed'+eventId).find('#weeklyFriday').hasClass('active'))
            daysOfWeek.push(5);
        if($('#eventFeed'+eventId).find('#weeklySatudray').hasClass('active'))
            daysOfWeek.push(6);

        if(daysOfWeek.length < 1)
        {
            $("#tip1 #errorMessageEvent").html("Veuillez la liste des jours");
            tooltip.pop($('#eventFeed' + eventId).find("#daysOfWeekDiv")[0], '#tip1', { sticky: false, position: 3, cssClass: 'no-padding' });
            return false;
        }
    }

    var deletePicture = false,
        deleteVideo = false,
        deleteDocument = false;

   
    if ((eventVideo == null || eventVideo == "") && !$('#eventFeed' + eventId).find("#event-video").find("source").attr("src") && $('#eventFeed' + eventId).find("#detailVideo").length > 0) {
        deleteVideo = true;
        //deleteEventFile(eventId, "Video");
    }

    $("#loadingDiv").show();

    var currentDate = new Date()
    var timeZoneOffset = -currentDate.getTimezoneOffset();

    $.ajax({
        type: "POST",
        url: "/Events/EditEvent",
        data: {
            "eventId": eventId,
            "title": title,
            "about": description,
            "address" : address,
            "longitude" : longitude,
            "latitude": latitude,
            "startDate": startDate,
            "endDate": endDate,
            "startTime" : startTime,
            "endTime" : endTime,
            "recurrence" : recurrence,
            "interval" : interval,
            "daysOfWeek" : daysOfWeek,
            "eventVideo" : eventVideo,
            "deleteVideo": deleteVideo,
            "timeDiffToUTC": timeZoneOffset,
            "pictures" : uploadedEventEditPicturesFileSystem,
            "documents" : uploadedEventEditDocumentsFileSystem,
            "picturesToRemove" : eventEditImagesToRemove,
            "documentsToRemove" : eventEditDocumentsToRemove,

        },
        success: function (data) {
            uploadedEventEditPicturesFileSystem = [];
            uploadedEventEditDocumentsFileSystem = [];
            eventEditImagesToRemove = [];
            eventEditDocumentsToRemove = [];

            window.onbeforeunload= null;
            window.onunload = null;

            var htmlData = $(data.View);
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

            $('#eventListItem' + eventId).replaceWith(htmlData[0]);
            initPartialMaps2('#eventFeed' + eventId);
            initDateTimeInputs('#eventFeed' + eventId);


            initUploadEventPictureEdit(data.Event.EventId);
            initUploadEventDocumentEdit(data.Event.EventId);

            plyr.setup();
            $('#eventFeed' + eventId).find("video").load();
            $('.date-picker').datepicker({
                orientation: "top auto",
                isRTL: false,
                format: 'yyyy-mm-dd',
                autoclose: true,
                language: 'fr'
            });
            $("#loadingDiv").hide();

            $("#eventPhotoNameEdit").val('');
            $("#eventVideoNameEdit").val('');
            $("#eventDocumentNameEdit").val('');
           
        },
        error: function (data) {
            $("#loadingDiv").hide();
        }
    });
}

function initPartialMaps2(eventFeed) {
    var mapItem1 = $(eventFeed).find(".mapItem")[0];
    if (mapItem1) {
        var long = $(mapItem1).attr('long');
        var lat = $(mapItem1).attr('lat');
        var longFloat = parseFloat(long.toString().replace(",", "."));
        var latFloat = parseFloat(lat.toString().replace(",", "."));

        var googleMapItem = new google.maps.Map(mapItem1, {
            disableDefaultUI: true,
            center: { lat: latFloat, lng: longFloat },
            zoom: 8,
            draggable: false,
            zoomControl: false,
            scrollwheel: false,
            disableDoubleClickZoom: true,
            mapTypeId: google.maps.MapTypeId.TERRAIN

        });
        var markerMapItem = new google.maps.Marker({
            map: googleMapItem,
            anchorPoint: new google.maps.Point(0, -29)
        });

        googleMapItem.addListener('click', function () {
            window.location = 'https://maps.google.com/maps?saddr=' + latFloat + ',' + longFloat;
        });

        var place = new google.maps.LatLng(latFloat, longFloat);

        markerMapItem.setPosition(place);
        markerMapItem.setVisible(true);
    }

    var mapDiv = $(eventFeed).find("#map")[0];

    var long2 = $(mapDiv).attr('long');
    var lat2 = $(mapDiv).attr('lat');
    var longFloatEditEvent = parseFloat(long2.toString().replace(",", "."));
    var latFloatEditEvent = parseFloat(lat2.toString().replace(",", "."));

    var map = new google.maps.Map(mapDiv, {
        center: { lat: 46.227638, lng: 2.213749000000007 },
        mapTypeControl: false,
        zoom: 7
    });


    var parent = $(mapDiv).parent();
    var input = parent.find('#eventAddress').get(0);

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    var infowindow = new google.maps.InfoWindow();
    var marker1 = new google.maps.Marker({
        map: map,
        draggable: true,
        anchorPoint: new google.maps.Point(0, -29)
    });

    marker1.addListener('drag', function () {
        var lat = marker1.getPosition().lat();
        var lng = marker1.getPosition().lng();
        $(eventFeed).find('#eventLongitude').attr('value', lng);
        $(eventFeed).find('#eventLatitude').attr('value', lat);
    });

    autocomplete.addListener('place_changed', function () {
        infowindow.close();
        marker1.setVisible(false);
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
        }

        var lat = place.geometry.location.lat(),
        lng = place.geometry.location.lng();

        $(eventFeed).find('#eventLongitude').attr('value', lng);
        $(eventFeed).find('#eventLatitude').attr('value', lat);

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);  // Why 17? Because it looks good.
        }
        marker1.setIcon(({
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
        }));
        marker1.setPosition(place.geometry.location);
        marker1.setVisible(true);

        var address = '';
        if (place.address_components) {
            address = [
              (place.address_components[0] && place.address_components[0].short_name || ''),
              (place.address_components[1] && place.address_components[1].short_name || ''),
              (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }

        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
        infowindow.open(map, marker1);
    });
}

function updateRecurrenceFormEdit(eventId) {
    var e = $('#eventFeed' + eventId).find("#recurrenceSelectList");
    var recurrence = e.find(":selected").index();
    if (recurrence == 0) {
        $('#eventFeed' + eventId).find('.dayButton').addClass('disabled');
        $('#eventFeed' + eventId).find('#interval').attr('disabled', true);
    } else {

        $('#eventFeed' + eventId).find('#interval').attr('disabled', false);

        if (recurrence == 1) {
            $('#eventFeed' + eventId).find('.dayButton').addClass('disabled');

        } else if (recurrence == 2) {
            $('#eventFeed' + eventId).find('.dayButton').removeClass('disabled');

        } else if (recurrence == 3) {
            $('#eventFeed' + eventId).find('.dayButton').addClass('disabled');

        }
    }

}

function showEditEvent(eventId) {
    $('.profile-timeline #editEventDiv').filter(':visible').find('.minusButton').trigger('click');
    $('#eventFeed' + eventId).find('#eventDetails').hide();
    $('#eventFeed' + eventId).find('#editEventDiv').show();
    google.maps.event.trigger($('#eventFeed' + eventId).find('#map')[0], 'resize');

    window.onbeforeunload= function(){
        if(  $('#eventFeed' + eventId).find("#editEventDiv").is(":visible"))
            return 'Etes vous sure de quitter la page?  Vous allez perdre les données inserés.';
            
        return null;
    };
    window.onunload= function(){
        removeTemporaryFiles();
    };
}

function closeEditEvent(eventId) {
    $('#eventFeed' + eventId).find("#editEventDiv").hide();
    $('#eventFeed' + eventId).find("#eventDetails").show();

    reinitEdit(eventId);
            
    window.onbeforeunload= null;
    window.onunload= null;
}

function reinitEdit(eventId) {
    removeEditEventVideo(eventId, false);

    var title = $('#eventFeed' + eventId).find("#eventTitle");
    title.val(title.attr('init'));

    var description = $('#eventFeed' + eventId).find("#eventAbout");
    description.val(description.attr('init'));

    var startDate = $('#eventFeed' + eventId).find("#startDate");
    startDate.val(startDate.attr('init')).change();

    var endDate = $('#eventFeed' + eventId).find("#endDate");
    endDate.val(endDate.attr('init'));

    var startTime = $('#eventFeed' + eventId).find("#startTime");
    var endTime = $('#eventFeed' + eventId).find("#endTime");
    startTime.val(startTime.attr('init'));
    endTime.val(endTime.attr('init'));
    if (startTime.val() == "00:00:00" && endTime.val() == "00:00:00") {
        $('#eventFeed' + eventId).find('#allDayCheckBox').addClass('active');
        startTime.attr('disabled', true);
        endTime.attr('disabled', true);
    } else {
        $('#eventFeed' + eventId).find('#allDayCheckBox').removeClass('active');
        startTime.attr('disabled', false);
        endTime.attr('disabled', false);
    }

    var recurrence = $('#eventFeed' + eventId).find("#recurrenceSelectList");
    recurrence.find('option').attr('selected', false);
    recurrence.find('option[value=' + recurrence.attr('init') + ']').attr('selected', true);

    var eventInterval = $('#eventFeed' + eventId).find("#interval");
    if (typeof eventInterval.attr('init') !== typeof undefined) {
        eventInterval.val(eventInterval.attr('init'))
        eventInterval.attr('disabled', false);
    } else {
        eventInterval.val('')
        eventInterval.attr('disabled', true);
    }

    var address = $('#eventFeed' + eventId).find("#eventAddress");
    address.val(address.attr('init'));

    var longitude = $('#eventFeed' + eventId).find('#eventLongitude');
    var latitude = $('#eventFeed' + eventId).find('#eventLatitude');
    longitude.attr('value', longitude.attr('init'));
    latitude.attr('value', latitude.attr('init'));
    //recenter map

    var photo = $('#eventFeed' + eventId).find("#event-photo");
    if (typeof photo.attr('init') !== typeof undefined) {
        photo.find('img').attr('src', photo.attr('init'));
        photo.show();
    } else {
        photo.hide();
    }

    var video = $('#eventFeed' + eventId).find("#event-video");
    if (typeof video.attr('init') !== typeof undefined) {
        video.find('source').attr('src', video.attr('init'));
        video.show();
    } else {
        video.hide();
    }

    var doc = $('#eventFeed' + eventId).find("#event-doc");
    if (typeof doc.attr('init') !== typeof undefined) {
        doc.find('p').html(doc.attr('init'));
        doc.show();
    } else {
        doc.hide();
    }



}

$('.date-picker').datepicker({
    orientation: "top auto",
    isRTL: false,
    format: 'yyyy-mm-dd',
    autoclose: true,
    language: 'fr'
});



function openUploadPhotoModalEdit(eventId)
{
    Dropzone.forElement('#uploadEventPhotoEdit').removeAllFiles();
    $('#uploadEventPhotoMessageEdit').html('<div class="alert alert-info" style="margin: 0;">Sélectionner un fichier</div>');
    $("#uploadPhotoModalEdit").modal();
    defineEventId(eventId);
}
function openUploadFileModalEdit(eventId)
{
    Dropzone.forElement('#uploadEventDocumentEdit').removeAllFiles();
    $('#uploadEventDocMessageEdit').html('<div class="alert alert-info" style="margin: 0;">Sélectionner un fichier</div>');
    $("#uploadDocumentModalEdit").modal();
    defineEventId(eventId);
}

function openUploadVideoModalEdit(eventId)
{
    Dropzone.forElement('#uploadEventVideoEdit').removeAllFiles();
    $('#uploadEventVideoMessageEdit').html('<div class="alert alert-info" style="margin: 0;">Sélectionner un fichier</div>');
    $("#uploadVideoModalEdit").modal();
    defineEventId(eventId)
}

function dropdownStopPropagation(element) {

    window.event.stopPropagation();
    $(element).find('.dropdown-menu').toggle();
}

$(document).ready(function () {

    initEditUploadVideoModal();

    $('.profile-timeline #editEventDiv').each(function () {
        initDateTimeInputs(this);
    });

    $('.profile-timeline #eventTime').each(function () {
        var txt = this.innerText;
        var start = txt.substring(0,5);
        startTime = getLocalTime(start);
        var end = txt.substring(8,14);
        endTime = getLocalTime(end);
        this.innerText = startTime + ' à ' + endTime;
    });

    //$('.profile-timeline #startTime').each(function () {
    //    //$(this).attr("value", getLocalTime(this.value.substring(0, 5)));
    //    //$(this).attr("init", getLocalTime($(this).attr("init").substring(0, 5)));
    //});

    //$('.profile-timeline #endTime').each(function () {
    //    //$(this).attr("value", getLocalTime(this.value.substring(0, 5)));
    //    //$(this).attr("init", getLocalTime($(this).attr("init").substring(0, 5)));
    //});

    //$('.profile-timeline #startEndHours #startTime').each(function () {

    //    this.value = getLocalTime(this.value.substring(0, 5));
    //    $(this).attr("init", getLocalTime(this.value.substring(0, 5)));
    //});

    //$('.profile-timeline #startEndHours #endTime').each(function () {

    //    this.value = getLocalTime(this.value.substring(0, 5));
    //    $(this).attr("init", getLocalTime(this.value.substring(0, 5)));
    //});


    
    //$('#editEventDiv #endTime').each(function () {

    //    this.value = getLocalTime(this.value.substring(0, 5));
    //    $(this).attr("init", getLocalTime(this.value.substring(0, 5)));
    //});
});

function initDateTimeInputs(element) {
    if ($(element).find('#startDate').val() == "") {
        $(element).find('.hideIfNoStartDate').hide();
    }
    $(element).find('#startDate').on('change paste keyup', function () {
        var startDate = $(this).val();

        if (startDate && startDate.length > 0) {
            $(element).find('.hideIfNoStartDate').slideDown();
        }
        else {
            $(element).find('.hideIfNoStartDate').slideUp();
            $(element).find('.hideIfNoStartDate input').val('');
        }
    });
}

function getUTCTime(time) {
    var oldDate = new Date(2016, 0, 1, time.substring(0, 2), time.substring(3, 5), 0);
    var offset = new Date().getTimezoneOffset();
    var hours = Math.floor (- offset / 60);
    var minutes = -offset % 60;
    var newDate = new Date(oldDate - ((hours * 60 * 60 * 1000) + (minutes * 60 * 1000)));
    return ("0" + newDate.getHours()).slice(-2) + ':' + ("0" + newDate.getMinutes()).slice(-2);
}

function getLocalTime(time) {
    var oldDate = new Date(2016, 0, 1, time.substring(0, 2), time.substring(3, 5), 0);
    var offset = new Date().getTimezoneOffset();
    var hours = Math.floor(offset / 60);
    var minutes = offset % 60;
    var newDate = new Date(oldDate - ((hours * 60 * 60 * 1000) + (minutes * 60 * 1000)));
    return ("0" + newDate.getHours()).slice(-2) + ':' + ("0" + newDate.getMinutes()).slice(-2);
}
