$(document).ready(function () {
    var apiClientId = 'remotestorage_portal';
    var apiScope = ["authorizations", "applications"];

    var authorizeEndpoint = 'http://localhost/php-oauth/authorize.php';
    var apiEndpoint = 'http://localhost/php-oauth/api.php';

    var remoteStorageEndpoint = 'http://localhost/php-remoteStorage/api.php';

    jso_configure({
        "remotestorage_portal": {
            client_id: apiClientId,
            authorization: authorizeEndpoint
        }
    });
    jso_ensureTokens({
        "remotestorage_portal": apiScope
    });

    $("button#editApplications").click(function() {
        if($('div#availableApplicationsList').is(":visible")) {
            $("div#availableApplicationsList").hide();
            renderInstalledApplicationsList("launch");
        } else {
            $("div#availableApplicationsList").show();
            renderInstalledApplicationsList("delete");
        }
    });

    function renderInstalledApplicationsList(mode) {
        $.oajax({
            url: apiEndpoint + "/authorizations/",
            jso_provider: "remotestorage_portal",
            jso_scopes: apiScope,
            jso_allowia: true,
            dataType: 'json',
            success: function (data) {
                $("#installedApplications").html($("#installedApplicationsTemplate").render(data));
                addInstalledApplicationsListHandlers(mode);
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
                $("#availableApplications").html($("#availableApplicationsTemplate").render(data));
                addAvailableApplicationsListHandlers();
            }
        });
    }

    function addAvailableApplicationsListHandlers() {
        $("li.installApplication").click(function() {
            installAvailableApplication($(this).data('clientId'), $(this).data('allowedScope'));
        });
    }

    function addInstalledApplicationsListHandlers(mode) {
        if(mode === "launch") {
            $("button.removeApplication").hide();
            $("li.launchApplication").click(function() {
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
        } else {
            $("button.removeApplication").show();
            $("button.removeApplication").click(function () {
                if (confirm("Are you sure you want to remove the application '" + $(this).data('clientName') + "'?")) {
                    removeInstalledApplication($(this).data('clientId'));
                }
            });
        }
    }

    function installAvailableApplication(clientId, scope) {
        $.oajax({
            url: apiEndpoint + "/authorizations/",
            jso_provider: "remotestorage_portal",
            jso_scopes: apiScope,
            jso_allowia: true,
            type: "POST",
            dataType: 'json',
            data: JSON.stringify({'client_id': clientId, 'scope': scope, 'refresh_token': false}),
            success: function (data) {
                renderInstalledApplicationsList();
            }
        });
    }

    function removeInstalledApplication(clientId) {
        $.oajax({
            url: apiEndpoint + "/authorizations/" + clientId,
            jso_provider: "remotestorage_portal",
            jso_scopes: apiScope,
            jso_allowia: true,
            type: "DELETE",
            success: function (data) {
                renderInstalledApplicationsList("delete");
            }
        });
    }

    function initPage() {
        renderInstalledApplicationsList("launch");
        renderAvailableApplicationsList();
    }
    initPage();
});
