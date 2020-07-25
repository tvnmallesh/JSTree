﻿/* tcasetable.custom.js
 *
 This file consists of the all the functions that are related to the right pane testcases table 
 i.e whether adding the expected results and test data or exporting the data to excel etc.

*/

$("#selectAll").click(function () {
    $('#tblTestScen input:checkbox').not(this).prop('checked', this.checked);
});

$("#selectAllReg").click(function () {
    $('#tblRegAn input:checkbox').not(this).prop('checked', this.checked);
});

var table;
var E2Etable;
var E2EtblCollection = [];


var FlowChartDetails = null;

//to make the cells editable when clicked by user
$("#TestDataTable").on("click", "td", function () {
    var colIdx;

    if (table)
        colIdx = table.cell(this).index().column;
    else if (E2Etable)
        colIdx = E2Etable.cell(this).index().column;

    if (colIdx != 0) {
        $(this.firstChild).attr("contenteditable", "true");
        $(this.firstChild).focus();
    }

    $(this).attr("height", $(this.firstChild).height());

});
$("#TestDataTablenew").on("click", "td", function () {
    var colIdx;

    if (table)
        colIdx = table.cell(this).index().column;
    else if (E2Etable)
        colIdx = E2Etable.cell(this).index().column;

    if (colIdx != 0) {
        $(this.firstChild).attr("contenteditable", "true");
        $(this.firstChild).focus();
    }

    $(this).attr("height", $(this.firstChild).height());

});
//fetches all the steps of the flowchart into the table(Add Expected Results & test data)
function ExcelTestCase() {

    var nodes = Array.prototype.slice.call(document.getElementsByClassName("node"));
    var dataSet = [];
    //Populating the JSON for the bootstrap datatable
    if ($.fn.DataTable.isDataTable('#TestDataTable')) {
        table.destroy();
    }

    //var projectdetails = JSON.parse($('.activeElement').attr("data"));
    //var storagename = projectdetails.projectid + projectdetails.moduleid + projectdetails.modelflowname + projectdetails.modelflowversion + "ExRnTData";

    var ProjectDetails = JSON.parse($('.activeElement').attr("data"));
    // var existing = JSON.parse(localStorage.getItem(storagename));

    var url = getURL();
    var existing;
    $.ajax({
        url: url + '/TestProject/GetResultnData/' + ProjectDetails.projectid + '/' + ProjectDetails.moduleid + '/' + ProjectDetails.modelflowname,
        type: 'GET',
        async: false,
        success: function (Response, XMLHttpRequest, textStatus, errorThrown) {
            // alert("Success");
            //alert("Changes made to the Expected Results & Test data table have been saved!");
            existing = Response;
        },
        error: function (Response, XMLHttpRequest, textStatus, errorThrown) {
            //alert("Failed");
            alert("Sorry! Existing values could not be retrieved.");
        }
    });
    var tcase = JSON.parse($('.activeElement').attr('tcase')).connections;
    var st = "startpoint";
    var dsImported = [];
    dsImported = JSON.parse(localStorage.getItem("exresTdataImport"));
    var dsImpRec;
    var result = "";
    var tData = "";
    var Atdata = "";

    if (dataSet.length == 0) {
        for (var i = 0; i < nodes.length; i++) {
            var id = $(nodes[i]).attr("id");

            if ($(nodes[i]).attr("data-nodetype") != "startpoint" && $(nodes[i]).attr("data-nodetype") != "endpoint") {
                var JScript = $.trim($('#' + id + ' .dropdown img').attr("selectedj"));
                var PScript = $.trim($('#' + id + ' .dropdown img').attr("selectedp"));
                var CsScript = $.trim($('#' + id + ' .dropdown img').attr("selectedCs"));
                var VbScript = $.trim($('#' + id + ' .dropdown img').attr("selectedVb"));



                if ($(nodes[i]).attr("data-nodetype") == "task") {
                    if (dsImported != null)
                        dsImpRec = dsImported.filter(rec => rec.tStep == $.trim($('#' + id + ' .details_container' + ' .detail_text').val()));

                    if (dsImpRec) {
                        if (dsImpRec.length > 0) {
                            result = dsImpRec[0].Result;
                            tData = dsImpRec[0].tData;
                            Atdata = dsImpRec[0].AtData;
                        }
                    }
                    dataSet.push({ "rowId": "row_" + id, "tStep": $.trim($('#' + id + ' .details_container' + ' .detail_text').val()), "JtStep": JScript, "PtStep": PScript, "CstStep": CsScript, /*"VbtStep": VbScript,*/ "Result": "<div class='editable' contenteditable='true'>" + result + "</div>", "tData": "<div class='editable' contenteditable='true'>" + tData + "</div>", "AtData": "<div class='editable' contenteditable='true'>" + Atdata + "</div>" });
                }
                else if ($(nodes[i]).attr("data-nodetype") == "decision") {
                    var arrDecisions = document.getElementsByClassName("_jsPlumb_overlay");
                    for (var n = 0; n < arrDecisions.length; n++) {
                        if ($(arrDecisions[n]).attr("source") == id) {
                            if (dsImported != null)
                                dsImpRec = dsImported.filter(rec => rec.tStep == $.trim($('#' + id + ' .ctrl_container' + ' .detail_text').val()) + " (" + $(arrDecisions[n]).html() + ")");

                            if (dsImpRec) {
                                if (dsImpRec.length > 0) {
                                    result = dsImpRec[0].Result;
                                    tData = dsImpRec[0].tData;
                                    Atdata = dsImpRec[0].AtData;
                                }
                            }

                            dataSet.push({ "rowId": "row_" + id + "_" + $(arrDecisions[n]).html(), "tStep": $.trim($('#' + id + ' .ctrl_container' + ' .detail_text').val()) + " (" + $(arrDecisions[n]).html() + ")", "JtStep": JScript, "PtStep": PScript, "CstStep": CsScript, /*"VbtStep": VbScript,*/ "Result": "<div class='editable' contenteditable='true'>" + result + "</div>", "tData": "<div class='editable' contenteditable='true'>" + tData + "</div>", "AtData": "<div class='editable' contenteditable='true'>" + Atdata + "</div>" });
                        }
                    }
                }
            }
        }
    }

    if (existing != null) {
        // var r = confirm("Previously entered values exists for 'Expected Results' and 'Test Data'.Click 'OK' to proceed further or 'Cancel' to delete the values.");

        for (var ix = 0; ix < dataSet.length; ix++) {
            //if (dataSet[i]["rowId"] == existing[i].row_Id) {
            var existExResult=""; var existTdata=""; var existATdata="";
            if (existing[ix] != null) {
                existExResult = existing[ix].ExpectedResult != null ? existing[ix].ExpectedResult : "";
                existTdata = existing[ix].TestData != null ? existing[ix].TestData : "";
                existATdata = existing[ix].AutomationTestData != null ? existing[ix].AutomationTestData : "";
            }

            dataSet[ix]["Result"] = "<div class='editable' contenteditable='true'>" + existExResult + "</div>";
            dataSet[ix]["tData"] = "<div class='editable' contenteditable='true'>" + existTdata + "</div>";
            dataSet[ix]["AtData"] = "<div class='editable' contenteditable='true'>" + existATdata + "</div>";
            //}
        };

    }

    //while (st != "endpoint") {
    //    tcase.forEach(function (item) {
    //        if (item.pageSourceId == st) {
    //            var filtered = nodes.filter(function (node, i) {
    //                st = item.pageTargetId
    //                return $(node).attr("id") == item.pageTargetId;
    //            });

    //            var id = $(filtered).attr("id");
    //            if ($(filtered).attr("data-nodetype") == "task") {
    //                dataSet.push({ "rowId": "row_" + id, "tStep": $.trim($('#' + id + ' .details_container' + ' .detail_text').val()), "Result": "<div class='editable' contenteditable='true'></div>", "tData": "<div class='editable' contenteditable='true'></div>" });
    //            }
    //            else if ($(filtered).attr("data-nodetype") == "decision") {
    //                var arrDecisions = document.getElementsByClassName("_jsPlumb_overlay");
    //                for (var n = 0; n < arrDecisions.length; n++) {
    //                    if ($(arrDecisions[n]).attr("source") == id) {
    //                        dataSet.push({ "rowId": "row_" + id + "_" + $(arrDecisions[n]).html(), "tStep": $.trim($('#' + id + ' .ctrl_container' + ' .detail_text').val()) + " (" + $(arrDecisions[n]).html() + ")", "Result": "<div class='editable' contenteditable='true'></div>", "tData": "<div class='editable' contenteditable='true'></div>" });
    //                    }
    //                }

    //            }

    //        }
    //    });
    //}

    if (!$.fn.DataTable.isDataTable('#TestDataTable')) {
        table = $('#TestDataTable').DataTable({
            data: dataSet,
            autoWidth: false,
            "ordering": false,
            "paginate": true,
            "lengthChange": false,
            "filter": false,
            "info": false,
            "pageLength": 15,
            "columnDefs": [
                { "width": "10%", "targets": 0 },
                { "width": "10%", "targets": 1 },
                { "width": "10%", "targets": 2 },
                { "width": "10%", "targets": 3 },
                { "width": "10%", "targets": 4 },
                { "width": "10%", "targets": 5 }
            ],
            fixedColumns: true,
            "columns": [
                { "data": "tStep" },
                { "data": "JtStep" },
                { "data": "PtStep" },
                { "data": "CstStep" },
                /*{ "data": "VbtStep" },*/
                { "data": "Result" },
                { "data": "tData" },
                { "data": "AtData" }
            ],
            rowId: "rowId"

        });
    }

    $('#lblErrTdata').hide();
    ////open the table as dialog box
    $('#AddExpectedResultsTdata').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });
}

