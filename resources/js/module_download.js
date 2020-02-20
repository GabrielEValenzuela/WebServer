$(document).ready(function () {
    $("#downform").submit(download_module);
});

function download_module(e) {
    /*If HTML form element is provided, it automatically captures its fields.
     The special thing about FormData is that network methods, such as fetch, 
     can accept a FormData object as a body.
     It’s encoded and sent out with Content-Type: form/multipart.    
     From the server point of view, that looks like a usual form submission.
      */
    console.log("Enrty to event");
    console.log($("#downform")[0]);
    var form = new FormData($("#downform")[0]);
    e.preventDefault(); // Para que no se refresque la pagina
    console.log("Create form");
    console.log(form);
    $.ajax({
        type: 'POST',
        url: "../../cgi-bin/single_info.pl",
        data: form,
        dataType: 'json',
        processData: false,
        contentType: false,
        cache: false,
        success: function (data) {
            var entry;
            var randIDbtn = Math.floor(Math.random() * 100);
            console.log(randIDbtn);
            if (data['error'] != 0) {
                entry = '<div class="card  bg-danger text-white mb-3" style="max-width: 36rem;">\n' +
                    '  <div class="card-header text-center">##ERROR##</div>\n' +
                    '  <div class="card-body">\n' +
                    '    <small class="card-text"> File ' + data['filename'] +
                    ' it is not a valid kernel module.<br><br>' +
                    data['stdout'] + '</small>\n' +
                    '  </div>\n' +
                    '</div><br>';
                $("#loadead-modules").append(entry);
            } else {
                var strIDrand = data['filename'] + '_' + randIDbtn;
                console.log(strIDrand);
                strIDrand = strIDrand.replace(/\./, 'dot');
                entry = '<div class="card  bg-secondary text-white mb-3" style="max-width: 36rem;">\n' +
                    '  <div class="card-header text-center">' + data['filename'] +
                    '</div>\n' +
                    '  <div class="card-body">\n' +
                    '    <small class="card-text">' + data['stdout'] +
                    '</small><br>\n' +
                    '<button type="button" class="btn btn-dark"  ' +
                    'id="' + strIDrand + '" fileName="' + data['filename'] +
                    '">Unistall module</button>' +
                    '  </div>\n' +
                    '</div><br>';
                $("#loadead-modules").append(entry);
                $('#' + strIDrand).click(uninstall_module);
            }
        }
    });
}

function uninstall_module(e) {
    // Lee que boton se acciono para poder detectar que modulo remover
    var modulo = $(e.target).attr('filename');
    console.log("Entry function delete");
    var sendInfo = {
        module_name: modulo,
    };
    // Es capas de detectar si el modulo ya habia sido cargado, advirtiendo eso
    $.ajax({
        type: 'POST',
        url: '../../cgi-bin/unistall.pl',
        dataType: 'json',
        async: false,
        success: function (data) {
            if (data['error'] == 0) {
                $(e.target).parent().parent().removeClass('bg-secondary');
                $(e.target).parent().parent().addClass('bg-success');
                $(e.target).prop('disabled', true);
                $(e.target).html('Module unistalled successfully');
                fetch_modules_installed();
            } else {
                $(e.target).parent().parent().removeClass('bg-secondary');
                $(e.target).parent().parent().addClass('bg-warning');
                $(e.target).parent().prepend('<p> ' + data['stdout'] + '</p>');
                $(e.target).
                    parent().
                    prepend('<p> Error:</p>');
                $(e.target).prop('disabled', true);
                $(e.target).html('Error');
                setTimeout(function () {
                    location.reload();
                }, 30000);
            }

        },
        data: sendInfo,
    });
}