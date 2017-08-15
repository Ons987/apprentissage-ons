
function showEditPost(eventPostId)
{
    $("#eventPostDiv" + eventPostId).find(".hideWhenUpdate").hide();
    $("#editPostInput" + eventPostId).val($("#eventPostContent" + eventPostId).text());
    $("#eventPostDiv" + eventPostId).find(".comment-update").show();
}

function cancelEditPost(eventPostId)
{
    $("#eventPostDiv" + eventPostId).find(".comment-update").hide();
    $("#eventPostDiv" + eventPostId).find(".hideWhenUpdate").show();
    $("#editPostInput" + eventPostId).val("");
}

function editPost(eventPostId) {

    $.ajax({
        type: "POST",
        url: "/Events/EditPost",
        data: {
            "eventPostId": eventPostId,
            "content": $("#editPostInput" + eventPostId).val()
        },
        success: function (data) {
            $("#eventPostContent" + eventPostId).html(data.Content.replace(/((([A-Za-z]{3,9}:(?:\/\/)?)[A-Za-z0-9\.\-]+|(?:www\.)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/g, "<a target='_blank' href='$1'>$1</a>"));
            cancelEditPost(eventPostId)
        },
        error: function (data) {
            cancelEditPost(eventPostId)
        }
    });
}