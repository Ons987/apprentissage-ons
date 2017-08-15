function showAddPost(eventId) {
    if (document.getElementById("postToEventDiv" + eventId).style.display == 'block')
        document.getElementById("postToEventDiv" + eventId).style.display = 'none';
    else
        document.getElementById("postToEventDiv" + eventId).style.display = 'block';

}

function createPost(eventId) {
    var eventPostContent = document.getElementById("postContent" + eventId).value;
    if (eventPostContent == '' || eventPostContent == null) {
        return false;
    }
    $.ajax({
        type: "POST",
        url: "/Groups/CreatePost",
        data: {
            "eventId": eventId,
            "content": eventPostContent
        },
        success: function (data) {
            $("#eventPosts" + eventId).append(

                '<div class="timeline-comment" id="eventPost' + data.EventPostId + '">'
                    + '<div class="timeline-item-header eventCommentDiv" id="eventPostDiv'+data.EventPostId+'">'

                    + ((data.Picture != null && data.Picture != "") ?
                    '<img  class="img-cover" src="' + data.Picture + '" alt="">'
                    : '<img id="Picture'+data.UserId+'" class="img-cover" src="../Content/Images/DefaultUserImage.png" alt="">')

                    + '<div class="dropdown eventPostOptions" id="eventPostsOptions">'
                    + '<button class="btn btn-showoptions dropdown-toggle hideWhenUpdate" type="button" data-toggle="dropdown" aria-expanded="true"><svg height="100%" width="100%" viewBox="0 0 24 24"><path class="Ce1Y1c" d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" style="fill: #757575;"></path></svg></button>'
                    + '<ul class="dropdown-menu pull-right eventPostOptionsDropdown">'
                    + '<li><a href="javascript:void(0)" onclick="showDeletePostModal(' + data.EventPostId + ','+eventId+')">Supprimer</a></li>'
                    + '<li><a href="javascript:void(0)" onclick="showEditPost(' + data.EventPostId + ')">Modifier</a></li>'
                    + '</ul></div>'

                    + '<div class="comment-item-message hideWhenUpdate">'

                    + '<p class="oneLine">' + data.FirstName + ' ' + data.LastName + '</p>'
                   
                    + '<div class="comment-item-date hideWhenUpdate">'
                    + data.CreationDate 
                    + '</div>'
                 
                   
                    + '</div>'

                    + '<p class="timeline-comment-text eventPostContent hideWhenUpdate" id="eventPostContent' + data.EventPostId + '">' + data.Content.replace(/((([A-Za-z]{3,9}:(?:\/\/)?)[A-Za-z0-9\.\-]+|(?:www\.)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/g, "<a target='_blank' href='$1'>$1</a>") + '</p>'
                    +' <div class="comment-update" style="display:none">'
                    + '                        <textarea class="editPostInput" id="editPostInput' + data.EventPostId + '">go</textarea>'
                     +'                       <div class="btn-container">'
                    + '                            <button class="btn" onclick="cancelEditPost(' + data.EventPostId + ')">Annuler</button>'
                    + '                            <button class="btn blue-text-color" onclick="editPost(' + data.EventPostId + ')">Modifier</button>'
                    +'                        </div>'
                    + '                    </div>'

                    + '</div>'
                    + '</div>'
            );
            var value = parseInt(document.getElementById('postsCount' + eventId).innerHTML, 10);
            value = isNaN(value) ? 0 : value;
            value++;
            document.getElementById('postsCount' + eventId).innerHTML = value;
            document.getElementById("postContent" + eventId).value = '';
            $("#eventPosts" + eventId).trigger("click");
        },
        error: function (data) {

        }
    });
}
