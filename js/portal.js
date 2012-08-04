$(document).ready(function () {
    var apiClientId = 'remotestorage_portal';
    var apiScope = ["authorizations", "applications"];

    var authorizeEndpoint = 'http://localhost/php-oauth/authorize.php';
    var apiEndpoint = 'http://localhost/php-oauth/api.php';

    var remoteStorageEndpoint = 'http://php-oauth/php-remoteStorage/api.php';

    jso_configure({
        "remotestorage_portal": {
            client_id: apiClientId,
            authorization: authorizeEndpoint
        }
    });
    jso_ensureTokens({
        "remotestorage_portal": apiScope
    });

    function renderInstalledApplicationsList() {
        $.oajax({
            url: apiEndpoint + "/authorizations/",
            jso_provider: "remotestorage_portal",
            jso_scopes: apiScope,
            jso_allowia: true,
            dataType: 'json',
            success: function (data) {
                $("#installedApplicationsList").html($("#installedApplicationsListTemplate").render(data));
                addInstalledApplicationsListHandlers();
            }
        });
    }

    function renderAvailableApplicationsList() {
        $.oajax({
            url: apiEndpoint + "/applications/",
            jso_provider: "remotestorage_portal",
            jso_scopes: apiScope,
            jso_allowia: true,
            dataType: 'json',
            success: function (data) {
                $("#availableApplicationsList").html($("#availableApplicationsListTemplate").render(data));
                addAvailableApplicationsListHandlers();
            }
        });
    }

    function getResourceOwner() {
        /*$.oajax({
            url: apiEndpoint + "/resource_owner/id",
            jso_provider: "remotestorage_portal",
            jso_scopes: apiScopes,
            async: false,
            jso_allowia: true,
            dataType: 'json',
            success: function (data) {
                userId = data.id;
                $("#userId").append(data.name);
                $("#userId").attr('title', data.user_id);
            }
        });*/
    }

    function addAvailableApplicationsListHandlers() {
        $("button.installApplication").click(function() {
            alert("installing!");
        });
    }

    function addInstalledApplicationsListHandlers() {
        $("button.removeApplication").click(function () {
          
        });
        $("button.launchApplication").click(function() {
            var redirectUri = $(this).data('redirectUri');
            $.oajax({
                url: apiEndpoint + "/resource_owner/id",
                jso_provider: "remotestorage_portal",
                jso_scopes: apiScope,
                jso_allowia: true,
                dataType: 'json',
                success: function (data) {
                    window.location = redirectUri + "#storage_root=" + remoteStorageEndpoint + "/" + data.id + "&authorize_endpoint=" + authorizeEndpoint;
                }
            });
        });
    }

    function initPage() {
        getResourceOwner();
        renderInstalledApplicationsList();
        renderAvailableApplicationsList();
    }
    initPage();
});