function ExcelTestCasenew() {

    var nodes = Array.prototype.slice.call(document.getElementsByClassName("node"));
    var dataSet = [];
    //Populating the JSON for the bootstrap datatable
    if ($.fn.DataTable.isDataTable('#TestDataTablenew')) {
        table.destroy();
        
    }

    //var projectdetails = JSON.parse($('.activeElement').attr("data"));
    //var storagename = projectdetails.projectid + projectdetails.moduleid + projectdetails.modelflowname + projectdetails.modelflowversion + "ExRnTData";

    var ProjectDetails = JSON.parse($('.activeElement').attr("data"));
    // var existing = JSON.parse(localStorage.getItem(storagename));

    var url = getURL();
    var existing;
    $.ajax({
        url: url + '/TestProject/GetResultnData/' + ProjectDetails.projectid + '/' + ProjectDetails.moduleid + '/' + ProjectDetails.modelflowname,
        type: 'GET',
        async: false,
        success: function (Response, XMLHttpRequest, textStatus, errorThrown) {
            // alert("Success");
            //alert("Changes made to the Expected Results & Test data table have been saved!");
            existing = Response;
        },
        error: function (Response, XMLHttpRequest, textStatus, errorThrown) {
            //alert("Failed");
            alert("Sorry! Existing values could not be retrieved.");
        }
    });
    var tcase = JSON.parse($('.activeElement').attr('tcase')).connections;
    var st = "startpoint";
    var dsImported = [];
    dsImported = JSON.parse(localStorage.getItem("exresTdataImport"));
    var dsImpRec;
    var result = "";
    var tData = "";
    var Atdata = "";

    if (dataSet.length == 0) {
        //debugger;
        for (var i = 0; i < nodes.length; i++) {
            var id = $(nodes[i]).attr("id");

            if ($(nodes[i]).attr("data-nodetype") != "startpoint" && $(nodes[i]).attr("data-nodetype") != "endpoint") {
                //var JScript = $.trim($('#' + id + ' .dropdown img').attr("selectedj"));
                //var PScript = $.trim($('#' + id + ' .dropdown img').attr("selectedp"));
                //var CsScript = $.trim($('#' + id + ' .dropdown img').attr("selectedCs"));
                //var VbScript = $.trim($('#' + id + ' .dropdown img').attr("selectedVb"));

               

                if ($(nodes[i]).attr("data-nodetype") == "decision") {
                    if (dsImported != null)
                        dsImpRec = dsImported.filter(rec => rec.tStep == $.trim($('#' + id + ' .ctrl_container' + ' .detail_text').val()));

                    if (dsImpRec) {
                        if (dsImpRec.length > 0) {
                           // result = dsImpRec[0].Result;
                            tData = dsImpRec[0].tData;
                            Atdata = dsImpRec[0].AtData;
                        }
                    }
                  //  ds.push({ "chk": " <label><input type='checkbox' id='test" + parseInt(i + 1) + "' tcase='" + JSON.stringify(masterArray[i]) + "' style='float:left;' class='radio' name='optcheckbox'/><label for='test" + parseInt(i + 1) + "'></label></label>", "Scenario": "<label class='lblCase' tcase='" + JSON.stringify(masterArray[i]) + "' onclick='validate(this)'># " + parseInt(i + 1) + "</label>", "Req": val + "<br /><button onclick='getreqDetails(\"" + projectdetails.projectid + "\"," + "\"" + projectdetails.moduleid + "\"," + "\"" + projectdetails.modulename + "\"," + "\"" + parseInt(i + 1) + "\"" + ")'>Details</button>", "Priority": RBT, "Type": Type });

                   // dataSet.push({ "rowId": "row_" + id, "tStep": $.trim($('#' + id + ' .ctrl_container' + ' .detail_text').val()) + "</div>" });

                    var arrTst = [];


                    //arrTst = dataSet.push({ "rowId": "row_" + id, "tStep": $.trim($('#' + id + ' .ctrl_container' + ' .detail_text').val()) + "</div>" });

                    arrTst.push({ "rowId": "row_" + id, "tStep": $.trim($('#' + id + ' .ctrl_container' + ' .detail_text').val()) + "</div>" })

                    const columns = arrTst.map(p => { let row = $(''); p[i].forEach(v => row.append($('').html(v))); return row; });


                    $('#TestDataTablenew').append(columns)




                 
                }
                 if ($(nodes[i]).attr("data-nodetype") == "decision") {
                    var arrDecisions = document.getElementsByClassName("_jsPlumb_overlay");
                    for (var n = 0; n < arrDecisions.length; n++) {
                        if ($(arrDecisions[n]).attr("source") == id) {
                            if (dsImported != null)
                                dsImpRec = dsImported.filter(rec => rec.tStep1 == $.trim($('#' + id + ' .ctrl_container' + ' .detail_text').val()) + " (" + $(arrDecisions[n]).html() + ")");

                            if (dsImpRec) {
                                if (dsImpRec.length > 0) {
                                   // result = dsImpRec[0].Result;
                                    tData = dsImpRec[0].tData;
                                    Atdata = dsImpRec[0].AtData;
                                }
                            }

                            if ($(arrDecisions[n]).html() != undefined && $(arrDecisions[n]).html() != '') {
                               // ds.push({ "chk": " <label><input type='checkbox' id='test" + parseInt(i + 1) + "' tcase='" + JSON.stringify(masterArray[i]) + "' style='float:left;' class='radio' name='optcheckbox'/><label for='test" + parseInt(i + 1) + "'></label></label>", "Scenario": "<label class='lblCase' tcase='" + JSON.stringify(masterArray[i]) + "' onclick='validate(this)'># " + parseInt(i + 1) + "</label>", "Req": val + "<br /><button onclick='getreqDetails(\"" + projectdetails.projectid + "\"," + "\"" + projectdetails.moduleid + "\"," + "\"" + projectdetails.modulename + "\"," + "\"" + parseInt(i + 1) + "\"" + ")'>Details</button>", "Priority": RBT, "Type": Type });

                                //dataSet.push({ "rowId": "row_" + id + "_" + $(arrDecisions[n]).html(), "tStep": $(arrDecisions[n]).html(), "JtStep": JScript, "PtStep": PScript, "CstStep": CsScript, /*"VbtStep": VbScript,*/ "Result": "<div class='editable' contenteditable='true'>" + result + "</div>", "tData": "<div class='editable' contenteditable='true'>" + tData + "</div>", "AtData": "<div class='editable' contenteditable='true'>" + Atdata + "</div>" });

                                var arrTst = [];

                                //arrTst = dataSet.push({ "rowId": "row_" + id + "_" + $(arrDecisions[n]).html(), "tStep1": $(arrDecisions[n]).html() + "</div>" });


                                arrTst.push({ "rowId": "row_" + id, "tStep": $.trim($('#' + id + ' .ctrl_container' + ' .detail_text').val()) + "</div>" })


                                const columns = arrTst.map(p => { let row = $(''); p[i].forEach(v => row.append($('').html(v))); return row; });


                                $('#TestDataTablenew').append(columns)
                            }
                            //dataSet.push({ "rowId": "row_" + id + "_" + $(arrDecisions[n]).html(), "tStep": $.trim($('#' + id + ' .ctrl_container' + ' .detail_text').val()) + " (" + $(arrDecisions[n]).html() + ")", "JtStep": JScript, "PtStep": PScript, "CstStep": CsScript, /*"VbtStep": VbScript,*/ "Result": "<div class='editable' contenteditable='true'>" + result + "</div>", "tData": "<div class='editable' contenteditable='true'>" + tData + "</div>", "AtData": "<div class='editable' contenteditable='true'>" + Atdata + "</div>" });
                        }
                    }
                }
                
                
                
            }
        }
    }


   

    
    if (!$.fn.DataTable.isDataTable('#TestDataTablenew')) {
        table = $('#TestDataTablenew').DataTable({
            data: dataSet,
            autoWidth: false,
            "ordering": false,
            "paginate": true,
            "lengthChange": false,
            "filter": false,
            "info": false,
            "pageLength": 15,
            "columnDefs": [
                { "width": "10%", "targets": 0 },
                
            ],
           // fixedColumns: true,
            "columns": [
                { "data": "tStep" },
                { "data": "tStep1" },
                
                
            ],
            rowId: "rowId"

        });
    }

    $('#lblErrTdata').hide();
    ////open the table as dialog box
    $('#AddCreateRules').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });
}


function E2EexcelTestCase(tcase, spanId) {
    var dataSetE2E = [];
    var nodes = document.getElementsByClassName("node");


    var tNodes = JSON.parse(tcase);
    for (var i = 0; i < tNodes.nodes.length; i++) {
        var id = tNodes.nodes[i].blockId;
        if (tNodes.nodes[i].nodetype != "startpoint" && tNodes.nodes[i].nodetype != "endpoint") {
            if (tNodes.nodes[i].nodetype == "task") {
                dataSet.push({ "rowId": "row_" + id, "tStep": tNodes.nodes[i].DisplayText, "Result": "<div class='editable' contenteditable='true'></div>", "tData": "<div class='editable' contenteditable='true'></div>" });
            }

        }
    }

    if ($.fn.DataTable.isDataTable('#TestDataTable')) {
        $('#TestDataTable').DataTable().destroy();
    }

    $('#TestDataTable tbody').empty();

    E2Etable = $('#TestDataTable').DataTable({
        data: dataSet,
        "ordering": false,
        "paginate": true,
        "lengthChange": false,
        "filter": false,
        "info": false,
        "pageLength": 15,
        "columns": [
            { "data": "tStep" },
            { "data": "Result" },
            { "data": "tData" }
        ],
        rowId: "rowId"

    });

    $('#lblErrTdata').hide();
    ////open the table as dialog box
    $('#AddExpectedResultsTdata').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });

    return E2Etable;

}

