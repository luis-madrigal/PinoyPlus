function w3_open() {
    $('#chatBox').css('display', 'block');
}
function w3_close() {
    $('#chatBox').css('display', 'none');
}



$(document).ready(function () {
    $('.contact-item').click(function (e) {
        $('.chat-list-container').css('display', 'none');
        $('.main-chat-container').css('display', 'block');
    });
    $('#close-chat-bubble').click(function (e) {
        w3_close();
    });
    $('#contact-btn').click(function (e) {
        $('.chat-list-container').css('display', 'block');
        $('.main-chat-container').css('display', 'none');
    });
});