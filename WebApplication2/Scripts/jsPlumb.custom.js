/* jsplumb.custom.js
 *
 This is an extended custom js file for the jsPlumb library which includes features and 
 functionalities related to the flow chart and the components constituting flowchart 
*/

//for adding a task box
function addTask(id, text) {
    var c = Math.round(Math.random() * 818181);
    if (typeof id === "undefined") {
        numberOfElements++;
        var a = Math.floor(Math.random() * 20);
        id = "taskcontainer_" + a + "_" + numberOfElements;
    }

    $('<div class="window task node" id="' + id + '" data-nodetype="task" style="left:30px; top:30px;">').appendTo('#' + htmlBase).html($(("#taskcontainer0"))[0].innerHTML);

    $('#' + id).css("left", window.pageXOffset + 50);
    $('#' + id).css("top", window.pageYOffset + 120);

    var b = Math.round(Math.random()*c * 2000);
    $('#' + id + ' .gear').attr("id", "gear" + "_" + b);

    var taskSourceConnectorEndpoint = {
        isSource: true,
        isTarget: false,
        maxConnections: 1,
        anchor: [0.5, 1, 0, 1, 0, 0, "task_end endpoint"],
        uuid: "source" + id
    };

    var taskTargetConnectorEndpoint = {
        isSource: false,
        isTarget: true,
        maxConnections: 8,
        anchor: [0.5, 0, 0, -1, 0, 0, "task_end endpoint"],
        paintStyle: { fillStyle: 'red' },
        endpoint: ["Rectangle", { width: 12, height: 12 }],
        uuid: "target" + id
    };


    jsPlumb.addEndpoint(
        $('#' + id),
        taskSourceConnectorEndpoint
    );

    jsPlumb.addEndpoint(
        $('#' + id),
        taskTargetConnectorEndpoint
    );

    jsPlumb.draggable($('#' + id));
    $.trim($('#' + id + ' .detail_text').val(text));
    return id;
}

//Adding a Flow for End to End Test cases
function addFlowContainer(id) {
    if (typeof id === "undefined") {
        numberOfElements++;
        var a = Math.floor(Math.random() * 20);
        id = "flowcontainer_" + a + "_" + numberOfElements;
    }

    $('<div class="window task node" id="' + id + '" data-nodetype="task" style="left:30px; top:30px;">').appendTo('#' + htmlBase).html($(("#taskcontainer0"))[0].innerHTML);

    $('#' + id).css("left", window.pageXOffset + 50);
    $('#' + id).css("top", window.pageYOffset + 120);

    var taskSourceConnectorEndpoint = {
        isSource: true,
        isTarget: false,
        maxConnections: 1,
        anchor: [0.5, 1, 0, 1, 0, 0, "task_end endpoint"],
        uuid: "source" + id
    };

    var taskTargetConnectorEndpoint = {
        isSource: false,
        isTarget: true,
        maxConnections: 8,
        anchor: [0.5, 0, 0, -1, 0, 0, "task_end endpoint"],
        paintStyle: { fillStyle: 'red' },
        endpoint: ["Rectangle", { width: 12, height: 12 }],
        uuid: "target" + id
    };


    jsPlumb.addEndpoint(
        $('#' + id),
        taskSourceConnectorEndpoint
    );

    jsPlumb.addEndpoint(
        $('#' + id),
        taskTargetConnectorEndpoint
    );

    jsPlumb.draggable($('#' + id));
    $('#' + id + ' input').css("display", "none");
    $('#' + id).addClass("modelFlowD");
    $('#' + id).attr("oncontextmenu", "funcDropdownAddExpResnTdata(event,this)");
    $('#' + id).addClass("activeSuiteFlow");
    return id;
}




//for adding a decision box
var maxdecision = 8; //for now hardcoded the maxmum number of connection to a decision as 2
function addDecision(id, text, existing) {    
    var c = Math.round(Math.random() * 3737373);
    if (typeof id === "undefined") {
        numberOfElements++;
        var a = Math.floor(Math.random() * 20);
        id = "decisioncontainer_" + a + "_" + numberOfElements;
    }
    $('<div class="window decision node" id="' + id + '" data-nodetype="decision" style="left:30px; top:30px;">').appendTo('#' + htmlBase).html($(("#decisioncontainer0"))[0].innerHTML);

    //$('#' + id).css("left", window.pageXOffset + 90);
    //$('#' + id).css("top", window.pageYOffset - 10);

    $('#' + id).css("left", window.pageXOffset + 50);
    $('#' + id).css("top", window.pageYOffset + 120);

    var b = Math.round(Math.random() *c * 2000);
    $('#' + id + ' .gear').attr("id", "gear" + "_" + b);

    var upperDecisionConnectorEndpoint = {
        isSource: false,
        isTarget: true,
        maxConnections: maxdecision,
        anchor: [0.5, 0, 0, -1, 16, 0, "upper_dec_end endpoint"],
        //anchor: [0.3, -0.2, 0, -1, 16, 0, "upper_dec_end endpoint"],
        paintStyle: { fillStyle: 'red' },
        endpoint: ["Rectangle", { width: 12, height: 12 }],
        uuid: "source" + id
    };
    var leftDecisionConnectorEndpoint;
    var rightDecisionConnectorEndpoint;

    if (!existing) {
        leftDecisionConnectorEndpoint = {
            isSource: true,
            isTarget: false,
            maxConnections: maxdecision,
            anchor: [0, 0.5, 0, 1, 0, 16, "left_dec_start startpoint"],
            //anchor: [-0.2, 0.3, 0, 1, 0, 16, "left_dec_start startpoint"],
            uuid: "target1" + id,
            connectorOverlays: [
                ["Label", { label: "Enter condition here", id: "label" }]
            ]
        };

        rightDecisionConnectorEndpoint = {
            isSource: true,
            isTarget: false,
            maxConnections: maxdecision,
            anchor: [1.0, 0.5, 0, 1, 32, 16, "right_dec_start startpoint"],
            //anchor: [0.8, 0.3, 0, 1, 32, 16, "right_dec_start startpoint"],
            uuid: "target2" + id,
            connectorOverlays: [
                ["Label", { label: "Enter condition here", id: "label" }]
            ]
        };
    }
    else {
        leftDecisionConnectorEndpoint = {
            isSource: true,
            isTarget: false,
            maxConnections: maxdecision,
            anchor: [0, 0.5, 0, 1, 0, 16, "left_dec_start startpoint"],
            uuid: "target1" + id
        };

        rightDecisionConnectorEndpoint = {
            isSource: true,
            isTarget: false,
            maxConnections: maxdecision,
            anchor: [1.0, 0.5, 0, 1, 32, 16, "right_dec_start startpoint"],
            uuid: "target2" + id
        };
    }

    jsPlumb.addEndpoint(
        $('#' + id),
        leftDecisionConnectorEndpoint
    );

    jsPlumb.addEndpoint(
        $('#' + id),
        rightDecisionConnectorEndpoint
    );

    jsPlumb.addEndpoint(
        $('#' + id),
        upperDecisionConnectorEndpoint
    );

    jsPlumb.draggable($('#' + id));
    $.trim($('#' + id + ' .detail_text').val(text));
    return id;
}

//works only in chrome
function zoomin() {
    //$('#drawingArea').css("zoom", "1");
    //$('#drawingArea').css("margin-top", "0px");
    var Page = document.getElementById('drawingArea');
    if (parseInt(Page.style.zoom) < 100) {
        var zoom = parseInt(Page.style.zoom) + 10 + '%'
        Page.style.zoom = zoom;
    }
    return false;
}

