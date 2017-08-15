var scrollPosition = [
     self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
     self.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
];

function lockScroll() {
    scrollPosition = [
      self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
      self.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
    ];
    var html = jQuery('html'); // it would make more sense to apply this to body, but IE7 won't have that
    html.data('scroll-position', scrollPosition);
    html.data('previous-overflow', html.css('overflow'));
    html.css('overflow', 'hidden');
    window.scrollTo(scrollPosition[0], scrollPosition[1]);
}

var showHelpButton = '<div id="helpButtonDiv" onclick="showHelp();">'
    + '<span>Aide</span>'
    + '</div>';
var hideHelpButton = '<div id="helpButtonDiv" onclick="closeHelp();">'
    + '<span>Fermer</span>'
    + '</div>';

function unlockScroll() {
    
    var html = jQuery('html');
    var scrollPosition = html.data('scroll-position');
    if (scrollPosition != undefined) {
        html.css('overflow', html.data('previous-overflow'));
        window.scrollTo(scrollPosition[0], scrollPosition[1])
    }
}

var stepsEnum = {
    animateCreateAdvert: 1,
    animateCreateEvent: 2,
    animateCreateGroup: 3,
    animateJoinBubble: 4,
    animateInvitations: 5,
    animateFolders: 6
}

var helpMessagesEnum = {
    helpCreateAdvert: 'Cliquez sur ce lien pour pouvoir publier une nouvelle annonce',
    helpCreateEvent: 'Cliquez ici pour publier un nouvel événement',
    helpCreateGroup: 'Cliquez ici pour créer un nouveau groupe',
    helpJoinBubble: 'Saisissez le code qui vous a été communiqué par le responsable de votre bulle',
    helpInvitations: 'Liste des invitations que vous avez reçues',
    helpFolders: 'Liste des dossiers contenant les fichiers qui ont été partagés dans les groupes auxquels vous appartenez',
    helpEnablePartnership: 'Cliquez ici pour activer le service partenariat afin de pouvoir publier vos annonces sur Mabubble',
};

var currentStep = 0;

var optionElementsCount = $("#selectOptionDiv .nbi").length;

function showHelp() {
    document.getElementById("helpDiv").style.top = "0px";
    $("#nextHelpAnimationButton").show();
    $("#previousHelpAnimationButton").show();
    if (!$(".nbs").hasClass("active")) {
        $(".nbs").addClass("active");
    }
    document.getElementById("addItemsDiv").style.zIndex = "1000";
    $("#helpButtonDiv").replaceWith(hideHelpButton);
}

function hideHelp() {
    document.getElementById("helpDiv").style.top = "0px";
    $("#nextHelpAnimationButton").hide();
    $("#previousHelpAnimationButton").hide();
    document.getElementById("addItemsDiv").style.zIndex = "12";
    showOptions();
}

function animateJoinBubble() {
    if (!$(".nbs").hasClass("active")) {
        $(".nbs").addClass("active");
        document.getElementById("addItemsDiv").style.zIndex = "1000";
    }
    resetOptionButtonsColor();

    $("#joinBubbleOptionLink").stop().animate({ backgroundColor: '#EB6B56' }, 150);
    $("#joinBubbleOptionLink div input").stop().animate({ backgroundColor: '#EB6B56' }, 300);

    document.getElementById("helpCommentDiv").style.bottom = (optionElementsCount - $("#joinBubbleOptionLink").index()) * 37 + 25 + "px";
    document.getElementById("helpCommentDiv").style.right = "260px";
    $("#helpCommentDiv p").html('<i class="fa fa-info-circle"></i>' + helpMessagesEnum.helpJoinBubble);
    $("#helpCommentDiv").show();

}

function animateCreateAdvert() {
    if (!$(".nbs").hasClass("active")) {
        $(".nbs").addClass("active");
        document.getElementById("addItemsDiv").style.zIndex = "1000";
    }
    resetOptionButtonsColor();

    if ($("#createAdvertOptionLink").length > 0) {
        $("#createAdvertOptionLink").stop().animate({ backgroundColor: '#EB6B56' }, 300);
        $("#createAdvertOptionLink span").stop().animate({ backgroundColor: '#EB6B56' }, 300);
        document.getElementById("helpCommentDiv").style.bottom = (optionElementsCount - $("#createAdvertOptionLink").index()) * 37 + 25 + "px";
        document.getElementById("helpCommentDiv").style.right = "260px";
        $("#helpCommentDiv p").html('<i class="fa fa-info-circle"></i>' + helpMessagesEnum.helpCreateAdvert);
        $("#helpCommentDiv").show();
    }
    if ($("#enablePartnershipOptionLink").length > 0) {
        $("#enablePartnershipOptionLink").stop().animate({ backgroundColor: '#EB6B56' }, 300);
        $("#enablePartnershipOptionLink span").stop().animate({ backgroundColor: '#EB6B56' }, 300);
        document.getElementById("helpCommentDiv").style.bottom = (optionElementsCount - $("#enablePartnershipOptionLink").index()) * 37 + 25 + "px";
        document.getElementById("helpCommentDiv").style.right = "260px";
        $("#helpCommentDiv p").html('<i class="fa fa-info-circle"></i>' + helpMessagesEnum.helpEnablePartnership);
        $("#helpCommentDiv").show();
    }

    
}