function E2EexcelTestCasenew (tcase, spanId) {
    var dataSetE2E = [];
    var nodes = document.getElementsByClassName("node");


    var tNodes = JSON.parse(tcase);
    for (var i = 0; i < tNodes.nodes.length; i++) {
        var id = tNodes.nodes[i].blockId;
        if (tNodes.nodes[i].nodetype != "startpoint" && tNodes.nodes[i].nodetype != "endpoint") {
            if (tNodes.nodes[i].nodetype == "task") {
                dataSet.push({ "rowId": "row_" + id, "tStep": tNodes.nodes[i].DisplayText, "Result": "<div class='editable' contenteditable='true'></div>", "tData": "<div class='editable' contenteditable='true'></div>" });
            }

        }
    }

    if ($.fn.DataTable.isDataTable('#TestDataTablenew')) {
        $('#TestDataTablenew').DataTable().destroy();
    }

    $('#TestDataTable tbody').empty();

    E2Etable = $('#TestDataTablenew').DataTable({
        data: dataSet,
        "ordering": false,
        "paginate": true,
        "lengthChange": false,
        "filter": false,
        "info": false,
        "pageLength": 15,
        "columns": [
            { "data": "tStep" },
            
        ],
        rowId: "rowId"

    });

    $('#lblErrTdata').hide();
    ////open the table as dialog box
    $('#AddCreateRules').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });

    return E2Etable;

}