//works only in chrome
function zoomout() {
    //$('#drawingArea').css("zoom", "0.6");
    //$('#drawingArea').css("margin-top", "42px");
    var Page = document.getElementById('drawingArea');
    var zoom = parseInt(Page.style.zoom) - 10 + '%';
    Page.style.zoom = zoom;
    return false;
}

//generating corresponding JSON from a flowchart drawn and saving it in mongoDB
var flowChart = {};
var connections = [];
function saveFlowchart(obj, createdBy) {
    //debugger;
    $('#liAddModFlow').attr("unsaved", "false");
    if (FlowChartDetails !== undefined && FlowChartDetails !== null) {
        console.log(FlowChartDetails);
        var nodes = [];
        connections = [];
        $(".node").each(function (idx, elem){
            var $elem = $(elem);
            var endpoints = jsPlumb.getEndpoints($elem.attr('id'));
            console.log('endpoints of ' + $elem.attr('id'));
            console.log(endpoints);

            var disptext = "";
            var id = $elem.attr('id');

            if (id != "" && id != null && id != "startpoint" && id != "endpoint") {
                disptext = $.trim($('#' + id + ' .detail_text').val());
            }

            nodes.push({
                blockId: $elem.attr('id'),
                nodetype: $elem.attr('data-nodetype'),
                positionX: parseInt($elem.css("left"), 10),
                positionY: parseInt($elem.css("top"), 10),
                DisplayText: disptext !== undefined && disptext !== null ? disptext : ""
            });
            var url = getURL();
        });

        var NoOfTestCases = 0;
        $.each(jsPlumb.getConnections(), function (idx, connection) {
            var overlays = connection.getOverlays();
            var overlayLabel;
            $.each(overlays, function (idx, overlay) {
                if (overlay.type == "Label") {
                    overlayLabel = overlay.getLabel();
                }
            });

 if (connection.targetId.indexOf("endpoint") > -1) {
                connection.targetId = "endpoint";
            }

            connections.push({
                //connectionId: connection.id,
                overlay: overlayLabel,
                pageSourceId: connection.sourceId,
                pageTargetId: connection.targetId
            });
        });


        flowChart.nodes = nodes;
        flowChart.connections = connections;
        flowChart.numberOfElements = numberOfElements;

        var flowChartJson = JSON.stringify(flowChart);
        console.log(flowChartJson);

        //$('#jsonOutput').val(JSON.stringify(flowChartJson));
        $('.activeElement').attr("tcase", flowChartJson);

        var ModelflowDTO = {
            "modelflowid": FlowChartDetails.modelflowid,
            "modelflowname": FlowChartDetails.modelflowname !== undefined && FlowChartDetails.modelflowname !== null ? FlowChartDetails.modelflowname : "NA",
            "description": "Creating new model flow",
            "version": FlowChartDetails.modelflowversion,
            "nodes": nodes,
            "connections": connections,
            "numberOfElements": numberOfElements
        }

        //gets the URL of the API from web.config
        var url = getURL();
        var bPublish = false;

        if (obj != null) {
            if ($(obj).attr('id') == "saveButton") {
                bPublish = true;
            }
            else if ($(obj).attr('id') == "saveNUpdateButton") {
                bPublish = false;
            }
        }

        $.ajax({
            //url: appSettings.apiServiceBaseUri + '/TestProject/CreateProjectDetail/',
            url: url + '/TestProject/UpdateModelFlowDetail/' + FlowChartDetails.projectid + '/' + FlowChartDetails.moduleid + '/' + FlowChartDetails.modulename + '/' + bPublish,
            type: 'PUT',
            data: ModelflowDTO,
            async: false,
            success: function (Response, XMLHttpRequest, textStatus, errorThrown) {
                //$scope.text = "Model Flow Creation is success";
                if (obj != null)
                    alert("Your Action was completed successfully!");
            },
            error: function (Response, XMLHttpRequest, textStatus, errorThrown) {
                alert("Failed");
                //console.log(Response);
                //$(ErrorMessage).modal('show');
            }
        })

    }
    else {
        alert("Workflow cannot be saved...")
    }
    //for opening all the projects that were open and 
    //marking only one project as active to expand that in treeview
    OpenExisting(createdBy, $('.activeElement'));

    $('.activeElement').closest('.clsproject').addClass("activeproject");
}




var flowChart = {};
var connections = [];
//Assigns the value of the JSOn to data property of the node element of the tree
function saveLocally() {
    //debugger;
    var tcase = $('.activeElement').attr("tcase");
    if (FlowChartDetails !== undefined && FlowChartDetails !== null) {
        console.log(FlowChartDetails);
        var nodes = [];
        connections = [];
        $(".node").each(function (idx, elem) {
            var $elem = $(elem);
            var endpoints = jsPlumb.getEndpoints($elem.attr('id'));
            console.log('endpoints of ' + $elem.attr('id'));
            console.log(endpoints);

            var disptext = null;
            var id = $elem.attr('id');

            if (id != "" && id != null && id != "startpoint" && id != "endpoint" && id != "startpoint1" && id != "endpoint1" && id != "startpoint2" && id != "endpoint2") {
                disptext = $.trim($('#' + id + ' .detail_text').val());
            }
            if ($elem.attr('id') != "startpoint1" && $elem.attr('id') != "startpoint2" && $elem.attr('id') != "endpoint1" && $elem.attr('id') != "endpoint2") {
                nodes.push({
                    blockId: $elem.attr('id'),
                    nodetype: $elem.attr('data-nodetype'),
                    positionX: parseInt($elem.css("left"), 10).toString(),
                    positionY: parseInt($elem.css("top"), 10).toString(),
                    DisplayText: disptext
                });
            }
            else {
                var exisitingJSON = JSON.parse(tcase);
                var posX = "";
                var posY = "";
                $(exisitingJSON.nodes).filter(function (i, val) {
                    if (val.blockId == $elem.attr('id')) {
                        posX = val.positionX;
                        posY = val.positionY;
                    }
                })

                nodes.push({
                    blockId: $elem.attr('id'),
                    nodetype: $elem.attr('data-nodetype'),
                    positionX: posX,
                    positionY: posY,
                    DisplayText: disptext
                });
            }
        });

        var NoOfTestCases = 0;
        $.each(jsPlumb.getConnections(), function (idx, connection) {
            var overlays = connection.getOverlays();
            var overlayLabel = null;
            $.each(overlays, function (idx, overlay) {
                if (overlay.type == "Label") {
                    overlayLabel = overlay.getLabel();
                }
            });
            if (overlayLabel == "") {
                overlayLabel = null;
            }
            connections.push({
                //connectionId: connection.id,
                pageSourceId: connection.sourceId,
                pageTargetId: connection.targetId,
                overlay: overlayLabel
            });
        });


        flowChart.nodes = nodes;
        flowChart.connections = connections;
        flowChart.numberOfElements = numberOfElements;

        var flowChartJson = JSON.stringify(flowChart);
        console.log(flowChartJson);

        //$('#jsonOutput').val(JSON.stringify(flowChartJson));
        $('.activeElement').attr("tcase", flowChartJson);
    }

}

var masterArray = [
    []
];

//function to generate test cases from flowchart
function fnTestCases() {
    $('.divElement').remove();
    $("#rowControls").remove();
    $("#rowHeader").remove();
    $('#GenerateExcel4Selected').remove();
    $("#ExportToPDF").remove();
    masterArray = [
        []
    ];
    var firstNode;
    connections.forEach(function (item) {

        if (item.pageSourceId == "startpoint") {
            firstNode = item;
        }
    })

    try {
        //calling recursive function to find all possible path from startpoint to endpoint
        findTree(firstNode, 0);

    }
    catch (error) {
        if (error instanceof RangeError) {
            alert("There seem to be a condition of infinite possibilities present.Please Re-Check the Flow Diagram!");
            $('#lblCompileSuccess').hide();
            return false;
        }
    }



}


