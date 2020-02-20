$(document).ready(function () {
    $("#submit-date").click(function (e) {
        e.preventDefault();
        fetch_data();
    });
});

function fetch_data() {
    let json_data = getDateJSON();
    console.log(json_data);
    $.ajax({
        type: 'POST',
        url: '../../cgi-bin/goes.pl',
        data: json_data,
        dataType: 'json',
        async: true,
        success: function (response) {
            console.log("Exito");
            if (response.length == 0) {
                console.log("Resultado vacio");
                $("#result-aws").empty();
                $("#result-aws").append("<p> No data found <\p>");
            }
            else {
                console.log(response);
                console.log(typeof(response));
                JSON.stringify(response);
                $("#result-aws").empty();
                $("#result-aws").append('<h4>Results</h4>');

                var valoresTableAWS = $(
                    '<table class="table table-striped table-hover"><thead class="thead-dark">\n' +
                    '                    <tr>\n' +
                    '                        <th scope="col">Date</th>\n' +
                    '                        <th scope="col">Hour</th>\n' +
                    '                        <th scope="col">Size</th>\n' +
                    '                        <th scope="col">File name</th>\n' +
                    '                    </tr>\n' +
                    '                    </thead>' +
                    '<tbody id="valoresTableAws"></tbody></table>');
                $('#result-aws').append(valoresTableAWS);

                for (var i = 1, len = response.length; i < len; i++) {
                    var entry = '<tr>\n';
                    entry += '<td>' + response[i][0] + '</td>\n';
                    entry += '<td>' + response[i][1] + '</td>\n';
                    entry += '<td>' + response[i][2] + '</td>\n';
                    entry += '<td>' + response[i][3] + '</td>\n';
                    entry += '</tr>\n';
                    $('#valoresTableAws').append(entry);
                }
            }
        }

    });
    // $.getJSON("../test.json",
    //     function (response) {
    //         if(response.length == 0){
    //             $("#result-aws").empty();
    //             $("#result-aws").append("<p> No data found <\p>");
    //         }
    //         else{
    //             $("#result-aws").empty();
    //             $("#result-aws").append('<h4>Results</h4>');

    //             var valoresTableAWS = $(
    //                 '<table class="table table-striped table-hover"><thead class="thead-dark">\n' +
    //                 '                    <tr>\n' +
    //                 '                        <th scope="col">Date</th>\n' +
    //                 '                        <th scope="col">Hour</th>\n' +
    //                 '                        <th scope="col">Size</th>\n' +
    //                 '                        <th scope="col">File name</th>\n' +
    //                 '                    </tr>\n' +
    //                 '                    </thead>' +
    //                 '<tbody id="valoresTableAws"></tbody></table>');
    //             $('#result-aws').append(valoresTableAWS);

    //             for (var i = 1, len = response.length; i < len; i++) {
    //               var entry = '<tr>\n';
    //               entry += '<td>' + response[i][0] + '</td>\n';
    //               entry += '<td>' + response[i][1] + '</td>\n';
    //               entry += '<td>' + response[i][2] + '</td>\n';
    //               entry += '<td>' + response[i][3] + '</td>\n';
    //               entry += '</tr>\n';
    //               $('#valoresTableAws').append(entry);
    //             }
    //         }
    //     }
    // );
    // }

    function getDateJSON() {
        let date = $("#datepicker").val().split("-");
        if (date[0] < 2000) {
            alert("Idiot. There were no satellites before 2000!");
        }
        if ($("#hourpicker").val().length == 0) {
            alert("Idiot. You must specify an hour !");
        }
        let in_year = date[0];
        let in_day = counter_days(date).toString();
        let in_hour = $("#hourpicker").val();
        return {
            year: in_year,
            daynumber: in_day.toString(),
            hour: in_hour
        };
    }
    function counter_days(date_in) {
        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        const firstDate = new Date(parseInt(date_in[0]), 0, 1);
        const secondDate = new Date(parseInt(date_in[0]), parseInt(date_in[1]) - 1, parseInt(date_in[2]));
        return (Math.round(Math.abs((firstDate - secondDate) / oneDay)) + 1);
    }
}