//Generate Excel sheet from the datatable
function fnGenerateExcel4Selected() {
    var arrayCollection = [];
    var tcase = [];
    var owner = getOwner();

    var opts = [];
    var sheetNum = 1;

    if (!($('#rightCheckBoxBar input:checked').length > 0)) {
        alert("Please Select atleast 1 Test Case to be exported!");
    }
    else {
        $.blockUI({
            css: {
                border: 'none',
                padding: '15px',
                backgroundColor: '#000',
                '-webkit-border-radius': '10px',
                '-moz-border-radius': '10px',
                opacity: .5,
                color: '#fff'
            },
            onBlock: function () {
                $('#rightCheckBoxBar input:checked').each(function () {
                    if ($(this).attr("id") != "tblTestScen" && $(this).attr("id") != "selectAll" && $(this).attr("id") != "selectAllReg") {
                        var testScenario = JSON.parse($(this).attr('tcase'));
                        var tcaseName = "";
                        var dtable = $('#TestDataTable').dataTable();
                        var row = dtable.fnGetNodes();

                        for (var i = 0; i < testScenario.length; i++) {

                            if (testScenario[i].pageSourceId.indexOf("decision") > -1) {
                                $(row).filter(function () {
                                    if ($(this).attr("id").replace('&lt;', '<').replace('&gt;', '>').replace('&amp;', '&') == "row_" + testScenario[i].pageSourceId + "_" + testScenario[i].overlay) {
                                        var condition = this.cells[0].innerText.substring(0, this.cells[0].innerText.indexOf("("));
                                        var value = this.cells[0].innerText.substring(this.cells[0].innerText.indexOf("(") + 1, this.cells[0].innerText.indexOf(")"));

                                        tcaseName += condition + "_" + value + "&";
                                    }
                                });
                            }

                        }
                        tcaseName = tcaseName.substring(0, tcaseName.length - 1);
                        var con1 = tcaseName.substring(0, tcaseName.indexOf("&"));
                        var con2 = tcaseName.substring(tcaseName.lastIndexOf("&"), tcaseName.length);

                        if (testScenario != null && table != null) {
                            for (var i = 0; i < testScenario.length; i++) {

                                var req = [];
                                if ($('#Req' + sheetNum + ' :selected').attr("params"))
                                    req = JSON.parse($('#Req' + sheetNum + ' :selected').attr("params"));

                                if (testScenario[i].pageTargetId.indexOf("decision") > -1) {


                                    $(row).filter(function () {
                                        if ($(this).attr("id").replace('&lt;', '<').replace('&gt;', '>').replace('&amp;', '&') == "row_" + testScenario[i].pageTargetId + "_" + testScenario[i + 1].overlay) {
                                            var Val;
                                            var scriptJ = $("#" + testScenario[i].pageTargetId + " .gear").attr("selectedJ");
                                            var scriptP = $("#" + testScenario[i].pageTargetId + " .gear").attr("selectedP");
                                            var scriptCs = $("#" + testScenario[i].pageTargetId + " .gear").attr("selectedCs");
                                            var scriptVb = $("#" + testScenario[i].pageTargetId + " .gear").attr("selectedVb");
                                            var automatedTData = this.cells[6].innerText;

                                            var params = automatedTData.split('|');

                                            if (scriptJ && scriptJ != "") {
                                                scriptJ = scriptJ.replace("url", params[0].trim());

                                                if (params.length == 1) {
                                                    scriptJ = scriptJ.replace("\"\"", params[0].trim());
                                                    if (scriptJ.indexOf("webElement") > 0)
                                                        scriptJ = scriptJ.replace(/webElement/g, "\"" + params[0].trim() + "\"");
                                                } if (params.length == 2) {
                                                    if (scriptJ.indexOf("input") > 0)
                                                        scriptJ = scriptJ.replace("\"\"", "\"" + params[0].trim() + "\"").replace("input", "\"" + params[1].trim() + "\"");
                                                    else if (scriptJ.indexOf("arg0") > 0) {
                                                        scriptJ = scriptJ.replace("\"\"", "\"" + params[0].trim() + "\"").replace("arg0", "\"" + params[1].trim() + "\"");
                                                    }
                                                    else if (scriptJ.indexOf("webElement") > 0) {
                                                        scriptJ = scriptJ.replace(/webElement/g, "\"" + params[0].trim() + "\"");
                                                    }
                                                    else if (scriptJ.indexOf("source") > 0 || scriptJ.indexOf("target") > 0) {
                                                        scriptJ = scriptJ.replace("source", "\"" + params[0].trim() + "\"").replace(/target/g, "\"" + params[1].trim() + "\"");
                                                    }
                                                    else if (scriptJ.indexOf("actual") > 0 || scriptJ.indexOf("expected") > 0) {
                                                        scriptJ = scriptJ.replace("actual", "\"" + params[0].trim() + "\"").replace("expected", "\"" + params[1].trim() + "\"");
                                                    }
                                                }

                                            }

                                            if (scriptP && scriptP != "") {
                                                scriptP = scriptP.replace("url", params[0].trim());
                                                var q = scriptP.match(/""/g);
                                                if (params.length == 1) {
                                                    scriptP = scriptP.replace("\"\"", params[0].trim());
                                                    if (scriptP.indexOf("webElement") > 0)
                                                        scriptP = scriptP.replace(/webElement/g, "\"" + params[0].trim() + "\"");

                                                } if (params.length == 2) {
                                                    if (scriptP.indexOf("input") > 0)
                                                        scriptP = scriptP.replace("\"\"", "\"" + params[0].trim() + "\"").replace("input", "" + params[1].trim() + "");
                                                    else if (scriptP.indexOf("arg0") > 0) {
                                                        scriptP = scriptP.replace("\"\"", "\"" + params[0].trim() + "\"").replace("arg0", "\"" + params[1].trim() + "\"");
                                                    }
                                                    else if (scriptP.indexOf("webElement") > 0) {
                                                        scriptP = scriptP.replace(/webElement/g, "\"" + params[0].trim() + "\"");
                                                    }
                                                    else if (scriptP.indexOf("source") > 0 || scriptJ.indexOf("target") > 0) {
                                                        scriptP = scriptP.replace("source", "\"" + params[0].trim() + "\"").replace(/target/g, "\"" + params[1].trim() + "\"");
                                                    }
                                                    else if (scriptP.indexOf("actual") > 0 || scriptP.indexOf("expected") > 0) {
                                                        scriptP = scriptP.replace("actual", "\"" + params[0].trim() + "\"").replace("expected", "\"" + params[1].trim() + "\"");
                                                    }
                                                }

                                            }

                                            if (scriptCs && scriptCs != "") {
                                                scriptCs = scriptCs.replace("url", params[0].trim());

                                                if (params.length == 1) {
                                                    scriptCs = scriptCs.replace("\"\"", params[0].trim());
                                                    if (scriptCs.indexOf("webElement") > 0)
                                                        scriptCs = scriptCs.replace(/webElement/g, "\"" + params[0].trim() + "\"");

                                                } if (params.length == 2) {
                                                    if (scriptCs.indexOf("input") > 0)
                                                        scriptCs = scriptCs.replace("\"\"", "\"" + params[0].trim() + "\"").replace("input", "" + params[1].trim() + "");
                                                    else if (scriptCs.indexOf("arg0") > 0) {
                                                        scriptCs = scriptCs.replace("\"\"", "\"" + params[0].trim() + "\"").replace("arg0", "" + params[1].trim() + "");
                                                    }
                                                    else if (scriptCs.indexOf("webElement") > 0) {
                                                        scriptCs = scriptCs.replace(/webElement/g, "\"" + params[0].trim() + "\"");
                                                    }
                                                    else if (scriptCs.indexOf("source") > 0 || scriptJ.indexOf("target") > 0) {
                                                        scriptCs = scriptCs.replace("source", "\"" + params[0].trim() + "\"").replace(/target/g, "\"" + params[1].trim() + "\"");
                                                    }
                                                    else if (scriptCs.indexOf("actual") > 0 || scriptCs.indexOf("expected") > 0) {
                                                        scriptCs = scriptCs.replace("actual", "\"" + params[0].trim() + "\"").replace("expected", "\"" + params[1].trim() + "\"");
                                                    }
                                                }

                                            }


                                            if (scriptVb && scriptVb != "") {
                                                scriptVb = scriptVb.replace("url", params[0].trim());

                                                if (params.length == 1) {
                                                    scriptVb = scriptVb.replace("\"\"", params[0].trim());
                                                    if (scriptVb.indexOf("webElement") > 0)
                                                        scriptVb = scriptVb.replace(/webElement/g, "\"" + params[0].trim() + "\"");

                                                } if (params.length == 2) {
                                                    if (scriptVb.indexOf("input") > 0)
                                                        scriptVb = scriptVb.replace("\"\"", "\"" + params[0].trim() + "\"").replace("input", "" + params[1].trim() + "");
                                                    else if (scriptVb.indexOf("arg0") > 0) {
                                                        scriptVb = scriptVb.replace("\"\"", "\"" + params[0].trim() + "\"").replace("arg0", "" + params[1].trim() + "");
                                                    }
                                                    else if (scriptVb.indexOf("webElement") > 0) {
                                                        scriptVb = scriptVb.replace(/webElement/g, "\"" + params[0].trim() + "\"");
                                                    }
                                                    else if (scriptVb.indexOf("source") > 0 || scriptJ.indexOf("target") > 0) {
                                                        scriptVb = scriptVb.replace("source", "\"" + params[0].trim() + "\"").replace(/target/g, "\"" + params[1].trim() + "\"");
                                                    }
                                                    else if (scriptVb.indexOf("actual") > 0 || scriptVb.indexOf("expected") > 0) {
                                                        scriptVb = scriptVb.replace("actual", "\"" + params[0].trim() + "\"").replace("expected", "\"" + params[1].trim() + "\"");
                                                    }
                                                }

                                            }

                                            if (i == 0) {
                                                var desc = "";
                                                var cri = "";
                                                var name = "";
                                                if (req && req.description) {
                                                    desc = req.description;
                                                }

                                                if (req && req.accCriteria) {
                                                    cri = req.accCriteria;
                                                }
                                                if (req.reqname) {
                                                    name = req.reqname;
                                                }

                                                Val = { /*"TC#": sheetNum,*/ "Folder Name": "", "Title": name + "_" + $('.activeElement').attr("name") + "_" + con1 + "_" + con2, "Requirement Description": desc, "Acceptance Criteria": cri, "Description": tcaseName, "Status": "New", "PreRequisites": "", "Step_Seq": i + 1, "Step_Steps": this.cells[0].innerText, "Step_Expected Result": this.cells[4].innerText, "Manual Test Data": this.cells[5].innerText, "Automation Test Data": this.cells[6].innerText, "Priority": $('#RBT' + sheetNum + ' :selected').text(), "Type Of Test": $('#TypeOfCase' + sheetNum + ' :selected').text(), "Owner": owner, "Assigned To": "", "Automated Java Script": scriptJ, "Automated Python Script": scriptP, "Automated C# Script": scriptCs /*, "Automated VB Script": scriptVb*/ };
                                            }
                                            else {
                                                Val = { /*"TC#": "",*/ "Folder Name": "", "Title": "", "Requirement Description": "", "Acceptance Criteria": "", "Description": "", "Status": "New", "Step_Seq": i + 1, "PreRequisites": "", "Step_Steps": this.cells[0].innerText, "Step_Expected Result": this.cells[4].innerText, "Manual Test Data": this.cells[5].innerText, "Automation Test Data": this.cells[6].innerText, "Priority": "", "Type Of Test": "", "Owner": owner, "Assigned To": "", "Automated Java Script": scriptJ, "Automated Python Script": scriptP, "Automated C# Script": scriptCs/*, "Automated VB Script": scriptVb*/ };
                                            }
                                            tcase.push(Val);
                                        }

                                    });
                                }
                                else {

                                    $(row).filter(function () {
                                        if ($(this).attr("id").replace('&lt;', '<').replace('&gt;', '>').replace('&amp;', '&') == "row_" + testScenario[i].pageTargetId) {
                                            var Val;

                                            var scriptJ = $("#" + testScenario[i].pageTargetId + " .gear").attr("selectedJ");
                                            var scriptP = $("#" + testScenario[i].pageTargetId + " .gear").attr("selectedP");
                                            var scriptCs = $("#" + testScenario[i].pageTargetId + " .gear").attr("selectedCs");
                                            var scriptVb = $("#" + testScenario[i].pageTargetId + " .gear").attr("selectedVb");

                                            var automatedTData = this.cells[6].innerText;

                                            var params = automatedTData.split('|');

                                            if (scriptJ && scriptJ != "") {
                                                scriptJ = scriptJ.replace("url", params[0].trim());
                                                var q = scriptJ.match(/""/g);
                                                if (params.length == 1) {
                                                    scriptJ = scriptJ.replace("\"\"", params[0].trim());
                                                    if (scriptJ.indexOf("webElement") > 0)
                                                        scriptJ = scriptJ.replace(/webElement/g, "\"" + params[0].trim() + "\"");
                                                } if (params.length == 2) {
                                                    if (scriptJ.indexOf("input") > 0)
                                                        scriptJ = scriptJ.replace("\"\"", "\"" + params[0].trim() + "\"").replace("input", "" + params[1].trim() + "");
                                                    if (scriptJ.indexOf("arg0") > 0) {
                                                        scriptJ = scriptJ.replace("\"\"", "\"" + params[0].trim() + "\"").replace("arg0", "\"" + params[1].trim() + "\"");
                                                    }
                                                    if (scriptJ.indexOf("webElement") > 0) {
                                                        scriptJ = scriptJ.replace(/webElement/g, "\"" + params[0].trim() + "\"");
                                                    }
                                                    if (scriptJ.indexOf("source") > 0 || scriptJ.indexOf("target") > 0) {
                                                        scriptJ = scriptJ.replace("source", "\"" + params[0].trim() + "\"").replace(/target/g, "\"" + params[1].trim() + "\"");
                                                    }
                                                    if (scriptJ.indexOf("actual") > 0 || scriptJ.indexOf("expected") > 0) {
                                                        scriptJ = scriptJ.replace("actual", "\"" + params[0].trim() + "\"").replace("expected", "\"" + params[1].trim() + "\"");
                                                    }
                                                }

                                            }

                                            if (scriptP && scriptP != "") {
                                                scriptP = scriptP.replace("url", params[0].trim());
                                                if (params.length == 1) {
                                                    scriptP = scriptP.replace("\"\"", params[0].trim());
                                                    if (scriptP.indexOf("webElement") > 0)
                                                        scriptP = scriptP.replace(/webElement/g, "\"" + params[0].trim() + "\"");

                                                } if (params.length == 2) {
                                                    if (scriptP.indexOf("input") > 0)
                                                        scriptP = scriptP.replace("\"\"", "\"" + params[0].trim() + "\"").replace("input", "" + params[1].trim() + "");
                                                    if (scriptP.indexOf("arg0") > 0) {
                                                        scriptP = scriptP.replace("\"\"", "\"" + params[0].trim() + "\"").replace("arg0", "\"" + params[1].trim() + "\"");
                                                    }
                                                    if (scriptP.indexOf("webElement") > 0) {
                                                        scriptP = scriptP.replace(/webElement/g, "\"" + params[0].trim() + "\"");
                                                    }
                                                    if (scriptP.indexOf("source") > 0 || scriptJ.indexOf("target") > 0) {
                                                        scriptP = scriptP.replace("source", "\"" + params[0].trim() + "\"").replace(/target/g, "\"" + params[1].trim() + "\"");
                                                    }
                                                    if (scriptP.indexOf("actual") > 0 || scriptP.indexOf("expected") > 0) {
                                                        scriptP = scriptP.replace("actual", "\"" + params[0].trim() + "\"").replace("expected", "\"" + params[1].trim() + "\"");
                                                    }
                                                }
                                            }

                                            if (scriptCs && scriptCs != "") {
                                                scriptCs = scriptCs.replace("url", params[0].trim());

                                                if (params.length == 1) {
                                                    scriptCs = scriptCs.replace("\"\"", params[0].trim());
                                                    if (scriptCs.indexOf("webElement") > 0)
                                                        scriptCs = scriptCs.replace(/webElement/g, "\"" + params[0].trim() + "\"");
                                                }
                                                if (params.length == 2) {
                                                    if (scriptCs.indexOf("input") > 0)
                                                        scriptCs = scriptCs.replace("\"\"", "\"" + params[0].trim() + "\"").replace("input", "" + params[1].trim() + "");
                                                    else if (scriptCs.indexOf("arg0") > 0) {
                                                        scriptCs = scriptCs.replace("\"\"", "\"" + params[0].trim() + "\"").replace("arg0", "" + params[1].trim() + "");
                                                    }
                                                    else if (scriptCs.indexOf("webElement") > 0) {
                                                        scriptCs = scriptCs.replace(/webElement/g, "\"" + params[0].trim() + "\"");
                                                    }
                                                    else if (scriptCs.indexOf("source") > 0 || scriptJ.indexOf("target") > 0) {
                                                        scriptCs = scriptCs.replace("source", "\"" + params[0].trim() + "\"").replace(/target/g, "\"" + params[1].trim() + "\"");
                                                    }
                                                    else if (scriptCs.indexOf("actual") > 0 || scriptCs.indexOf("expected") > 0) {
                                                        scriptCs = scriptCs.replace("actual", "\"" + params[0].trim() + "\"").replace("expected", "\"" + params[1].trim() + "\"");
                                                    }
                                                }

                                            }

                                            if (scriptVb && scriptVb != "") {
                                                scriptVb = scriptVb.replace("url", params[0].trim());

                                                if (params.length == 1) {
                                                    scriptVb = scriptVb.replace("\"\"", params[0].trim());
                                                    if (scriptVb.indexOf("webElement") > 0)
                                                        scriptVb = scriptVb.replace(/webElement/g, "\"" + params[0].trim() + "\"");

                                                } if (params.length == 2) {
                                                    if (scriptVb.indexOf("input") > 0)
                                                        scriptVb = scriptVb.replace("\"\"", "\"" + params[0].trim() + "\"").replace("input", "" + params[1].trim() + "");
                                                    else if (scriptVb.indexOf("arg0") > 0) {
                                                        scriptVb = scriptVb.replace("\"\"", "\"" + params[0].trim() + "\"").replace("arg0", "" + params[1].trim() + "");
                                                    }
                                                    else if (scriptVb.indexOf("webElement") > 0) {
                                                        scriptVb = scriptVb.replace(/webElement/g, "\"" + params[0].trim() + "\"");
                                                    }
                                                    else if (scriptVb.indexOf("source") > 0 || scriptJ.indexOf("target") > 0) {
                                                        scriptVb = scriptVb.replace("source", "\"" + params[0].trim() + "\"").replace(/target/g, "\"" + params[1].trim() + "\"");
                                                    }
                                                    else if (scriptVb.indexOf("actual") > 0 || scriptVb.indexOf("expected") > 0) {
                                                        scriptVb = scriptVb.replace("actual", "\"" + params[0].trim() + "\"").replace("expected", "\"" + params[1].trim() + "\"");
                                                    }
                                                }

                                            }

                                            if (i == 0) {
                                                var desc = "";
                                                var cri = "";
                                                var name = "";
                                                if (req.description) {
                                                    desc = req.description;
                                                }

                                                if (req.accCriteria) {
                                                    cri = req.accCriteria;
                                                }

                                                if (req.reqname) {
                                                    name = req.reqname;
                                                }
                                                Val = { /*"TC#": sheetNum,*/ "Folder Name": "", "Title": name + "_" + $('.activeElement').attr("name") + "_" + con1 + "_" + con2, "Requirement Description": desc, "Acceptance Criteria": cri, "Description": tcaseName, "Status": "New", "PreRequisites": "", "Step_Seq": i + 1, "Step_Steps": this.cells[0].innerText, "Step_Expected Result": this.cells[4].innerText, "Manual Test Data": this.cells[5].innerText, "Automation Test Data": this.cells[6].innerText, "Priority": $('#RBT' + sheetNum + ' :selected').text(), "Type Of Test": $('#TypeOfCase' + sheetNum + ' :selected').text(), "Owner": owner, "Assigned To": "", "Automated Java Script": scriptJ, "Automated Python Script": scriptP, "Automated C# Script": scriptCs/*, "Automated VB Script": scriptVb */};
                                            }
                                            else {
                                                Val = { /*"TC#": "",*/ "Folder Name": "", "Title": "", "Requirement Description": "", "Acceptance Criteria": "", "Description": "", "Status": "New", "PreRequisites": "", "Step_Seq": i + 1, "Step_Steps": this.cells[0].innerText, "Step_Expected Result": this.cells[4].innerText, "Manual Test Data": this.cells[5].innerText, "Automation Test Data": this.cells[6].innerText, "Priority": "", "Type Of Test": "", "Owner": owner, "Assigned To": "", "Automated Java Script": scriptJ, "Automated Python Script": scriptP, "Automated C# Script": scriptCs/*, "Automated VB Script": scriptVb*/};
                                            }
                                            tcase.push(Val);
                                        }

                                    });


                                }

                            }
                        }

                        sheetNum++;
                    }
                });

                arrayCollection.push(tcase);
                opts.push({
                    headers: true, column: { style: { Font: { Color: "#FFFFFF" }, Interior: { Color: "#4F81BD", Pattern: "Solid" }, Alignment: { Horizontal: "Center" } } }, sheetid: sheetNum - 1 + ' Test Scenario Generated'
                });

                //var opts = {
                //    headers: true /*,range: "A2:A1048576"*/, column: { style: { Font: { Color: "#FFFFFF" }, Interior: { Color: "#C5D9F1", Pattern: "Solid" }, Alignment: { Horizontal: "Center" } } }, sheetid: sheetNum - 1 + ' Test Scenario Generated'
                //}


                //alert(JSON.stringify(arrayCollection));
                if (table != null) {
                    var res = alasql('SELECT INTO XLSX("GeneratedTestCases",?) FROM ?',
                        [opts, arrayCollection]);

                    //var res = alasql('SELECT * INTO XLS("GeneratedTestCases.xls",?) FROM ?', [opts, tcase]);
                }
                $.unblockUI();
            }

        });
    }
}