function findTree(curNode, index) {

    masterArray[index].push(curNode);
    var i = index;

    var thisArray = masterArray[index].slice();
    connections.forEach(function (curItem) {
        if (curItem.pageSourceId == curNode.pageTargetId) {
            if (i > index) {
                var newArray = thisArray.slice();
                var newIndex = masterArray.push(newArray) - 1;
                findTree(curItem, newIndex);
            }
            else {
                findTree(curItem, index);
            }
            i++;
        }
    });
}

//function to add the test case table and also add export and save buttons in the right pane
function AddControlsForTcases() {
    var ds = [];
    $('#tblRegAn').hide();

    var loose;

    for (var i = 0; i < masterArray.length; i++) {
        if (!(masterArray[i][masterArray[i].length - 1]) || masterArray[i][masterArray[i].length - 1].pageTargetId != "endpoint") {
            if (masterArray[i][masterArray[i].length - 1] == null || masterArray[i][masterArray[i].length - 1]) {
                alert("There are loose ends in your Diagram. Please recheck.");
                loose = true;
                $('#tblTestScen').hide();
                if (masterArray[i][masterArray[i].length - 1] != null) {
                    if (masterArray[i][masterArray[i].length - 1].pageTargetId.indexOf("task") > -1) {
                        $('#' + masterArray[i][masterArray[i].length - 1].pageTargetId + ' div').addClass("salmon");
                        $('html, body').animate({
                            scrollTop: $('#' + masterArray[i][masterArray[i].length - 1].pageTargetId + ' div').offset().top
                        }, 2000);
                    }
                    else {
                        $('#' + masterArray[i][masterArray[i].length - 1].pageTargetId).addClass("salmon");
                        $('html, body').animate({
                            scrollTop: $('#' + masterArray[i][masterArray[i].length - 1].pageTargetId).offset().top - 80
                        }, 2000);
                    }
            }
            }

            break;
            return false;
        }
    }
    var url = getURL();
    if (!loose) {
        $('#tblTestScen').show();
        $('.rectangeshapewhite').removeClass("salmon");
        var projectdetails = JSON.parse($('.activeElement').attr("data"));

        var val = "";
        var storagename = projectdetails.projectid + projectdetails.moduleid + projectdetails.modelflowname + projectdetails.modelflowversion + "RBT";
        $.ajax({
            url: url + '/TestProject/FetchReq/' + projectdetails.projectid + '/' + projectdetails.moduleid + '/' + projectdetails.modulename + '/' + null,
            type: "GET",
            success: function (data) {
                if (data) {
                    for (var i = 0; i < data.length; i++) {
                        val = val + "<option params='" + JSON.stringify(data[i]) + "' value='" + data[i].reqid + "'>" + data[i].reqname + "</option>";
                    }
                }
            },
            error: function (Response) {
                alert("Failed!");
            },
            async: false
        });

        if (localStorage.getItem(storagename)) {
            var existing = JSON.parse(localStorage.getItem(storagename));
            if (existing.length == masterArray.length) {
                $.each(masterArray, function (i, item) {

                    var a = ["+ve", "-ve"];
                    var b = ["High", "Low", "Medium"];
                    var RBT;
                    var Type;

                    if (b.indexOf(existing[i].RBT) > -1) {
                        RBT = "<select class='form-control selectpicker customdrpdwn' id='RBT" + parseInt(i + 1) + "'><option value='Select'>Select</option>"
                        if (existing[i].RBT == "High") {
                            RBT = RBT + "<option value='Low'>Low</option><option value='High' selected='selected'>High</option><option value='Medium'>Medium</option>";
                        }
                        else if (existing[i].RBT == "Low") {
                            RBT = RBT + "<option value='Low' selected='selected'>Low</option><option value='High'>High</option><option value='Medium'>Medium</option>";
                        }
                        else if (existing[i].RBT == "Medium") {
                            RBT = RBT + "<option value='Low'>Low</option><option value='High'>High</option><option value='Medium' selected='selected'>Medium</option>"
                        }
                        RBT = RBT + "</select>";
                    }
                    else {
                        RBT = "<select class='form-control selectpicker customdrpdwn' id='RBT" + parseInt(i + 1) + "'><option value='Select'>Select</option><option value='Low'>Low</option><option value='High'>High</option><option value='Medium'>Medium</option></select>"
                    }

                    if (a.indexOf(existing[i].Type) > -1) {
                        Type = "<select class='form-control selectpicker customdrpdwn' id='TypeOfCase" + parseInt(i + 1) + "'><option value='Select'>Select</option>"
                        if (existing[i].Type == "+ve") {
                            Type = Type + "<option value='+ve' selected='selected'>+ve</option><option value='-ve'>-ve</option>";
                        }
                        else if (existing[i].Type == "-ve") {
                            Type = Type + "<option value='+ve'>+ve</option><option value='-ve' selected='selected'>-ve</option>";
                        }
                        Type = Type + "</select>";
                    }
                    else {
                        Type = "<select class='form-control selectpicker customdrpdwn' id='TypeOfCase" + parseInt(i + 1) + "'><option value='Select'> Select</option><option value='+ve'> +ve</option><option value='-ve'>-ve</option></select>";
                    }
                    var url = getURL();
                    $.ajax({
                        url: url + '/TestProject/FetchReq/' + projectdetails.projectid + '/' + projectdetails.moduleid + '/' + projectdetails.modulename + '/' + null,
                        type: "GET",
                        success: function (data) {
                            val = "<select class='form-control selectpicker customdrpdwn' id='Req" + parseInt(i + 1) + "'><option value='Select'>Select</option>";
                            if (data) {
                                for (var k = 0; k < data.length; k++) {

                                    if (existing[i].Req == data[k].reqid) {
                                        val = val + "<option params='" + JSON.stringify(data[k]) + "' value='" + data[k].reqid + "'selected = 'selected'>" + data[k].reqname + "</option>";
                                    }
                                    else {
                                        val = val + "<option params='" + JSON.stringify(data[k]) + "' value='" + data[k].reqid + "'>" + data[k].reqname + "</option>";
                                    }
                                }
                            }
                            val = val + "</select>"
                        },
                        error: function (Response) {
                            alert("Failed!");
                        },
                        async: false
                    });

                    ds.push({ "chk": " <label><input type='checkbox' id='test" + parseInt(i + 1) + "' tcase='" + JSON.stringify(masterArray[i]) + "' style='float:left;' class='radio' name='optcheckbox'/><label for='test" + parseInt(i + 1) + "'></label></label>", "Scenario": "<label class='lblCase' tcase='" + JSON.stringify(masterArray[i]) + "' onclick='validate(this)'># " + parseInt(i + 1) + "</label>", "Req": val + "<br /><button onclick='getreqDetails(\"" + projectdetails.projectid + "\"," + "\"" + projectdetails.moduleid + "\"," + "\"" + projectdetails.modulename + "\"," + "\"" + parseInt(i + 1) + "\"" + ")'>Details</button>", "Priority": RBT, "Type": Type });

                    $('#lblCompileSuccess').show();
                    $('#lblCompileSuccess').html("Compile Successful - " + parseInt(i + 1) + " Test Scenarios Generated !");
                });
            }
        }
        if (ds.length == 0) {
            $.each(masterArray, function (i, item) {
                ds.push({
                    "chk": " <label><input type='checkbox' id='test" + parseInt(i + 1) + "' tcase='" + JSON.stringify(masterArray[i]) + "' style='float:left;' class='radio' name='optcheckbox'/><label for='test" + parseInt(i + 1) + "'></label></label>", "Scenario": "<label class='lblCase' tcase='" + JSON.stringify(masterArray[i]) + "' onclick='validate(this)'># " + parseInt(i + 1) + "</label>", "Req": "<select class='form-control selectpicker customdrpdwn' id='Req" + parseInt(i + 1) + "'><option value='-1'>Select</option>" + val + "</select>" + "<br /><button onclick='getreqDetails(\"" + projectdetails.projectid + "\"," + "\"" + projectdetails.moduleid + "\"," + "\"" + projectdetails.modulename + "\"," + "\"" + parseInt(i + 1) + "\"" + ")'>Details</button>", "Priority": "<select class='form-control selectpicker customdrpdwn' id='RBT" + parseInt(i + 1) + "'><option value='Select'>Select</option><option value='Low'>Low</option><option value='High'>High</option><option value='Medium'>Medium</option></select>", "Type": "<select class='form-control selectpicker customdrpdwn' id='TypeOfCase" + parseInt(i + 1) + "'><option value='Select'> Select</option><option value='+ve'> +ve</option><option value='-ve'>-ve</option></select>"
                });
                $('#lblCompileSuccess').show();
                $('#lblCompileSuccess').html("Compile Successful - " + parseInt(i + 1) + " Test Scenarios Generated !");
            });
        }

        if ($.fn.DataTable.isDataTable('#tblTestScen')) {
            $('#tblTestScen').DataTable().destroy();
        }

        $('#tblTestScen tbody').empty();
        $('#content-scroll').remove();

        $('#tblTestScen').DataTable({
            data: ds,
            "ordering": false,
            "paginate": true,
            "filter": false,
            "info": false,
            "bPaginate": false,
            "bAutoWidth": false,
            "columns": [
                { "data": "chk" },
                { "data": "Scenario" },
                { "data": "Req" },
                { "data": "Priority" },
                { "data": "Type" }
            ],
            rowId: "rowId"

        });


        $('#tblTestScen tbody').attr("id", "content-scroll");
        $('#content-scroll').mCustomScrollbar({
            theme: 'dark-3',
            axis: "yx",
            scrollbarPosition: "outside",
            autoDraggerLength: true

        });
        var var_url = window.location.href;
        var btn = document.createElement("input");
        var btn2 = document.createElement("input");
        var btn3 = document.createElement("button");
        var lbl = document.createElement("label");
        var lbl2 = document.createElement("label");
        btn.setAttribute("id", "GenerateExcel4Selected");
        btn.setAttribute("type", "image");
        btn.setAttribute("src", "../Content/Images/ExcelBW@3x.png");
        btn.setAttribute("title", "Generate Excel for selected cases");
        btn3.setAttribute("class", "btn btn-default savebtn");
        btn3.setAttribute("id", "saveRBTType");
        btn3.setAttribute("onclick", "fnSaveRBTType()");
        $(btn3).html("Save Table");
        $(lbl).html("Export");
        $(lbl2).html("Save");

        btn.setAttribute("disabled", "disabled");
        btn.setAttribute("onclick", "fnGenerateExcel4Selected()");
        btn2.setAttribute("id", "ExportToPDF");
        btn2.setAttribute("type", "image");
        btn2.setAttribute("src", "../Content/Images/PDF@3x.png");
        btn2.setAttribute("title", "Export Flow Diagram to PDF");

        $(btn2).css("cursor", "pointer");
        btn2.setAttribute("onclick", "fnExportToPDF()");


        var tableRef = document.getElementById('controlsExport');

        var newRowheader = tableRef.insertRow(tableRef.rows.length);
        newRowheader.setAttribute("id", "rowHeader");

        // Insert a cell in the row at index 0
        var newCellheader = newRowheader.insertCell(0);
        var newCellheader2 = newRowheader.insertCell(1);

        newCellheader.setAttribute("colspan", "2")

        // Append a text node to the cell

        newCellheader.appendChild(lbl);
        newCellheader2.appendChild(lbl2);

        // Insert a row in the table at the last row
        var newRow = tableRef.insertRow(tableRef.rows.length);
        newRow.setAttribute("id", "rowControls");

        // Insert a cell in the row at index 0
        var newCell = newRow.insertCell(0);

        var newCell2 = newRow.insertCell(1);
        var newCell3 = newRow.insertCell(2);

        // Append a text node to the cell

        newCell.appendChild(btn);
        newCell2.appendChild(btn2);
        newCell3.appendChild(btn3);

        $('#rightCheckBoxBar').show();
    }
}