function animateCreateEvent() {
    if (!$(".nbs").hasClass("active")) {
        $(".nbs").addClass("active");
        document.getElementById("addItemsDiv").style.zIndex = "1000";
    }

    resetOptionButtonsColor();

    $("#createEventOptionLink").stop().animate({ backgroundColor: '#EB6B56' }, 300);
    $("#createEventOptionLink span").stop().animate({ backgroundColor: '#EB6B56' }, 300);
    document.getElementById("helpCommentDiv").style.bottom = (optionElementsCount - $("#createEventOptionLink").index()) * 37 + 25 + "px";
    document.getElementById("helpCommentDiv").style.right = "260px";
    $("#helpCommentDiv p").html('<i class="fa fa-info-circle"></i>' + helpMessagesEnum.helpCreateEvent);
    $("#helpCommentDiv").show();
}

function animateCreateGroup() {
    if (!$(".nbs").hasClass("active")) {
        $(".nbs").addClass("active");
        document.getElementById("addItemsDiv").style.zIndex = "1000";
    }

    resetOptionButtonsColor();

    $("#createGroupOptionLink").stop().animate({ backgroundColor: '#EB6B56' }, 300);
    $("#createGroupOptionLink span").stop().animate({ backgroundColor: '#EB6B56' }, 300);

    document.getElementById("helpCommentDiv").style.bottom = (optionElementsCount - $("#createGroupOptionLink").index()) * 37 + 25 + "px";
    document.getElementById("helpCommentDiv").style.right = "260px";
    $("#helpCommentDiv p").html('<i class="fa fa-info-circle"></i>' + helpMessagesEnum.helpCreateGroup);
    $("#helpCommentDiv").show();
}

function animateInvitations() {
    unlockScroll();
    var top = $("#profileInvitationsDiv .invitationsBox").parent().offset().top - $(window).scrollTop();
    if(top <= 150)
        $('html, body').animate({ scrollTop: 0 }, 0);
    lockScroll();
    var left = $("#profileInvitationsDiv .invitationsBox").parent().offset().left - $(window).scrollLeft();
    top = $("#profileInvitationsDiv .invitationsBox").parent().offset().top - $(window).scrollTop();


    $("#replacementDiv").css(
        "cssText", "width : " + $("#profileInvitationsDiv .invitationsBox").parent().width() + "px!important;"
        + "max-width : " + $("#profileInvitationsDiv .invitationsBox").parent().width() + "px!important;"
        + "max-height : " + $("#profileInvitationsDiv .invitationsBox").parent().height() + "px!important;"
        + "height : " + $("#profileInvitationsDiv .invitationsBox").parent().height() + "px!important;"
        + "left:" + left + "px;"
        + "top:" +  top + "px;"
        );
    $("#replacementDiv").html($("#profileInvitationsDiv .invitationsBox").parent().html());

    if ($(".nbs").hasClass("active")) {
        $(".nbs").removeClass("active");
    }
    document.getElementById("addItemsDiv").style.zIndex = "12";
    $("#replacementDiv").show();
    $("#replacementDiv .title").animate({ color: '#EB6B56' }, 150);
    document.getElementById("helpCommentDiv").style.top = document.getElementById("replacementDiv").style.top;
    $("#helpCommentDiv").css("bottom","auto");

    document.getElementById("helpCommentDiv").style.right = "310px";
    $("#helpCommentDiv p").html('<i class="fa fa-info-circle"></i>' + helpMessagesEnum.helpInvitations);
    $("#helpCommentDiv").show();
}