function clearTable(obj) {
    if ($($(obj).parent().parent().parent().offsetParent()).attr("id") != "divRegAnalysis") {
        $('#generateTCasesButton').hide();
        $('#addResultnData').hide();
        $('#addCreateRules').hide();
        $('#saveNUpdateButton').show();
        $('#saveButton').show();
    }
    if ($.fn.DataTable.isDataTable('#TestDataTable')) {
        table.destroy();
    }
    if ($.fn.DataTable.isDataTable('#TestDataTablenew')) {
        table.destroy();
    }
}

function SaveAsGlobal() {

    var activeFlow = $('.activeElement').attr('tcase');
    var url = getURL();

    $.ajax({
        url: url + '/TestProject/InsertUpdateGlobalModule/' + "e54aa0c8-867d-48e0-8722-095d1ee3ad86",
        type: 'PUT',
        data: activeFlow,
        async: false,
        success: function (Response, XMLHttpRequest, textStatus, errorThrown) {
            alert("Success");
        },
        error: function (Response, XMLHttpRequest, textStatus, errorThrown) {
            alert("Failed");
        }
    });
}
var millimeters = {};
function fnExportToPDF() {

    $.blockUI({
        css: {
            border: 'none',
            padding: '15px',
            backgroundColor: '#000',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: .5,
            color: '#fff'
        },
        onBlock: function () {
            var svgElements = $("#drawingArea").find('svg');

            //replace all svgs with a temp canvas
            svgElements.each(function () {
                var canvas, xml;

                canvas = document.createElement("canvas");
                canvas.className = "screenShotTempCanvas";
                $(canvas).attr("style", ($(this).attr("style")));
                //convert SVG into a XML string
                xml = (new XMLSerializer()).serializeToString(this);

                // Removing the name space as IE throws an error
                xml = xml.replace(/xmlns=\"http:\/\/www\.w3\.org\/2000\/svg\"/, '');

                //draw the SVG onto a canvas
                canvg(canvas, xml);
                $(canvas).insertAfter(this);
                //hide the SVG element
                this.className = "tempHide";
            });

            html2canvas(document.querySelector("#drawingArea")).then(function (canvas) {
                var myImage = canvas.toDataURL("image/png");
                var width = canvas.width;
                var height = canvas.height;

                millimeters.width = Math.floor(width * 0.264583);
                millimeters.height = Math.floor(height * 0.264583);

                saveAs(canvas.toDataURL());
                $.unblockUI();
                //After your image is generated revert the temporary changes
                $("#drawingArea").find('.screenShotTempCanvas').remove();
                $("#drawingArea").find('.tempHide').show().removeClass('tempHide');
            });

        }

    });
}


function saveAs(file) {
    var pdf = new jsPDF("p", "mm", "a4");
    pdf.deletePage(1);
    pdf.addPage(millimeters.width, millimeters.height);

    pdf.addImage(file, 'PNG', 0, 0);

    pdf.save('ModelFlow.pdf');
}


function compareTestCases(a1, a2) {

    $('#tblRegAn').show();
    $('#tblTestScen').hide();

    var ds = [];

    a1.filter(function (el, index) {
        var condition = "";
        a2.filter(function (ele, i) {
            if (md5(JSON.stringify(a1[index])) == md5(JSON.stringify(a2[i])) && containsObject(a2[i], a1)) {
                condition = " &nbsp;&nbsp;<b style='color:#7f7fff;'>As Is</b>";
            }
        })

        if (condition == "" && md5(JSON.stringify(a1[index])) != md5(JSON.stringify(a2[index]))) {
            condition = " &nbsp;&nbsp;<b style='color:red;'>Modified</b>";
        }

        if (!a2[index]) {
            condition = " &nbsp;&nbsp;<b style='color:#00FF7F;'>New</b>";
        }
        ds.push({ "chk": " <label><input type='checkbox' id='test" + parseInt(index + 1) + "' tcase='" + JSON.stringify(a1[index]) + "' style='float:left;' class='radio' name='optcheckbox'/><label for='test" + parseInt(index + 1) + "'></label></label>", "Scenario": "<label class='lblCase' tcase='" + JSON.stringify(a1[index]) + "' onclick='validate(this)'># " + parseInt(index + 1) + "</label>", "Reg": condition });
        $('#lblCompileSuccess').show();
        $('#lblCompileSuccess').html("Regression Analysis Successful - " + parseInt(index + 1) + " Test Scenarios Generated for new version!");
    });

    $('#content-scroll').remove();
    if ($.fn.DataTable.isDataTable('#tblRegAn')) {
        $('#tblRegAn').DataTable().destroy();
    }

    $('#tblRegAn').DataTable({
        data: ds,
        "ordering": false,
        "paginate": true,
        "lengthChange": false,
        "filter": false,
        "info": false,
        "bPaginate": false,
        "columns": [
            { "data": "chk" },
            { "data": "Scenario" },
            { "data": "Reg" }
        ],
        rowId: "rowId",
        "createdRow": function (row, data, index) {
            $('td', row).addClass('cst_padding');
        }

    });

    $('#tblRegAn tbody').attr("id", "content-scroll");
    $('#content-scroll').mCustomScrollbar({
        theme: 'dark-3',
        axis: "yx",
        scrollbarPosition: "outside",
        autoDraggerLength: true

    });

    var var_url = window.location.href;
    var btn = document.createElement("input");
    var lbl = document.createElement("label");
    btn.setAttribute("id", "GenerateExcel4Selected");
    btn.setAttribute("type", "image");
    btn.setAttribute("src", "../Content/Images/ExcelBW@3x.png");
    btn.setAttribute("title", "Generate Excel for selected cases");

    $(lbl).html("Export as Excel");

    btn.setAttribute("disabled", "disabled");
    btn.setAttribute("onclick", "fnGenerateExcel4Selected()");
    lbl.setAttribute("id", "lblGenerateExcel");


    var tableRef = document.getElementById('controlsExport');

    // Insert a row in the table at the last row
    var newRow = tableRef.insertRow(tableRef.rows.length);
    newRow.setAttribute("id", "rowControls")

    // Insert a cell in the row at index 0
    var newCell = newRow.insertCell(0);

    var newCell2 = newRow.insertCell(1);

    // Append a text node to the cell

    newCell.appendChild(btn);
    newCell.appendChild(lbl);
    $('#rightCheckBoxBar').show();
}


function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (md5(JSON.stringify(list[i])) == md5(JSON.stringify(obj))) {
            return true;
        }
    }

    return false;
}


