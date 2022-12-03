$(function () {
    const URL_MIN_LENGTH = 1;
    const URL_MAX_LENGTH = 500;
    const TOKEN_MIN_LENGTH = 3;
    const TOKEN_MAX_LENGTH = 50;

    $('#main-tabs a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });

    $("#form-set-submit").click(function () {
        var url = $("#form-set-url").val();
        var token = $("#form-set-token").val();
        if (token.length > 0) {
            if (token.length < TOKEN_MIN_LENGTH || token.length > TOKEN_MAX_LENGTH) {
                $("#modal-msg-content").html("The custom short chain length should be The custom short chain length should be " + TOKEN_MIN_LENGTH + " - " + TOKEN_MAX_LENGTH + " characters");
                $("#modal-msg").modal('show');
                return true;
            }
            //var pattern = /^([a-zA-Z0-9]){5,50}$/;
            var pattern = /^([a-zA-Z0-9_-])+$/;
            if (!pattern.test(token)) {
                $("#modal-msg-content").html("Invalid custom short chain, only letters and numbers are supported");
                $("#modal-msg").modal('show');
                return true;
            }
        }
        if (url.length < URL_MIN_LENGTH || url.length > URL_MAX_LENGTH) {
            $("#modal-msg-content").html("URL length in " + URL_MIN_LENGTH + " - " + URL_MAX_LENGTH);
            $("#modal-msg").modal('show');
            return true;
        }
        $("#form-set-submit").attr("disabled", "disabled");

        var ajax = $.ajax({
            url: "/api/url", type: 'POST', data: {
                url: url, token: token,
            }
        });
        ajax.done(function (res) {
            var obj = JSON.parse(res)
            if (obj["error"] === '') {
                show_result(url, window.location.protocol + '//' + window.location.host + "/" + obj['token']);
            } else {
                $("#modal-msg-content").html(obj["error"]);
                $("#modal-msg").modal('show');
            }
            $("#form-set-submit").removeAttr("disabled");
        });
        ajax.fail(function (jqXHR, textStatus) {
            $("#form-set-submit").removeAttr("disabled");
            $("#modal-msg-content").html("Request failed :" + textStatus);
            $("#modal-msg").modal('show');
        });
    });
});

function show_result(url, shortUrl) {
    shortUrl = encodeURI(shortUrl);
    url = encodeURI(url);
    if (url.indexOf('//') === -1) {
        url = 'http://' + url;
    }
    $("#modal-result-title").text("ShortLink was created");
    $("#modal-result-url").html('<a target="_blank" href="' + url + '">' + url + '</a>');
    $("#modal-result-token").html('<a target="_blank" href="' + shortUrl + '">' + shortUrl + '</a>');
    $("#modal-result").modal("show");
}
