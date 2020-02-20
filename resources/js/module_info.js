$(document).ready(function () {
    $("#bttn-info").click(function (e) {
        e.preventDefault();
        console.log("Entry yo info event");
        $("#contenidoBase").empty();
        fetch_modules_installed();
    });
});

function fetch_modules_installed() {
    $.ajax({
        type: "GET",
        url: "../../cgi-bin/module_info.pl",
        dataType: "json",
        success: function (data) {
            $("#contenidoBase").append('<h4>List result<\h4>');
            var valoresTableModulo = $(
                '<table class="table table-striped table-hover"><thead class="thead-dark">\n' +
                '                    <tr>\n' +
                '                        <th scope="col">Module</th>\n' +
                '                        <th scope="col">Size</th>\n' +
                '                        <th scope="col">Used by</th>\n' +
                '                    </tr>\n' +
                '                    </thead>' +
                '<tbody id="valoresTableModulo"></tbody></table>');
            $('#contenidoBase').append(valoresTableModulo);

            for (var i = 1, len = data.length; i < len; i++) {
                var entry = '<tr>\n';
                entry += '<td>' + data[i][0] + '</td>\n';
                entry += '<td>' + data[i][1] + '</td>\n';
                entry += '<td>' + data[i][2] + '</td>\n';
                entry += '</tr>\n';
                $('#valoresTableModulo').append(entry);
            }
            $('#contenidoBase').append('<br><br>');
        }
    });
}