function setValueforFlow(obj) {
    $('.flowElement').css("border", "1px solid #999");
    $('.flowElement').attr("onclick", "drawingAreaReady(this," + null + ")");

    $('.activeSuiteFlow').attr("flow", $(obj).attr("tcase"));
    $('.activeSuiteFlow').removeClass("activeSuiteFlow");

    $("#btnAssFlow").attr("disabled", "disabled");
    $("#btnAddFlow").removeAttr("disabled");

}

function AddFlowResultnData(obj) {
    var table = E2EexcelTestCase($(obj).attr("tcase"), $(obj).attr("spanId"));
    $("#AddExpectedResultsTdata button").attr("spanId", $(obj).attr("spanId"));
  //  $("#AddExpectedResultsTdatanew button").attr("spanId", $(obj).attr("spanId"));
}

function AddCreateRules(obj) {
    var table = E2EexcelTestCasenew($(obj).attr("tcase"), $(obj).attr("spanId"));
    $("#AddCreateRules button").attr("spanId", $(obj).attr("spanId"));
    //  $("#AddExpectedResultsTdatanew button").attr("spanId", $(obj).attr("spanId"));
}


$("#AddExpectedResultsTdata button").on("click", function () {
    if (!(E2EtblCollection[$(this).attr("spanId")])) {

        E2EtblCollection.length++;
    }

    var tbl = $('#TestDataTable').DataTable();
    var d = [];
    for (var i = 0; i < tbl.rows().count(); i++) {
        var row = $('#TestDataTable').dataTable().fnGetNodes(i).children;
        d.push({ "rowId": $('#TestDataTable').dataTable().fnGetNodes(i).id, "tStep": row[0].innerText, "Result": row[1].innerText, "tData": row[2].innerText });
    }

    E2EtblCollection[$(this).attr("spanId")] = d;

});
$("#AddCreateRules button").on("click", function () {
    if (!(E2EtblCollection[$(this).attr("spanId")])) {

        E2EtblCollection.length++;
    }

    var tbl = $('#TestDataTablenew').DataTable();
    var d = [];
    for (var i = 0; i < tbl.rows().count(); i++) {
        var row = $('#TestDataTablenew').dataTable().fnGetNodes(i).children;
        d.push({ "rowId": $('#TestDataTablenew').dataTable().fnGetNodes(i).id, "tStep": row[0].innerText});
    }

    E2EtblCollection[$(this).attr("spanId")] = d;

});
var E2ECon = [];
function GenerateEnd2EndCases() {
    var modelFlows = document.getElementsByClassName("modelFlowD");
    for (var i = 0; i < modelFlows.length; i++) {
        var json = JSON.parse($(modelFlows[i]).attr("flow"));
        for (var j = 0; j < json.connections.length; j++) {
            if (i != 0 && json.connections[j].pageSourceId == "startpoint") {
                json.connections[j].pageSourceId = "startpoint" + i;
            }
            if (json.connections[j].pageTargetId == "endpoint" && i != modelFlows.length - 1) {
                json.connections[j].pageTargetId = "startpoint" + parseInt(i + 1);
            }
            E2ECon.push(json.connections[j]);
        }
    }

    End2EndCases(E2ECon);



    var arrayCollectionE2E = [];

    var opts = [];
    var sheetNum = 1;
    for (var x = 0; x < E2EmasterArray.length; x++) {

        var testScenario = E2EmasterArray[x];
        var tcase = [];
        var E2EmasterSteps = [];

        for (var i = 0; i < E2EtblCollection.length; i++) {
            E2EmasterSteps = E2EtblCollection.concat(E2EtblCollection(i));
        }

        if (testScenario != null) {
            for (var i = 0; i < testScenario.length; i++) {
                for (var t = 0; t < table.rows().count(); t++) {
                    var row = $('#TestDataTable').dataTable().fnGetNodes(t);
                    var rowId = $(row).attr("id");
                    if ("row_" + testScenario[i].pageTargetId == rowId) {
                        //var data = row.data();
                        var Val = { "Test Step": row.cells[0].innerText, "Expected Result": row.cells[1].innerText, "Test Data": row.cells[2].innerText, "RBT Factor": "", "Type Of Test": "" };
                        tcase.push(Val);
                    }
                }
            }
        }
        tcase.push({ "Test Step": "", "Expected Result": "", "Test Data": "", "RBT Factor": $('#RBT' + sheetNum + ' :selected').text(), "Type Of Test": $('#TypeOfCase' + sheetNum + ' :selected').text() });
        arrayCollectionE2E.push(tcase);
        tcase = [];
        opts.push({
            headers: true, column: { style: { Font: { Color: "#FFFFFF" }, Interior: { Color: "#4F81BD", Pattern: "Solid" }, Alignment: { Horizontal: "Center" } } }, sheetid: 'Test Scenario ' + sheetNum
        });
        sheetNum++;

    }
    //alert(arrayCollection);

    var res = alasql('SELECT INTO XLSX("ModelFlow.xlsx",?) FROM ?',
        [opts, arrayCollectionE2E]);

}




var E2EmasterArray = [
    []
];

function End2EndCases(E2ECon) {
    E2EmasterArray = [
        []
    ];
    var firstNode;
    E2ECon.forEach(function (item) {

        if (item.pageSourceId == "startpoint") {
            firstNode = item;
        }
    })

    try {
        findTreeforE2E(firstNode, 0);

    }
    catch (error) {
        if (error instanceof RangeError) {
            alert("There seem to be a condition of infinite possibilities present.Please Re-Check the Flow Diagram!");
            $('#lblCompileSuccess').hide();
            return false;
        }
    }



}

function findTreeforE2E(curNode, index) {

    E2EmasterArray[index].push(curNode);
    var i = index;

    var thisArray = E2EmasterArray[index].slice();
    E2ECon.forEach(function (curItem) {
        if (curItem.pageSourceId == curNode.pageTargetId) {
            if (i > index) {
                var newArray = thisArray.slice();
                var newIndex = E2EmasterArray.push(newArray) - 1;
                findTreeforE2E(curItem, newIndex);
            }
            else {
                findTreeforE2E(curItem, index);
            }
            i++;
        }
    });
}



function fnSaveRBTType() {
    var ds = [];
    $('#tblTestScen tr').each(function (i, item) {
        if ($(this).children()[2].children.length > 0 && $(this).children()[3].children.length > 0 && $(this).children()[4].children[0].value)
            ds.push({ "Req": $(this).children()[2].children[0].value, "RBT": $(this).children()[3].children[0].value, "Type": $(this).children()[4].children[0].value });

    });

    var projectdetails = JSON.parse($('.activeElement').attr("data"));

    //$.cookie("a", "b");
    //alert($.cookie("a"));

    localStorage.setItem(projectdetails.projectid + projectdetails.moduleid + projectdetails.modelflowname + projectdetails.modelflowversion + "RBT", JSON.stringify(ds));
    alert("Changes made to the Test Case table have been saved!");
}


$('#btnSaveExpectedRnTData').on('click', function () {
    var ds = [];
    var dtable = $('#TestDataTable').dataTable();
    var row = dtable.fnGetNodes();
    localStorage.setItem("exresTdataImport", "[]");

    $(row).each(function () {
         ds.push({ "row_Id": $(this).attr("id"), "TestStep": this.cells[0].innerText, "ExpectedResult": this.cells[4].innerText, "TestData": this.cells[5].innerText,"AutomationTestData": this.cells[6].innerText}); //, //"AutomationTestData": this.cells[7].innerText 

    });

    var ProjectDetails = JSON.parse($('.activeElement').attr("data")); 
    var data = {
        "modelflowid": ProjectDetails.modelflowid,
        "modelflowname": ProjectDetails.modelflowname !== undefined && ProjectDetails.modelflowname !== null ? ProjectDetails.modelflowname : "NA",
        "description": "Deleting model flow",
        "version": ProjectDetails.modelflowversion,
        "nodes": "",
        "connections": "",
        "numberOfElements": "",
        "ExpectedResultTdata": ds
    };
    var url = getURL();
    $.ajax({
        url: url + '/TestProject/AddResultnData/' + ProjectDetails.projectid + '/' + ProjectDetails.moduleid + '/' + ProjectDetails.modelflowname,
        type: 'PUT',
        data: data,
        async: false,
        success: function (Response, XMLHttpRequest, textStatus, errorThrown) {
            // alert("Success");
            alert("Changes made to the Expected Results & Test data table have been saved!");
        },
        error: function (Response, XMLHttpRequest, textStatus, errorThrown) {
            //alert("Failed");
            alert("Sorry! Changes made to the Expected Results & Test data table were not saved.");
        }
    });

    //localStorage.setItem(projectdetails.projectid + projectdetails.moduleid + projectdetails.modelflowname + projectdetails.modelflowversion + "ExRnTData", JSON.stringify(ds));



});