function animateFolders() {

    var top = $("#foldersContainer .invitationsBox").parent().offset().top - $(window).scrollTop();
    if (top > 0)
        top = top - 75;
    unlockScroll();
    $('html, body').animate({ scrollTop: top }, 0);
    lockScroll();
    var left = $("#foldersContainer .invitationsBox").parent().offset().left - $(window).scrollLeft();
    top = $("#foldersContainer .invitationsBox").parent().offset().top - $(window).scrollTop();

    $("#replacementDiv").css(
        "cssText", "width : " + $("#foldersContainer .invitationsBox").parent().width() + "px!important;"
        + "max-width : " + $("#foldersContainer .invitationsBox").parent().width() + "px!important;"
        + "max-height : " + $("#foldersContainer .invitationsBox").parent().height() + "px!important;"
        + "height : " + $("#foldersContainer .invitationsBox").parent().height() + "px!important;"
        + "left:" + left + "px;"
        + "top:" + top + "px;"
        );
    $("#replacementDiv").html($("#foldersContainer .invitationsBox").parent().html());

    if ($(".nbs").hasClass("active")) {
        $(".nbs").removeClass("active");
    }
    document.getElementById("addItemsDiv").style.zIndex = "12";
    $("#replacementDiv").show();
    $("#replacementDiv .title").animate({ color: '#EB6B56' }, 150);
    document.getElementById("helpCommentDiv").style.top = document.getElementById("replacementDiv").style.top;
    $("#helpCommentDiv").css("bottom", "auto");

    document.getElementById("helpCommentDiv").style.right = "310px";
    $("#helpCommentDiv p").html('<i class="fa fa-info-circle"></i>' + helpMessagesEnum.helpFolders);
    $("#helpCommentDiv").show();
}

function previousStepAnimation() {
    currentStep--;
    switch (currentStep) {
        case stepsEnum.animateCreateGroup:
            {
                if ($("#createGroupOptionLink").length < 1) {
                    previousStepAnimation();
                }
                break;
            }
        case stepsEnum.animateCreateEvent:
            {
                if ($("#createEventOptionLink").length < 1) {
                    previousStepAnimation();
                }
                break;
            }
        default:
            break;
    }
    animateHelp();
}

function animateHelp(){
    $("#helpCommentDiv").hide();
    $("#replacementDiv").hide();
    $("#replacementDiv").html('');
    $("#helpCommentDiv").css("top", "auto");

    switch (currentStep) {
        case stepsEnum.animateCreateAdvert:
            animateCreateAdvert();
            break;
        case stepsEnum.animateCreateEvent:
            animateCreateEvent();
            break;
        case stepsEnum.animateCreateGroup:
            animateCreateGroup();
            break;
        case stepsEnum.animateJoinBubble:
            animateJoinBubble();
            break;
        case stepsEnum.animateInvitations:
            animateInvitations();
            break;
        case stepsEnum.animateFolders:
            animateFolders();
            break;
        default:
            closeHelp();
    }
}

function nextStepAnimation() {
    currentStep++;
    switch (currentStep) {
        case stepsEnum.animateCreateGroup:
            {
                if ($("#createGroupOptionLink").length < 1) {
                    nextStepAnimation();
                }
                break;
            }
        case stepsEnum.animateCreateEvent:
            {
                if ($("#createEventOptionLink").length < 1) {
                    nextStepAnimation();
                }
                break;
            }
        default:
            break;
    }
    animateHelp();
}

function closeHelp() {
    currentStep = 0;
    $("#helpCommentDiv").hide();
    $("#replacementDiv").hide();
    $("#replacementDiv").html('');
    $("#helpCommentDiv").css("top", "auto");
    $("#helpDiv").css("top", "auto");

    if ($(".nbs").hasClass("active")) {
        $(".nbs").removeClass("active");
    }

    $("#nextHelpAnimationButton").hide();
    $("#previousHelpAnimationButton").hide();
    document.getElementById("addItemsDiv").style.zIndex = "12";
    $("#helpButtonDiv").replaceWith(showHelpButton);

    resetOptionButtonsColor();

    unlockScroll();

}

function resetOptionButtonsColor() {
    $("#createGroupOptionLink").stop().css("background-color", "#3498db");
    $("#createGroupOptionLink span").stop().css("background-color", "#3498db");
    $("#joinBubbleOptionLink").stop().css("background-color", "#3498db");
    $("#joinBubbleOptionLink div input").stop().css("background-color", "#3498db");
    $("#createEventOptionLink").stop().css("background-color", "#3498db");
    $("#createEventOptionLink span").stop().css("background-color", "#3498db");
    if ($("#createAdvertOptionLink").length > 0) {
        $("#createAdvertOptionLink").stop().css("background-color", "#3498db");
        $("#createAdvertOptionLink span").stop().css("background-color", "#3498db");
    }
    if ($("#enablePartnershipOptionLink").length > 0) {
        $("#enablePartnershipOptionLink").stop().css("background-color", "#3498db");
        $("#enablePartnershipOptionLink span").stop().css("background-color", "#3498db");
    }
}