//Highlighting the flow when a test scenario label is clicked
function validate(obj) {
    var $box = $(obj);

    $('.lblCase').removeClass("selectedcase");
    $(obj).addClass("selectedcase");
    $('.node').removeClass("nodeselected");
    $('._jsPlumb_overlay').removeClass("_jsPlumb_overlay_selected");

    var arr = $box.attr("tcase");
    var json = JSON.parse(arr);
    for (i = 0; i < json.length; i++) {
        var node = "#" + json[i].pageSourceId;
        var overlay = json[i].overlay;
        if (json[i].pageSourceId != "startpoint")
            $(node).addClass("nodeselected");

        if (overlay) {
            var overlays = document.getElementsByClassName("_jsPlumb_overlay");
            for (j = 0; j < overlays.length; j++) {
                if ($(overlays[j]).html() == overlay && $(overlays[j]).attr("source") == json[i].pageSourceId && $(overlays[j]).attr("target") == json[i].pageTargetId) {
                    $(overlays[j]).addClass("_jsPlumb_overlay_selected");
                }
            }
        }
    }
}


//loads the flowchart from the JSON passed to flowChart variable
function loadFlowchart(json) {


    var flowChartJson = '{\"nodes\":[{\"blockId\":\"startpoint\",\"nodetype\":\"startpoint\",\"positionX\":419,\"positionY\":50,\"DisplayText\":\"\"},{\"blockId\":\"endpoint\",\"nodetype\":\"endpoint\",\"positionX\":425,\"positionY\":1259,\"DisplayText\":\"\"},{\"blockId\":\"taskcontainer1\",\"nodetype\":\"task\",\"positionX\":357,\"positionY\":134,\"DisplayText\":\"Login to book flights\"},{\"blockId\":\"taskcontainer2\",\"nodetype\":\"task\",\"positionX\":357,\"positionY\":241,\"DisplayText\":\"Select Flights\"},{\"blockId\":\"taskcontainer3\",\"nodetype\":\"task\",\"positionX\":356,\"positionY\":356,\"DisplayText\":\"Choose flight type\"},{\"blockId\":\"decisioncontainer5\",\"nodetype\":\"decision\",\"positionX\":394,\"positionY\":494,\"DisplayText\":\"Flight Type\"},{\"blockId\":\"taskcontainer6\",\"nodetype\":\"task\",\"positionX\":133,\"positionY\":504,\"DisplayText\":\"Domestic\"},{\"blockId\":\"taskcontainer7\",\"nodetype\":\"task\",\"positionX\":622,\"positionY\":496,\"DisplayText\":\"International\"},{\"blockId\":\"taskcontainer8\",\"nodetype\":\"task\",\"positionX\":359,\"positionY\":640,\"DisplayText\":\"Select Trip type\"},{\"blockId\":\"decisioncontainer9\",\"nodetype\":\"decision\",\"positionX\":394,\"positionY\":700,\"DisplayText\":\"Trip type\"},{\"blockId\":\"taskcontainer10\",\"nodetype\":\"task\",\"positionX\":145,\"positionY\":791,\"DisplayText\":\"One Way\"},{\"blockId\":\"taskcontainer11\",\"nodetype\":\"task\",\"positionX\":590,\"positionY\":791,\"DisplayText\":\"Round trip\"},{\"blockId\":\"taskcontainer12\",\"nodetype\":\"task\",\"positionX\":147,\"positionY\":910,\"DisplayText\":\"Select Departure date & City\"},{\"blockId\":\"taskcontainer13\",\"nodetype\":\"task\",\"positionX\":147,\"positionY\":1023,\"DisplayText\":\"Select Destination City\"},{\"blockId\":\"taskcontainer14\",\"nodetype\":\"task\",\"positionX\":589,\"positionY\":1103,\"DisplayText\":\"Select Return date\"},{\"blockId\":\"taskcontainer15\",\"nodetype\":\"task\",\"positionX\":590,\"positionY\":1001,\"DisplayText\":\"Select Destination City\"},{\"blockId\":\"taskcontainer16\",\"nodetype\":\"task\",\"positionX\":591,\"positionY\":894,\"DisplayText\":\"Select Departure date & City\"}],\"connections\":[{\"pageSourceId\":\"startpoint\",\"pageTargetId\":\"taskcontainer1\",\"overlay\":\"\"},{\"pageSourceId\":\"taskcontainer1\",\"pageTargetId\":\"taskcontainer2\",\"overlay\":\"\"},{\"pageSourceId\":\"taskcontainer2\",\"pageTargetId\":\"taskcontainer3\",\"overlay\":\"\"},{\"pageSourceId\":\"taskcontainer3\",\"pageTargetId\":\"decisioncontainer5\",\"overlay\":\"\"},{\"pageSourceId\":\"decisioncontainer5\",\"pageTargetId\":\"taskcontainer6\",\"overlay\":\"positive\"},{\"pageSourceId\":\"decisioncontainer5\",\"pageTargetId\":\"taskcontainer7\",\"overlay\":\"something else\"},{\"connectionId\":\"con_83\",\"pageSourceId\":\"taskcontainer6\",\"pageTargetId\":\"taskcontainer8\",\"overlay\":\"\"},{\"pageSourceId\":\"taskcontainer7\",\"pageTargetId\":\"taskcontainer8\",\"overlay\":\"\"},{\"pageSourceId\":\"taskcontainer8\",\"pageTargetId\":\"decisioncontainer9\",\"overlay\":\"\"},{\"pageSourceId\":\"decisioncontainer9\",\"pageTargetId\":\"taskcontainer10\",\"overlay\":\"negative\"},{\"pageSourceId\":\"decisioncontainer9\",\"pageTargetId\":\"taskcontainer11\",\"overlay\":\"last one\"},{\"pageSourceId\":\"taskcontainer10\",\"pageTargetId\":\"taskcontainer12\",\"overlay\":\"\"},{\"pageSourceId\":\"taskcontainer12\",\"pageTargetId\":\"taskcontainer13\",\"overlay\":\"\"},{\"pageSourceId\":\"taskcontainer13\",\"pageTargetId\":\"endpoint\",\"overlay\":\"\"},{\"pageSourceId\":\"taskcontainer11\",\"pageTargetId\":\"taskcontainer16\",\"overlay\":\"\"},{\"pageSourceId\":\"taskcontainer16\",\"pageTargetId\":\"taskcontainer15\",\"overlay\":\"\"},{\"pageSourceId\":\"taskcontainer15\",\"pageTargetId\":\"taskcontainer14\",\"overlay\":\"\"},{\"pageSourceId\":\"taskcontainer14\",\"pageTargetId\":\"endpoint\",\"overlay\":\"\"}],\"numberOfElements\":16}'

    var flowChart = JSON.parse(flowChartJson);

    if (json != null) {
        resetDrawingArea();
        flowChart = json;
    }

    var nodes = flowChart.nodes;
    var disptext;
var url = getURL();
    $.each(nodes, function (index, elem) {
        if (elem != null) {
            disptext = elem.DisplayText;
            if (elem.nodetype === 'startpoint' && elem.blockId != "startpoint1" && elem.blockId != "startpoint2") {
                repositionElement('startpoint', elem.positionX, elem.positionY);
            } else if (elem.nodetype === 'endpoint' && elem.blockId != "endpoint1" && elem.blockId != "endpoint2") {
                repositionElement('endpoint', elem.positionX, elem.positionY);
            } else if (elem.nodetype === 'task') {
                var id = addTask(elem.blockId, elem.DisplayText);
                repositionElement(id, elem.positionX, elem.positionY);
            } else if (elem.nodetype === 'decision') {
                var id = addDecision(elem.blockId, elem.DisplayText, true);
                repositionElement(id, elem.positionX, elem.positionY);
            } else {

            }

            
            if (disptext && disptext.length > 0) {
                disptext = disptext.replace(/&/g, "").replace(/\*/g, "").replace(/\./g, "").replace(/\:/g, "").replace(/\+/g, "").replace(/\//g, "").replace(/\=/g, "").replace(/\>/g, "").replace(/\</g, "").replace(/\?/g, "").replace(/,/g, "");

                var MyText = {
                    "disptext": disptext
                };

                $.ajax({
                    url: url + '/TestProject/fetchAutoScripts/',
                    type: "POST",
                    data: MyText,
                    async: false,
                    success: function (data) {
                        if (data) {
                            $("#" + id + " .gear").show();
                            var key = "";
                            var jscript = "";
                            var pscript = "";
                            var csscript = "";
                            var vbscript = "";
                            for (var i = 0; i < data.length; i++) {
                                if (i == 0) {
                                    $("#" + id + " .gear").attr("selectedVal", data[i].scriptId);
                                    $("#" + id + " .gear").attr("selectedJ", data[i].javaScript);
                                    $("#" + id + " .gear").attr("selectedP", data[i].pythonScript); //.replace(/&squot;/g, "\'"));
                                    $("#" + id + " .gear").attr("selectedCs", data[i].CsharpScript);//.replace(/&squot;/g, "\'"));
                                    $("#" + id + " .gear").attr("selectedVb", data[i].VbScript);
                                    //$("#" + id + " .gear").attr("selectedP", "Hi");
                                }
                                if (data[i].scriptId != "" /*&& data[i].javaScript != ""*/ /*&& data[i].pythonScript != ""*/) {
                                    key += data[i].scriptId + "|";
                                    jscript += data[i].javaScript + "|";
                                    pscript += data[i].pythonScript/*.replace(/&squot;/g, "\'")*/ + "|";
                                    csscript += data[i].CsharpScript/*.replace(/&squot;/g, "\'")*/ + "|";
                                    vbscript += data[i].VbScript + "|";
                                    //pscript += "&#8217;My quote!&#8217;" + '|';
                                }
                            }
                            $("#" + id + " .gear").attr("keyword", key);
                            $("#" + id + " .gear").attr("jscript", jscript);
                            $("#" + id + " .gear").attr("pscript", pscript);
                            $("#" + id + " .gear").attr("csscript", csscript);
                            $("#" + id + " .gear").attr("vbscript", vbscript);
                        }
                    },
                    error: function (Response) {
                        alert("Failed!");
                    },
                    async: true

                });
            }
        }

    });


    var connections = flowChart.connections;
    var collPageSource = [];
    if (connections.length > 0) {
        $.each(connections, function (index, elem) {

            var SourceUuid = [];
            var TargetUuid = [];

            if (elem.pageSourceId.indexOf("decision") > -1)
                collPageSource.push(elem.pageSourceId);

            jsPlumb.selectEndpoints({
                element: elem.pageSourceId
            }).each(function (endpoint) {
                SourceUuid.push(endpoint.getUuid());
            });

            jsPlumb.selectEndpoints({
                element: elem.pageTargetId
            }).each(function (endpoint) {
                TargetUuid.push(endpoint.getUuid());
            });

            if (elem.pageTargetId == "endpoint") {
                var connection1 = jsPlumb.connect({
                    source: elem.pageSourceId,
                    target: elem.pageTargetId,
                    uuids: [SourceUuid[0], TargetUuid[0]],
                    overlays: [
                        ["Label", { label: elem.overlay, id: elem.overlay, source: elem.pageSourceId, target: elem.pageTargetId }]
                    ]
                });
            }
            else if (elem.pageSourceId.indexOf("decision") == 0 && elem.pageTargetId.indexOf("decision") == 0) {
                var connection1 = jsPlumb.connect({
                    source: elem.pageSourceId,
                    target: elem.pageTargetId,
                    uuids: [SourceUuid[0], TargetUuid[2]],
                    overlays: [
                        ["Label", { label: elem.overlay, id: elem.overlay, source: elem.pageSourceId, target: elem.pageTargetId }]
                    ]
                });
            }
            else if (elem.pageSourceId.indexOf("decision") == 0) {
                var connection1 = jsPlumb.connect({
                    source: elem.pageSourceId,
                    target: elem.pageTargetId,
                    uuids: [SourceUuid[0], TargetUuid[1]],
                    overlays: [
                        ["Label", { label: elem.overlay, id: elem.overlay, source: elem.pageSourceId, target: elem.pageTargetId }]
                    ]
                    //overlays: [
                    //    ["Custom", {
                    //        create: function (component) {
                    //            return $("<label id='" + elem.overlay + "' source = '" + elem.pageSourceId + "' target = '" + elem.pageTargetId+"'>"  + elem.overlay + "</label>");
                    //        },
                    //        id: elem.overlay
                    //    }]]
                });
            }
            else if (elem.pageTargetId.indexOf("decision") < 0) {
                var connection1 = jsPlumb.connect({
                    source: elem.pageSourceId,
                    target: elem.pageTargetId,
                    //anchors: ["BottomCenter", "TopCenter"]
                    uuids: [SourceUuid[0], TargetUuid[1]]
                });
            }
            else {
                var connection1 = jsPlumb.connect({
                    source: elem.pageSourceId,
                    target: elem.pageTargetId,
                    //anchors: ["BottomCenter", "TopCenter"]
                    uuids: [SourceUuid[0], TargetUuid[TargetUuid.length - 1]]
                });
            }
        });
    }

    var occurrences = {};
    for (var i = 0, j = collPageSource.length; i < j; i++) {
        occurrences[collPageSource[i]] = (occurrences[collPageSource[i]] || 0) + 1;
    }

    if (collPageSource.length == 0) {
        $("#addResultnData").hide();
        $("#addCreateRules").hide();
    }

    var dec = document.getElementsByClassName("decision");
    for (var i = 0; i < dec.length; i++) {
        if (dec[i] && dec[i] != "") {
            var no = occurrences[$(dec[i]).attr("id")];
            $("#" + $(dec[i]).attr("id") + " .noOfConn").css("visibility", "visible");
            if (no)
                $("#" + $(dec[i]).attr("id") + " .noOfConn").html("Conn:" + no);
            else
                $("#" + $(dec[i]).attr("id") + " .noOfConn").html("Conn:0");
        }
    }

    numberOfElements = flowChart.numberOfElements;
    var a = $('.endpoint').offset().top - $('#startpoint').offset().top + 100;
    $("#drawingArea").height(a);
    $(".flochartinfo").height(a);
}

function repositionElement(id, posX, posY) {
    $('#' + id).css('left', posX);
    $('#' + id).css('top', posY);
    jsPlumb.repaint(id);
}

////keeps increasing size of the divs when window is scrolled
$(window).scroll(function () {
    var a = $('.endpoint').offset().top - $('#startpoint').offset().top + 150;
    $("#drawingArea").height(a);
    $(".flochartinfo").height(a);
    var a = $('.endpoint1').offset().top - $('#startpoint1').offset().top + 150;
    $("#regdrawingArea").height(a);
    var a = $('.endpoint2').offset().top - $('#startpoint2').offset().top + 150;
    $("#regdrawingArea2").height(a);
});

function drawingAreaReady(obj, createdBy) {
    //debugger;
    $(".zoombuttons").show();
    $("#drawingArea").show();
    $("#drawingArea").css("visibility", "visible");
$("#Import").show();
    $(".pull-left div").show();
    $(".pull-left div").css("display", "inline");
    $(".pull-right").show();
    $("#divRegAnalysis").hide();
    $('#tblTestScen').hide();
    $('#tblRegAn').hide();
    removeCheckBox();


    var objData = $(obj).attr("data") !== undefined && $(obj).attr("data") !== null ? JSON.parse($(obj).attr("data")) : null;

    if (objData !== undefined && objData !== null) {
        FlowChartDetails =
            {
                projectid: objData.projectid,
                projectname: objData.projectname,
                projectversion: objData.projectversion,
                moduleid: objData.moduleid,
                modulename: objData.modulename,
                moduleversion: objData.moduleversion,
                modelflowid: objData.modelflowid,
                modelflowname: objData.modelflowname,
                modelflowversion: objData.modelflowversion
            }
        console.log(FlowChartDetails);

    }
    window.scrollTo(0, 0);
    $('#btnOpenFloat').hide();
    $('#btnCloseFloat').hide();
    $('.flowElement').removeClass("activeElement");
    $(obj).addClass("activeElement");

    if ($.fn.DataTable != null) {
        if ($.fn.DataTable.isDataTable('#TestDataTable')) {
            table.destroy();
        }
    }

    if ($.fn.DataTable != null) {
        if ($.fn.DataTable.isDataTable('#TestDataTablenew')) {
            table.destroy();
        }
    }

    if ($(obj).parent().parent() && $(obj).parent().parent()[0].children.length > 1 && !$($(obj).parent().parent()[0]).hasClass("childhidden")) {
        $('#regAnalysisButton').show();
    }
    else {
        $('#regAnalysisButton').hide();
    }

    if ($(obj).attr("tcase") != null) {
        var JSONflow = JSON.parse($(obj).attr("tcase"));
        loadFlowchart(JSONflow);
        getSharedWith(JSON.parse($(obj).attr('data')).projectid, createdBy);
        $(".btnsFloat").show();
        $('.btnsFloat').css("left", "330");

        if (JSONflow.numberOfElements == "0") {
            $('#generateTCasesButton').hide();
            $('#addResultnData').hide();
            $('#addCreateRules').hide();
            $('#saveNUpdateButton').show();
            $('#saveButton').show();
        }
        else {
            $('#generateTCasesButton').show();
            $('#saveNUpdateButton').hide();
            $('#saveButton').hide();
        }
        $(".divElement").remove();
        $("#GenerateExcel4Selected").remove();
        $("#rowControls").remove();
        $("#ExportToPDF").remove();
        $("#rowHeader").remove();
        $('#lblCompileSuccess').hide();
        if ($(".activeElement").attr("tcase") != null) {
            var tcase = JSON.parse($(".activeElement").attr("tcase"));
            //if (tcase.nodes.length == 2) {
            //    $('#Import').show();
            //}
            //else {
            //    $('#Import').hide();
            //}
        }
    }

}



function resetDrawingArea() {
    jsPlumb.reset();
    var workflowConnectorStartpoint = {
        isSource: true,
        isTarget: false,
        maxConnections: 1,
        anchor: "BottomCenter"
    };

    var workflowConnectorEndpoint = {
        isSource: false,
        isTarget: true,
        maxConnections: -1,
        anchor: "TopCenter",
        paintStyle: { fillStyle: 'red' },
        endpoint: ["Rectangle", { width: 12, height: 12 }],
        uuid: "endpoint"
    };

    jsPlumb.addEndpoint(
        $('.startpoint'),
        workflowConnectorStartpoint
    );

    jsPlumb.addEndpoint(
        $('.endpoint'),
        workflowConnectorEndpoint
    );

    $('.task').each(function (i, obj) {
        if ($(obj).attr("id") != "taskcontainer0")
            $(obj).remove();
    });

    $('.decision').each(function (i, obj) {
        if ($(obj).attr("id") != "decisioncontainer0")
            $(obj).remove();
    });
}



function changeOverlay(e, obj) {
    //alert();

    if (obj != null) {
        var connection = jsPlumb.getConnections({
            source: $(obj).attr("source"),
            target: $(obj).attr("target")
        });
        if (connection.length > 0) {
            for (var i = 0; i < connection.length; i++) {
                var lblOverlays = connection[i].getOverlays();
                var label = '';
                $.each(lblOverlays, function (idx, overlay) {
                    if (overlay.type == "Label" && overlay.canvas.id == obj.id) {
                        label = overlay.setLabel($.trim($(obj).html().replace(/&nbsp;/g, "")));
                    }
                });
            }
        }
    }
}

function onEditOverlay(e, obj) {
    if ($($(obj).offsetParent()).attr("id") != "divRegAnalysis") {
        $('#generateTCasesButton').hide();
        $('#addResultnData').hide();
        $('#addCreateRules').hide();
        $('#saveNUpdateButton').show();
        $('#saveButton').show();
    }
}


//function for regression analasys feature
function prepRegAnalysScreen() {
    $(".zoombuttons").hide();
    var modelflowname = $(".activeElement").attr("name");
    var parentUL = $(".activeElement").parent().parent()[0].children;
    var activeTcase = $(".activeElement").attr("tcase");
    var array1;
    var array2;

    var activeData = JSON.parse($(".activeElement").attr("data"));

    if (activeData.parentFlowid != null) {
        var data = JSON.parse($("#" + activeData.parentFlowid).attr("data"));
        if (modelflowname == $("#" + activeData.parentFlowid).attr("name") && $("#" + activeData.parentFlowid).attr("class").indexOf("activeElement") == -1) {
            //$('#floatbtns').hide();
            $("#drawingArea").hide();

            $("#divRegAnalysis").show();
            $("#divRegAnalysis").css("visibility", "visible");
            $('.btnOpen').click();
            htmlBase = 'regdrawingArea2';
            $('#regdrawingArea2').addClass("in active");
            prepLeftFlow(activeTcase);
            connections = JSON.parse(activeTcase).connections;
            fnTestCases();
            array1 = masterArray;
            masterArray = [[]];
            var tcase = $("#" + activeData.parentFlowid).attr("tcase");
            $('#tab2').html("Version " + activeData.modelflowversion);
            htmlBase = 'regdrawingArea';
            $('#regdrawingArea2').removeClass("in active");
            $('#regdrawingArea').addClass("in active");
            prepRightFlow(tcase);
            connections = JSON.parse(tcase).connections;
            fnTestCases();
            array2 = masterArray;
            masterArray = [[]];
            $('#regdrawingArea').removeClass("in active");
            $('#regdrawingArea2').addClass("in active");
            $('#tab1').html("Version " + data.modelflowversion);
            $('#tab1').parent().removeClass("active");
            $('#tab2').parent().addClass("active");
            compareTestCases(array1, array2);
            $('#addResultnData').show();
            $('#addCreateRules').show();
        }
    }
    if (activeData.parentFlowid == null) {
        $('#regdrawingArea2').removeClass("in active");
        $('#regdrawingArea').addClass("in active");
        $('#regdrawingArea').removeClass("in active");
        $('#regdrawingArea2').addClass("in active");
        $('#addResultnData').hide();
        $('#addCreateRules').hide();
        alert("No lower version of the selected flow seem to exist!");
    }

}


function prepLeftFlow(activeTcase) {
    jsPlumb.reset();
    var workflowConnectorStartpoint = {
        isSource: true,
        isTarget: false,
        maxConnections: 1,
        anchor: "BottomCenter"
    };

    var workflowConnectorEndpoint = {
        isSource: false,
        isTarget: true,
        maxConnections: -1,
        anchor: "TopCenter",
        paintStyle: { fillStyle: 'red' },
        endpoint: ["Rectangle", { width: 12, height: 12 }],
        uuid: "endpoint"
    };

    jsPlumb.addEndpoint(
        $('.startpoint2'),
        workflowConnectorStartpoint
    );

    jsPlumb.addEndpoint(
        $('.endpoint2'),
        workflowConnectorEndpoint
    );

    $('.task').each(function (i, obj) {
        if ($(obj).attr("id") != "taskcontainer0")
            $(obj).remove();
    });

    $('.decision').each(function (i, obj) {
        if ($(obj).attr("id") != "decisioncontainer0")
            $(obj).remove();
    });

    $('#regdrawingArea2 ._jsPlumb_connector').each(function (i, obj) {
        $(obj).remove();
    });

    loadregFlowchart(JSON.parse(activeTcase));

}

function prepRightFlow(tcase) {

    var workflowConnectorStartpoint = {
        isSource: true,
        isTarget: false,
        maxConnections: 1,
        anchor: "BottomCenter"
    };

    var workflowConnectorEndpoint = {
        isSource: false,
        isTarget: true,
        maxConnections: -1,
        anchor: "TopCenter",
        paintStyle: { fillStyle: 'red' },
        endpoint: ["Rectangle", { width: 12, height: 12 }],
        uuid: "endpoint"
    };
    jsPlumb.addEndpoint(
        $('.startpoint1'),
        workflowConnectorStartpoint
    );

    jsPlumb.addEndpoint(
        $('.endpoint1'),
        workflowConnectorEndpoint
    );
    $('#regdrawingArea ._jsPlumb_connector').each(function (i, obj) {
        $(obj).remove();
    });

    loadreg2Flowchart(JSON.parse(tcase));
}

function loadregFlowchart(json) {
    var flowChart = json;
    var nodes = flowChart.nodes;
    $.each(nodes, function (index, elem) {
        if (elem.nodetype === 'startpoint' && elem.blockId != "startpoint1" && elem.blockId != "startpoint2") {
            repositionElement('startpoint2', parseInt(elem.positionX), parseInt(elem.positionY) + 10);
        } else if (elem.nodetype === 'endpoint' && elem.blockId != "endpoint1" && elem.blockId != "endpoint2") {
            repositionElement('endpoint2', parseInt(elem.positionX), elem.positionY);
        } else if (elem.nodetype === 'task') {
            var id = addTask(elem.blockId, elem.DisplayText, null);
            repositionElement(id, elem.positionX, elem.positionY);
        } else if (elem.nodetype === 'decision') {
            var id = addDecision(elem.blockId, elem.DisplayText, true);
            repositionElement(id, elem.positionX, parseInt(elem.positionY));
        } else {

        }
    });

    var connections = flowChart.connections;
    var collPageSource = [];
    if (connections.length > 0) {
        $.each(connections, function (index, elem) {

            if (elem.pageSourceId.indexOf("decision") > -1)
                collPageSource.push(elem.pageSourceId);

            var SourceUuid = [];
            var TargetUuid = [];
            jsPlumb.selectEndpoints({
                element: elem.pageSourceId
            }).each(function (endpoint) {
                SourceUuid.push(endpoint.getUuid());
            });

            if (elem.pageTargetId == "endpoint") {
                jsPlumb.selectEndpoints({
                    element: "endpoint2"
                }).each(function (endpoint) {
                    TargetUuid.push(endpoint.getUuid());
                });
            }
            else {
                jsPlumb.selectEndpoints({
                    element: elem.pageTargetId
                }).each(function (endpoint) {
                    TargetUuid.push(endpoint.getUuid());
                });

            }

            if (elem.pageTargetId == "endpoint") {
                var connection1 = jsPlumb.connect({
                    source: elem.pageSourceId,
                    target: elem.pageTargetId + "2",
                    uuids: [SourceUuid[0], TargetUuid[0]],
                    overlays: [
                        ["Label", { label: elem.overlay, id: elem.overlay, source: elem.pageSourceId, target: elem.pageTargetId }]
                    ]
                });
            }
            else if (elem.pageSourceId.indexOf("decision") == 0 && elem.pageTargetId.indexOf("decision") == 0) {
                var connection1 = jsPlumb.connect({
                    source: elem.pageSourceId,
                    target: elem.pageTargetId,
                    uuids: [SourceUuid[0], TargetUuid[2]],
                    overlays: [
                        ["Label", { label: elem.overlay, id: elem.overlay, source: elem.pageSourceId, target: elem.pageTargetId }]
                    ]
                });
            }
            else if (elem.pageSourceId.indexOf("decision") == 0) {
                var connection1 = jsPlumb.connect({
                    source: elem.pageSourceId,
                    target: elem.pageTargetId,
                    uuids: [SourceUuid[0], TargetUuid[1]],
                    overlays: [
                        ["Label", { label: elem.overlay, id: elem.overlay, source: elem.pageSourceId, target: elem.pageTargetId }]
                    ]
                });
            }
            else if (elem.pageTargetId.indexOf("decision") < 0) {
                if (elem.pageSourceId == "startpoint") {
                    var connection1 = jsPlumb.connect({
                        source: elem.pageSourceId + "2",
                        target: elem.pageTargetId,
                        uuids: [SourceUuid[0], TargetUuid[1]]
                    });
                }
                else {
                    var connection1 = jsPlumb.connect({
                        source: elem.pageSourceId,
                        target: elem.pageTargetId,
                        uuids: [SourceUuid[0], TargetUuid[1]]
                    });
                }
            }
            else {
                var connection1 = jsPlumb.connect({
                    source: elem.pageSourceId,
                    target: elem.pageTargetId,
                    uuids: [SourceUuid[0], TargetUuid[TargetUuid.length - 1]]
                });
            }
        });
    }

    var occurrences = {};
    for (var i = 0, j = collPageSource.length; i < j; i++) {
        occurrences[collPageSource[i]] = (occurrences[collPageSource[i]] || 0) + 1;
    }

    var dec = document.getElementsByClassName("decision");
    for (var i = 0; i < dec.length; i++) {
        if (dec[i] && dec[i] != "") {
            $("#" + $(dec[i]).attr("id") + " .noOfConn").css("visibility", "hidden");
        }
    }

    numberOfElements = flowChart.numberOfElements;
    var a = $('.endpoint2').offset().top - $('#startpoint2').offset().top + 100;
    $("#regdrawingArea2").height(a);
    htmlBase = 'drawingArea';
}




function loadreg2Flowchart(json) {
    var flowChart = json;
    var nodes = flowChart.nodes;
    $.each(nodes, function (index, elem) {
        if (elem.nodetype === 'startpoint' && elem.blockId != "startpoint1" && elem.blockId != "startpoint2") {
            repositionElement('startpoint1', parseInt(elem.positionX), parseInt(elem.positionY) + 10)
        } else if (elem.nodetype === 'endpoint' && elem.blockId != "endpoint1" && elem.blockId != "endpoint2") {
            repositionElement('endpoint1', parseInt(elem.positionX), elem.positionY);
        } else if (elem.nodetype === 'task') {
            var id = addTask(elem.blockId + "_l", elem.DisplayText, null);
            repositionElement(id, elem.positionX, elem.positionY);
        } else if (elem.nodetype === 'decision') {
            var id = addDecision(elem.blockId + "_l", elem.DisplayText, true);
            repositionElement(id, elem.positionX, parseInt(elem.positionY));
        } else {

        }
    });

    var connections = flowChart.connections;
    var collPageSource = [];
    if (connections.length > 0) {
        $.each(connections, function (index, elem) {

            if (elem.pageSourceId.indexOf("decision") > -1)
                collPageSource.push(elem.pageSourceId + "_l");

            var SourceUuid = [];
            var TargetUuid = [];
            jsPlumb.selectEndpoints({
                element: elem.pageSourceId + "_l"
            }).each(function (endpoint) {
                SourceUuid.push(endpoint.getUuid());
            });

            if (elem.pageTargetId == "endpoint") {
                jsPlumb.selectEndpoints({
                    element: "endpoint1"
                }).each(function (endpoint) {
                    TargetUuid.push(endpoint.getUuid());
                });
            }
            else {
                jsPlumb.selectEndpoints({
                    element: elem.pageTargetId + "_l"
                }).each(function (endpoint) {
                    TargetUuid.push(endpoint.getUuid());
                });
            }


            if (elem.pageTargetId == "endpoint") {
                var connection1 = jsPlumb.connect({
                    source: elem.pageSourceId + "_l",
                    target: elem.pageTargetId + "1",
                    uuids: [SourceUuid[0], TargetUuid[0]],
                    overlays: [
                        ["Label", { label: elem.overlay, id: elem.overlay, source: elem.pageSourceId, target: elem.pageTargetId }]
                    ]
                });
            }
            else if (elem.pageSourceId.indexOf("decision") == 0 && elem.pageTargetId.indexOf("decision") == 0) {
                var connection1 = jsPlumb.connect({
                    source: elem.pageSourceId + "_l",
                    target: elem.pageTargetId + "_l",
                    uuids: [SourceUuid[0], TargetUuid[2]],
                    overlays: [
                        ["Label", { label: elem.overlay, id: elem.overlay, source: elem.pageSourceId + "_l", target: elem.pageTargetId + "_l" }]
                    ]
                });
            }
            else if (elem.pageSourceId.indexOf("decision") == 0) {
                var connection1 = jsPlumb.connect({
                    source: elem.pageSourceId + "_l",
                    target: elem.pageTargetId + "_l",
                    uuids: [SourceUuid[0], TargetUuid[1]],
                    overlays: [
                        ["Label", { label: elem.overlay, id: elem.overlay, source: elem.pageSourceId + "_l", target: elem.pageTargetId + "_l" }]
                    ]
                });
            }
            else if (elem.pageTargetId.indexOf("decision") < 0) {
                if (elem.pageSourceId == "startpoint") {
                    var connection1 = jsPlumb.connect({
                        source: elem.pageSourceId + "1",
                        target: elem.pageTargetId + "_l",
                        uuids: [SourceUuid[0], TargetUuid[1]]
                    });
                }
                else {
                    var connection1 = jsPlumb.connect({
                        source: elem.pageSourceId + "_l",
                        target: elem.pageTargetId + "_l",
                        uuids: [SourceUuid[0], TargetUuid[1]]
                    });
                }
            }
            else {
                var connection1 = jsPlumb.connect({
                    source: elem.pageSourceId + "_l",
                    target: elem.pageTargetId + "_l",
                    uuids: [SourceUuid[0], TargetUuid[TargetUuid.length - 1]]
                });
            }
        });
    }

    var occurrences = {};
    for (var i = 0, j = collPageSource.length; i < j; i++) {
        occurrences[collPageSource[i]] = (occurrences[collPageSource[i]] || 0) + 1;
    }

    var dec = document.getElementsByClassName("decision");
    for (var i = 0; i < dec.length; i++) {
        if (dec[i] && dec[i] != "") {
            $("#" + $(dec[i]).attr("id") + " .noOfConn").css("visibility", "hidden");
        }
    }

    numberOfElements = flowChart.numberOfElements;
    var a = $('.endpoint1').offset().top - $('#startpoint1').offset().top + 100;
    $("#regdrawingArea").height(a);
    htmlBase = 'drawingArea';
}

$("#drawingArea").on("click", function () {
    $('.node').removeClass("nodeselected");
    $('._jsPlumb_overlay').removeClass("_jsPlumb_overlay_selected");
    $('.lblCase').removeClass("selectedcase");
});