$('#btnSaveCreateRules').on('click', function () {
    var ds = [];
    var dtable = $('#TestDataTablenew').dataTable();
    var row = dtable.fnGetNodes();
    localStorage.setItem("exresTdataImport", "[]");

    $(row).each(function () {
        ds.push({ "row_Id": $(this).attr("id"), "TestStep": this.cells[0].innerText, "ExpectedResult": this.cells[4].innerText, "TestData": this.cells[5].innerText, "AutomationTestData": this.cells[6].innerText }); //, //"AutomationTestData": this.cells[7].innerText 

    });

    var ProjectDetails = JSON.parse($('.activeElement').attr("data"));
    var data = {
        "modelflowid": ProjectDetails.modelflowid,
        "modelflowname": ProjectDetails.modelflowname !== undefined && ProjectDetails.modelflowname !== null ? ProjectDetails.modelflowname : "NA",
        "description": "Deleting model flow",
        "version": ProjectDetails.modelflowversion,
        "nodes": "",
        "connections": "",
        "numberOfElements": "",
        "ExpectedResultTdata": ds
    };
    var url = getURL();
    $.ajax({
        url: url + '/TestProject/AddResultnData/' + ProjectDetails.projectid + '/' + ProjectDetails.moduleid + '/' + ProjectDetails.modelflowname,
        type: 'PUT',
        data: data,
        async: false,
        success: function (Response, XMLHttpRequest, textStatus, errorThrown) {
            // alert("Success");
            alert("Changes made to the Expected Results & Test data table have been saved!");
        },
        error: function (Response, XMLHttpRequest, textStatus, errorThrown) {
            //alert("Failed");
            alert("Sorry! Changes made to the Expected Results & Test data table were not saved.");
        }
    });

    //localStorage.setItem(projectdetails.projectid + projectdetails.moduleid + projectdetails.modelflowname + projectdetails.modelflowversion + "ExRnTData", JSON.stringify(ds));



});


$('#btnExportExpectedRnTData').on('click', function () {
    var data = [];
    var dtable = $('#TestDataTable').dataTable();
    var row = dtable.fnGetNodes();


    $(row).each(function () {
        var Val;
        Val = { "TestStep": this.cells[0].innerText, "ExpectedResult": this.cells[1].innerText, "TestData": this.cells[2].innerText, "AutomationTestData": this.cells[6].innerText };
        data.push(Val);
    });


    alasql("SELECT * INTO XLSX('ExpectedResults&Tdata.xlsx',{headers:true}) FROM ? ", [data]);
});


$('#btnExportCreateRules').on('click', function () {
    var data = [];
    var dtable = $('#TestDataTablenew').dataTable();
    var row = dtable.fnGetNodes();


    $(row).each(function () {
        var Val;
        Val = { "TestStep": this.cells[0].innerText, "ExpectedResult": this.cells[1].innerText, "TestData": this.cells[2].innerText, "AutomationTestData": this.cells[6].innerText };
        data.push(Val);
    });


    alasql("SELECT * INTO XLSX('ExpectedResults&Tdata.xlsx',{headers:true}) FROM ? ", [data]);
});

//function getURL() {
//    var url;
//    $.ajax({
//        url: '/Home/getURL/',
//        type: 'GET',
//        async: false,
//        success: function (data) {
//            url = data;
//        },
//        error: function (Response) {
//            alert("Failed!")
//        }
//    });
//    return url;
//}

//$("#lnkLogout").on("click", function () {
//    window.location.href = "Logout";
//});

function checkSpcl(event) {
    var regex = new RegExp("^[a-zA-Z0-9/@/.]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
}


function myFunction() {
    document.getElementById("logDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.drpbtn')) {

        var dropdowns = document.getElementsByClassName("drpdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}


function fnChangeFile(obj) {
    $.blockUI({
        css: {
            border: 'none',
            padding: '15px',
            backgroundColor: '#000',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: .5,
            color: '#fff'
        },
        onBlock: function () {
            if (obj.files.length > 0) {
                try {
                    if (obj.files[0].name.indexOf("xml") < 0) {
                        parseExcel(obj.files[0]);
                    }
                    else {
                        var json = parseXML(obj.files[0]);
                    }
                }
                catch (err) {
                    alert("Oops! Something went wrong. Test Cases could not be imported.");
                }
            }
            $.unblockUI();
        }
    });
}


//$("#inputChoose").change(function (e) {
//    alert(e);
//        if (cC == 0) {
//            if (this.files.length > 0) {
//                parseExcel(this.files[0]);
//                cC++;
//            }
//        }
//    });


//var $c = $("#container");
//var $f1 = $("#container .f1");
//function FChange() {
//    alert("f1 changed");

//    $(this).remove();
//    $("<input type='file' class='f1' />").change(FChange).appendTo($c);
//}

//$f1.change(FChange);
//$f1.change();



//debugger;
var parseExcel = function (file) {
    var reader = new FileReader();
    var XL_row_object;
    var json_object;
    var exresTdataImport = [];
    var existExRes;
    var exExRes = [];
    //alert(file);
    reader.readAsBinaryString(file);


    reader.onload = function () {
        // alert(reader);
        //alert(reader.result);
        var data = reader.result;

        var workbook = XLSX.read(data, {
            type: 'binary'
        });

        workbook.SheetNames.forEach(function (sheetName) {
            // Here is your object
            XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
            json_object = JSON.stringify(XL_row_object);
            console.log(json_object);

        });


        reader.onerror = function (ex) {
            console.log(ex);
        };



        var nodes = []; var connections = []; var flowChart = {};
        var numberOfElements = 0;
        var source;

        if (json_object && json_object != null && json_object != "undefined") {
            var jsonarray = JSON.parse(json_object);
            var overlay = null;
            var x = 30;
            var y = 50;
            var tcaseNo = 1;
            for (var i = 0; i < jsonarray.length; i++) {

                if (i == 0) {
                    nodes.push({ "blockId": "startpoint", "nodetype": "startpoint", "positionX": "400", "positionY": "50", "DisplayText": null }, { "blockId": "startpoint1", "nodetype": "startpoint", "positionX": "NaN", "positionY": "150", "DisplayText": null }, { "blockId": "endpoint1", "nodetype": "endpoint", "positionX": "NaN", "positionY": "600", "DisplayText": null }, { "blockId": "startpoint2", "nodetype": "startpoint", "positionX": "NaN", "positionY": "150", "DisplayText": null }, { "blockId": "endpoint2", "nodetype": "endpoint", "positionX": "NaN", "positionY": "600", "DisplayText": null });
                    source = "startpoint";
                }

                // var a = Math.floor(Math.random() * 20);
                var id; var end;
                var nodetype;
                if (jsonarray[i].Step_Steps != null) {
                    if (jsonarray[i].Step_Steps.indexOf("(") > -1) {
                        id = "decisioncontainer-" + tcaseNo + "_" + jsonarray[i].Step_Seq;
                        nodetype = "decision";
                    }
                    else {
                        id = "taskcontainer-" + tcaseNo + "_" + jsonarray[i].Step_Seq;
                        nodetype = "task";
                    }

                    //var exists = nodes.filter(node => /*node.blockId.indexOf(id) > -1 &&*/ jsonarray[i].Step_Steps.indexOf(node.DisplayText) > -1);

                    var exists = nodes.filter(node => /*node.blockId.indexOf(id) > -1 &&*/ !(node.nodetype.indexOf("startpoint") > -1) && !(node.nodetype.indexOf("endpoint") > -1) && node.DisplayText == jsonarray[i].Step_Steps || (node.nodetype == "decision" && node.DisplayText == jsonarray[i].Step_Steps.substring(0, jsonarray[i].Step_Steps.indexOf("("))));

                    //var exists;
                    //if (overlay != null) {
                    //    exists = nodes.filter(node => jsonarray[i].Step_Steps.indexOf(node.DisplayText) > -1 && jsonarray[i].Step_Steps.indexOf(overlay) > -1);
                    //}
                    //else {
                    //    exists = nodes.filter(node => jsonarray[i].Step_Steps.indexOf(node.DisplayText) > -1);
                    //}

                    if (i != 0 && i != 1 && i % 2 == 0) {
                        x = 120;
                    }
                    else {
                        x += 340;
                    }

                    if (exists.length == 0 /*|| (exists.length > 0*/ /*&&*/ /*jsonarray[i].Step_Steps != exists[0].DisplayText*//* exists.filter(e => e.DisplayText.indexOf(jsonarray[i].Step_Steps.substring(0, jsonarray[i].Step_Steps.indexOf("("))) > -1) == -1*/ /*&& nodetype != "decision")*/) {
                        numberOfElements++;
                        id = id + "_" + numberOfElements;
                        end = id;
                        y += 140;
                        if (nodetype == "task") {
                            nodes.push({
                                blockId: id,
                                nodetype: nodetype,
                                positionX: x,
                                positionY: y,
                                DisplayText: jsonarray[i].Step_Steps
                            });
                        }
                        else {
                            nodes.push({
                                blockId: id,
                                nodetype: nodetype,
                                positionX: x,
                                positionY: y,
                                DisplayText: jsonarray[i].Step_Steps.substring(0, jsonarray[i].Step_Steps.indexOf("("))
                            });
                        }
                    }
                    else if (exists.length == 1 && end == "endpoint") {
                        id = exists[0].blockId;
                        end = id;
                    }
                    else if (exists.length == 1 /*&& jsonarray[i].Step_Seq!=1*/) {
                        id = exists[0].blockId;
                        end = id;
                    }
                    if (exists.length == 0 && end == "endpoint") {
                        id = id + "_" + numberOfElements;
                        end = id;
                    }

                    //if (jsonarray[i].Step_Seq == 1) {
                    //    end = "endpoint";
                    //}

                    if ((i != 0 && jsonarray[i] && jsonarray[i].Step_Seq == "1")) {
                        end = "endpoint";
                        tcaseNo++;
                    }

                    var existsC = connections.filter(conn => conn.pageSourceId == source /*> -1*/ && conn.pageTargetId == end/* > -1*/ && conn.overlay == overlay);

                    if (existsC.length == 0) {

                        //if (source.indexOf("decision") > -1 && overlay==null) {
                        //    var nodex = nodes.filter(node => node.blockId.indexOf(source)>-1);
                        //    var dispText = jsonarray.filter(node => node.Step_Steps.indexOf(nodex[0].DisplayText)>-1);
                        //    overlay = dispText.substring(dispText.indexOf("(") + 1, dispText.indexOf(")"));
                        //}
                        numberOfElements++;
                        if (nodetype == "task") {
                            connections.push({
                                overlay: overlay,
                                pageSourceId: source,
                                pageTargetId: end
                            });
                            overlay = null;
                        }
                        else {
                            connections.push({
                                overlay: overlay,
                                pageSourceId: source,
                                pageTargetId: end
                            });
                            overlay = null;
                            overlay = jsonarray[i].Step_Steps.substring(jsonarray[i].Step_Steps.indexOf("(") + 1, jsonarray[i].Step_Steps.indexOf(")"));
                        }
                        if (end == "endpoint") {
                            source = exists[0].blockId;
                            //overlay = exists[0].overlay;
                        }
                        else {
                            source = end;
                        }
                    }
                    else {
                        source = exists[0].blockId;
                        overlay = null;
                        overlay = jsonarray[i].Step_Steps.substring(jsonarray[i].Step_Steps.indexOf("(") + 1, jsonarray[i].Step_Steps.indexOf(")"));
                        //overlay = exists[0].overlay;
                    }
                    if (i == jsonarray.length - 1) {
                        numberOfElements++;
                        existsC = connections.filter(conn => conn.pageSourceId == source /*> -1*/ && conn.pageTargetId == "endpoint"/* > -1*/ && conn.overlay == overlay);
                        if (existsC.length == 0) {
                            connections.push({
                                overlay: overlay,
                                pageSourceId: source,
                                pageTargetId: "endpoint"
                            });
                        }
                        overlay = null;
                        overlay = jsonarray[i].Step_Steps.substring(jsonarray[i].Step_Steps.indexOf("(") + 1, jsonarray[i].Step_Steps.indexOf(")"));
                        y += 100;
                        nodes.push({
                            blockId: "endpoint",
                            nodetype: "endpoint",
                            positionX: "416",
                            positionY: y,
                            DisplayText: null
                        });

                    }

                    var step = jsonarray[i].Step_Steps;
                    //if (jsonarray[i].Step_Steps.indexOf("(") > -1)
                    //    step = jsonarray[i].Step_Steps.substring(0, jsonarray[i].Step_Steps.indexOf("(") - 1);

                    var ExactMatch = nodes.filter(node => /*node.blockId.indexOf(id) > -1 &&*/ !(node.nodetype.indexOf("startpoint") > -1) && !(node.nodetype.indexOf("endpoint") > -1) && node.DisplayText == step || (node.nodetype == "decision" && node.DisplayText == step.substring(0, step.indexOf("("))));
                    if (ExactMatch && ExactMatch.length > 0)

                        //var currTcase = exists[0].blockId.substring(exists[0].blockId.indexOf("-")+1, exists[0].blockId.indexOf("_")) == tcaseNo;

                        var currTcase = exists.filter(node => node.blockId.substring(node.blockId.indexOf("-") + 1, node.blockId.indexOf("_")) == tcaseNo);

                    var res = jsonarray[i]["Step_Expected Result"] == null ? "" : jsonarray[i]["Step_Expected Result"];
                    var mdata = jsonarray[i]["Manual Test Data"] == null ? "" : jsonarray[i]["Manual Test Data"];
                    var adata = jsonarray[i]["Automation Test Data"] == null ? "" : jsonarray[i]["Automation Test Data"];

                    if (exresTdataImport.length > 0) {
                        existExRes = exresTdataImport.filter(ex => ex.tStep == jsonarray[i].Step_Steps && ex.Result == "<div class='editable' contenteditable='true'>" + res + "</div>" && ex.tData == "<div class='editable' contenteditable='true'>" + mdata + "</div>" && ex.AtData == "<div class='editable' contenteditable='true'>" + adata + "</div>");
                        exExRes = exresTdataImport.filter(ex => ex.tStep == jsonarray[i].Step_Steps && ex.Result != "<div class='editable' contenteditable='true'>" + res + "</div>" && ex.tData != "<div class='editable' contenteditable='true'>" + mdata + "</div>" && ex.AtData != "<div class='editable' contenteditable='true'>" + adata + "</div>");
                    }

                    if (ExactMatch.length > 0 && currTcase.length > 0 || ExactMatch.length > 0 && exExRes.length > 0) {
                        alert("\"" + exists[0].DisplayText + "\" Step appears more than once. Please avoid duplicate Test Steps by ensuring uniquely descriptive values for each step and Try Importing Test Cases Again.");
                        nodes = [];
                        nodes.push({ "blockId": "startpoint", "nodetype": "startpoint", "positionX": "400", "positionY": "50", "DisplayText": null }, { "blockId": "startpoint1", "nodetype": "startpoint", "positionX": "NaN", "positionY": "150", "DisplayText": null }, { "blockId": "endpoint1", "nodetype": "endpoint", "positionX": "NaN", "positionY": "600", "DisplayText": null }, { "blockId": "startpoint2", "nodetype": "startpoint", "positionX": "NaN", "positionY": "150", "DisplayText": null }, { "blockId": "endpoint2", "nodetype": "endpoint", "positionX": "NaN", "positionY": "600", "DisplayText": null });
                        connections = [];
                        break;
                    }

                    if (!existExRes || (existExRes && existExRes.length == 0)) {
                        exresTdataImport.push({ "rowId": "", "tStep": jsonarray[i].Step_Steps, "JtStep": "", "PtStep": "", "CstStep": "", "Result": "<div class='editable' contenteditable='true'>" + res + "</div>", "tData": "<div class='editable' contenteditable='true'>" + mdata + "</div>", "AtData": "<div class='editable' contenteditable='true'>" + adata + "</div>" });
                    }

                }
                else {
                    alert("Selected file does not adhere to the pattern supported by the Tool. Test Cases could not be imported.");
                    break;
                }
            }
            localStorage.setItem("exresTdataImport", JSON.stringify(exresTdataImport));
            flowChart.nodes = nodes;
            flowChart.connections = connections;
            flowChart.numberOfElements = numberOfElements;

            var flowChartJson = JSON.stringify(flowChart);
            console.log(flowChartJson);
            $(".activeElement").attr("tcase", flowChartJson);
            drawingAreaReady($('.activeElement'), null);
            $('#generateTCasesButton').hide();
            $('#addResultnData').hide();
            $('#addCreateRules').hide();
            $('#saveNUpdateButton').show();
            $('#saveButton').show();
        }
    };
};


function arrayRemove(arr, value) {

    return arr.filter(function (ele) {
        return ele.blockId != value;
    });

}

function Reallign() {
    var tcase = JSON.parse($(".activeElement").attr("tcase"));
    var con = tcase.connections;
    var nodes = tcase.nodes;

    for (var i = 0; i < con.length; i++) {
        var currSourceNode = nodes.filter(node => node.blockId == con[i].pageSourceId);
        var currTargetNode = nodes.filter(node => node.blockId == con[i].pageTargetId);
        var newTarget;
        if (currSourceNode[0].nodetype != "decision") {
            currTargetNode[0].positionX = currSourceNode[0].positionX;
            currTargetNode[0].positionY = parseInt(currSourceNode[0].positionY) + 150;
        }
        //if (currTargetNode[0].nodetype == "endpoint") {
        //    currTargetNode[0].positionX = currSourceNode[0].positionX;
        //    currTargetNode[0].positionY = parseInt(currSourceNode[0].positionY) + 650;
        //}   
    }

    var dec = con.filter(node => node.pageSourceId.indexOf("decision") > -1);
    var configured = [];
    var chkconfigured = [];
    for (var j = 0; j < dec.length; j++) {
        if (configured != null)
            chkconfigured = configured.filter(node => node == dec[j].pageTargetId);
        if (chkconfigured.length == 0) {
            var decTarg = dec.filter(node => node.pageSourceId == dec[j].pageSourceId);
            var xstart = 20;
            var ystart = 0;

            for (var p = 0; p < decTarg.length; p++) {
                var decSourceNode = nodes.filter(node => node.blockId == decTarg[p].pageSourceId);
                var decTargetNode = nodes.filter(node => node.blockId == decTarg[p].pageTargetId);

                if (decTargetNode[0].blockId != "endpoint") {
                    decTargetNode[0].positionX = xstart;
                    decTargetNode[0].positionY = parseInt(decSourceNode[0].positionY) + 150 + ystart;

                    xstart = xstart + 180;
                    if (xstart > 750) {
                        xstart = 20;
                        ystart = 150;
                    }
                    configured.push(decTarg[p].pageTargetId);
                }
            }
        }
    }


    var endp = con.filter(node => node.pageTargetId.indexOf("endpoint") > -1);
    var maxY = 0;
    for (var k = 0; k < endp.length; k++) {
        var ele = nodes.filter(node => node.blockId == endp[k].pageSourceId);
        if (ele != null) {
            if (maxY < parseInt(ele[0].positionY))
                maxY = parseInt(ele[0].positionY);
        }
    }
    var endpointY = nodes.filter(node => node.blockId == "endpoint");
    if (parseInt(endpointY[0].positionY) < maxY)
        endpointY[0].positionY = maxY + 350;


    $(".activeElement").attr("tcase", JSON.stringify(tcase));
    $(".activeElement").click();
    $('#generateTCasesButton').hide();
    $('#addResultnData').hide();
    $('#addCreateRules').hide();
    $('#saveNUpdateButton').show();
    $('#saveButton').show();
}


function ImportfrmExcel() {
    //alasql('SELECT * FROM XLSX("GeneratedTestCases (12).xlsx",{headers:true})', [event], function (data) {
    //    alert(data);
    //});
    $("#inputChoose").show();
    $("#inputChoose").css("display", "inline");
    $("#inputChoose").css("margin-left", "10px;");
}