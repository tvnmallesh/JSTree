/* ops.custom.js
 *
 This file consists of the all the operations that can be performed on the flows, projects and modules.
 It also consists of the methods that are called for context menus and modal dialogs

*/
function OpenProjectDialog(createdBy) {
    $("#divExistingProjects").html("");
    objProjToOpen = [];
    var ApiUrl = getURL();
    //alert(ApiUrl);
    $.ajax({
        url: ApiUrl + '/TestProject/GetProjectDetails/' + createdBy,
        type: 'GET',
        async: false,
        success: function (data) {
            $('#lblErrOpen').css("visibility", "hidden");
            $('#lblErrOpen').html("");
            var projectId = null;
            var projectName = null;
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {

                    projectId = data[i].projectsdetail.projectid;
                    projectName = data[i].projectsdetail.name;

                    var link = $("<input type='checkbox'>");
                    var label = $("<label>");
                    var outerlabel = $("<label>");
                    link.attr("onclick", "setBtnVal(this,event)");
                    link.attr("Id", projectId);
                    link.attr("name", projectName);
                    label.text(projectName);
                    label.attr("for", projectId);

                    outerlabel.append(link);
                    outerlabel.append(label)

                    $("#divExistingProjects").append(outerlabel);
                    $("#divExistingProjects").append("</br>");
                }
            }
            else {
                $('#lblErrOpen').css("visibility", "visible");
                $('#lblErrOpen').html("No existing projects found!");
            }
        },
        error: function (Response) {
            $('#lblErrOpen').css("visibility", "visible");
            $('#lblErrOpen').html("Oops! Something went wrong.");
        }
    });

    $('#OpenExistingDialog').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });
}

var objProjToOpen = [];
function setBtnVal(obj, e) {
    if ($(obj).prop('checked') == true) {
        objProjToOpen.push($(obj).attr("id"));
    }
    else {
        objProjToOpen.forEach(function (curItem, i) {
            if (curItem == $(obj).attr("id")) {
                objProjToOpen.splice(i, 1);
            }
        });
    }
    if (objProjToOpen.length > 0) {
        $('#btnOpenExisting').removeAttr("disabled");
        $('#btnOpenExisting').attr("projects", objProjToOpen);
    }
    else {
        $('#btnOpenExisting').attr("disabled", "disabled");
    }
}

function OpenExisting(createdBy, activeComponenet) {
    //debugger;    
    var id = $('#btnOpenExisting').attr("projects");

    if (id && id.split(",").length > 1) {
        $('#btnTestSuit').show();
    }
    else {
        $('#btnTestSuit').hide();
    }

    var ApiUrl = getURL();
    $.ajax({
        url: ApiUrl + '/TestProject/GetProjectDetails/' + id + '/' + createdBy,
        type: 'GET',
        async: false,
        success: function (data) {

            var projectId = null;
            var projectName = null;
            var projectVersion = null;
            var projectCreatedBy = null;
            var moduleId = null;
            var moduleName = null;
            var moduleVersion = null;
            var modelflowId = null;
            var modelflowName = null;
            var modelflowVersion = null;
            var ReqId = null;
            var ReqName = null;
            var ReqDescription = null;
            var AccCriteria = null;
            var parentFlowid = null;

            /* to clear createProjectTree*/
            $('#createProjectTree').empty();
            $('.clsproject').removeClass("activeproject");

            for (var i = 0; i < data.length; i++) {

                projectId = data[i].projectsdetail.projectid;
                projectName = data[i].projectsdetail.name;
                projectVersion = data[i].projectsdetail.version;
                projectCreatedBy = data[i].projectsdetail.createdBy;

                var objProj = {
                    projectid: projectId,
                    projectname: projectName,
                    projectversion: projectVersion,
                    projectCreatedBy: projectCreatedBy,
                    moduleid: null,
                    modulename: null,
                    moduleversion: null,
                    modelflowid: null,
                    modelflowname: null,
                    modelflowversion: null
                };
                var objP = JSON.stringify(objProj);


                /* Project Collection */
                var newProject = document.createElement("UL");
                var newModuleList = document.createElement("UL");

                var liProject = document.createElement("li");
                var spanProject = document.createElement("span");
                $(liProject).attr("spanId", projectId);
                $(spanProject).attr("id", projectId);
                $(spanProject).attr("data", objP);

                liProject.appendChild(spanProject);
                spanProject.innerText = projectName;

                if ($(activeComponenet).hasClass("clsproject")) {
                    if ($(activeComponenet).attr("spanid") == projectId || $($(activeComponenet).children()[0]).attr("id") == projectId) {
                        $(liProject).addClass("activeproject");
                    }
                }

                $(spanProject).attr("oncontextmenu", "funcDropdown(event,this,'" + createdBy.replace("\\", "-") + "')");
                $(spanProject).attr("onclick", "collapseExpand(event,this)");
                $(spanProject).addClass("span");
                $(liProject).addClass("parent_li clsproject");
                if (projectName.length > 10) {
                    $(spanProject).addClass("texttitle");
                    $(spanProject).attr("title", projectName);
                }
                liProject.appendChild(newModuleList);

                $('#createProjectTree').append(liProject);

                /* Module Collection */
                if (!activeComponenet && (!(data[i].projectsdetail.module) || data[i].projectsdetail.module.length == 0)) {
                    $("#drawingArea").css("visibility", "hidden");
                    $("#divRegAnalysis").css("visibility", "hidden");
                    removeCheckBox();
                    $(".pull-left div").hide();
                    $(".pull-right").hide();
                }

                else if (data[i].projectsdetail.module != null && data[i].projectsdetail.module.length > 0) {
                    var module = data[i].projectsdetail.module;
                    for (var m = 0; m < module.length; m++) {

                        if (m == 0) {
                            var liModuleMain = document.createElement("li");
                            var spanModuleMain = document.createElement("span");
                            var newmoduleListMain = document.createElement("UL");

                            liModuleMain.appendChild(spanModuleMain);
                            spanModuleMain.innerText = "Modules";
                            $(spanModuleMain).attr("onclick", "collapseExpand(event,this)");
                            $(spanModuleMain).addClass("span orange");

                            $(newmoduleListMain).attr("id", "createModuleTree" + i);
                            $(newmoduleListMain).attr("class", "childhidden");

                            $(liModuleMain).attr("class", "parent_li");

                            liModuleMain.appendChild(newmoduleListMain);

                            $('#' + $(liProject).attr("spanId")).next('ul').append(liModuleMain);
                        }


                        moduleId = module[m].moduleid;
                        moduleName = module[m].name;
                        moduleVersion = module[m].version;

                        var objProj = {
                            projectid: projectId,
                            projectname: projectName,
                            projectversion: projectVersion,
                            moduleid: moduleId,
                            modulename: moduleName,
                            moduleversion: moduleVersion,
                            modelflowid: null,
                            modelflowname: null,
                            modelflowversion: null
                        };

                        var objM = JSON.stringify(objProj);

                        var liModule = document.createElement("li");
                        var spanModule = document.createElement("span");
                        var newmoduleList = document.createElement("UL");

                        $(newmoduleList).attr("spanId", moduleId);
                        $(spanModule).attr("id", module[m].moduleid);
                        $(spanModule).attr("data", objM);

                        liModule.appendChild(spanModule);
                        spanModule.innerText = module[m].name;

                        $(spanModule).attr("oncontextmenu", "funcDropdownFlow(event,this)");
                        $(spanModule).attr("onclick", "collapseExpand(event,this)");
                        $(spanModule).addClass("span");
                        if (module[m].name.length > 10) {
                            $(spanModule).addClass("texttitle");
                            $(spanModule).attr("title", module[m].name);
                        }

                        $(liModule).attr("class", "parent_li");

                        liModule.appendChild(newmoduleList);

                        $('#createModuleTree' + i).append(liModule);

                        if (!activeComponenet && (!(module[m].modelflow) || module[m].modelflow.length == 0)) {
                            $("#drawingArea").css("visibility", "hidden");
                            $("#divRegAnalysis").css("visibility", "hidden");
                            removeCheckBox();
                            $(".pull-left div").hide();
                            $(".pull-right").hide();
                        }
                        /* Modele Flow Collection */
                        else if (module[m].modelflow != null && module[m].modelflow.length > 0) {
                            var modelflow = module[m].modelflow;
                            for (var mf = 0; mf < modelflow.length; mf++) {

                                if (mf == 0) {
                                    var liModelflowMain = document.createElement("li");
                                    var spanModelflowMain = document.createElement("span");
                                    var newModelflowMain = document.createElement("UL");

                                    liModelflowMain.appendChild(spanModelflowMain);
                                    spanModelflowMain.innerText = "Model Flows";
                                    $(spanModelflowMain).attr("onclick", "collapseExpand(event,this)");
                                    $(spanModelflowMain).addClass("span orange");

                                    $(newModelflowMain).attr("id", "createFlowTree" + module[m].moduleid);
                                    $(newModelflowMain).attr("class", "childhidden");

                                    $(liModelflowMain).attr("class", "parent_li");

                                    liModelflowMain.appendChild(newModelflowMain);

                                    $('#' + $(newmoduleList).attr("spanId")).next('ul').append(liModelflowMain);
                                }

                                modelflowId = modelflow[mf].modelflowid;
                                modelflowName = modelflow[mf].modelflowname;
                                modelflowVersion = modelflow[mf].version;
                                parentFlowid = modelflow[mf].parentFlowid;

                                var objProj = {
                                    projectid: projectId,
                                    projectname: projectName,
                                    projectversion: projectVersion,
                                    moduleid: moduleId,
                                    modulename: moduleName,
                                    moduleversion: moduleVersion,
                                    modelflowid: modelflowId,
                                    modelflowname: modelflowName,
                                    modelflowversion: modelflowVersion,
                                    parentFlowid: parentFlowid
                                };

                                var objMF = JSON.stringify(objProj);

                                var liModelflow = document.createElement("li");
                                var spanModelflow = document.createElement("span");
                                var newModelflowList = document.createElement("UL");

                                liModelflow.appendChild(spanModelflow);

                                spanModelflow.innerText = modelflowName;//modelflow[mf].modelflowname;
                                $(spanModelflow).addClass("span");
                                $(spanModelflow).attr("onclick", "collapseExpand(event,this)");
                                $(spanModelflow).attr("oncontextmenu", "funcdropCopyVersions(event,this)");

                                if (modelflowName.length > 10) {
                                    $(spanModelflow).addClass("texttitle");
                                    $(spanModelflow).attr("title", modelflowName);
                                }

                                liModelflow.appendChild(newModelflowList);
                                $(liModelflow).attr("class", "parent_li");
                                var liModelflowVersion = document.createElement("li");
                                var spanModelflowVersion = document.createElement("span");
                                liModelflowVersion.appendChild(spanModelflowVersion);


                                var duplicate = false;

                                modelflow.filter(function (item, i) {
                                    if (modelflow[mf].modelflowname == modelflow[i].modelflowname && modelflow[mf].version > modelflow[i].version) {
                                        duplicate = true;
                                    }

                                });


                                if (!duplicate) {
                                    $(spanModelflowVersion).html("v" + modelflow[mf].version);
                                    newModelflowList.appendChild(liModelflowVersion);
                                    $("#createFlowTree" + module[m].moduleid).append(liModelflow);
                                    $(spanModelflowVersion).attr("id", modelflowId);
                                    $(spanModelflowVersion).attr("name", modelflowName);
                                    $(spanModelflowVersion).attr("data", objMF);
                                    $(spanModelflowVersion).attr("onclick", "drawingAreaReady(this,'" + createdBy + "')");
                                    $(spanModelflowVersion).attr("oncontextmenu", "funcDropdownFlowOps(event,this)");
                                    $(spanModelflowVersion).addClass("span");
                                    $(spanModelflowVersion).addClass("flowElement");

                                    if (!$(activeComponenet).hasClass("clsproject")) {
                                        if ($(spanModelflowVersion).attr("id") == $(activeComponenet).attr("id")) {
                                            $(spanModelflowVersion).addClass("activeElement");
                                        }
                                    }

                                    if (modelflow[mf].nodes != null && modelflow[mf].nodes.length > 0 && modelflow[mf].connections !== null && modelflow[mf].connections.length > 0) {
                                        var nodeconn = '{"nodes":' + JSON.stringify(modelflow[mf].nodes) + ',"connections":' + JSON.stringify(modelflow[mf].connections) + ',"numberOfElements":' + modelflow[mf].nodes.length + '}'
                                        $(spanModelflowVersion).attr("tcase", nodeconn);
                                    }
                                    else if (modelflow[mf].nodes != null && modelflow[mf].nodes.length > 0 && modelflow[mf].connections == null ) {
                                        var nodeconn = '{"nodes":' + JSON.stringify(modelflow[mf].nodes) + ',"connections":[],"numberOfElements":' + modelflow[mf].nodes.length + '}'
                                        $(spanModelflowVersion).attr("tcase", nodeconn);
                                    }
                                    else {
                                        $(spanModelflowVersion).attr("tcase", '{"nodes":[{"blockId":"startpoint","nodetype":"startpoint","positionX":400,"positionY":50,"DisplayText":""},{"blockId":"endpoint","nodetype":"endpoint","positionX":400,"positionY":480,"DisplayText":""}],"connections":[],"numberOfElements":0}');
                                    }
                                }
                                else {
                                    var newliModelflowVersion = document.createElement("li");
                                    var newspanModelflowVersion = document.createElement("span");
                                    newliModelflowVersion.appendChild(newspanModelflowVersion);
                                    $(newspanModelflowVersion).html("v" + modelflow[mf].version);
                                    $(newspanModelflowVersion).attr("oncontextmenu", "funcDropdownFlowOps(event,this)");
                                    $(newspanModelflowVersion).attr("id", modelflowId);
                                    $(newspanModelflowVersion).attr("name", modelflowName);
                                    $(newspanModelflowVersion).attr("data", objMF);
                                    $(newspanModelflowVersion).attr("onclick", "drawingAreaReady(this,'" + createdBy + "')");
                                    $(newspanModelflowVersion).addClass("span");
                                    $(newspanModelflowVersion).addClass("flowElement");

                                    if (!$(activeComponenet).hasClass("clsproject")) {
                                        if ($(newspanModelflowVersion).attr("id") == $(activeComponenet).attr("id")) {
                                            $(newspanModelflowVersion).addClass("activeElement");
                                        }
                                    }

                                    var li = $('#' + $(newmoduleList).attr("spanId")).next('ul').children().children().next('ul').children();
                                    for (var l = 0; l < li.length; l++) {

                                        if (JSON.parse($($($($(li[l]).children()[1]).children()).children()[0]).attr('data')).modelflowname == JSON.parse(objMF).modelflowname) {
                                            $($(li[l]).children()[1]).append(newliModelflowVersion);
                                        }
                                    }
                                    if (modelflow[mf].nodes != null && modelflow[mf].nodes.length > 0 && modelflow[mf].connections !== null && modelflow[mf].connections.length > 0) {
                                        var nodeconn = '{"nodes":' + JSON.stringify(modelflow[mf].nodes) + ',"connections":' + JSON.stringify(modelflow[mf].connections) + ',"numberOfElements":' + modelflow[mf].nodes.length + '}'
                                        $(newspanModelflowVersion).attr("tcase", nodeconn);
                                    }
                                    else {
                                        $(newspanModelflowVersion).attr("tcase", '{"nodes":[{"blockId":"startpoint","nodetype":"startpoint","positionX":400,"positionY":50,"DisplayText":""},{"blockId":"endpoint","nodetype":"endpoint","positionX":400,"positionY":480,"DisplayText":""}],"connections":[],"numberOfElements":0}');
                                    }

                                }

                                $("#drawingArea").css("visibility", "visible");
                                $(".pull-left div").show();
                                $(".pull-left div").css("display", "inline");
                                $(".pull-right").show();
                            }
                        }


                        /* Requirements Collection */
                        if (module[m].requirements != null && module[m].requirements.length > 0) {
                            var requirements = module[m].requirements;
                            for (var r = 0; r < requirements.length; r++) {

                                if (r == 0) {
                                    var liModelflowMain = document.createElement("li");
                                    var spanModelflowMain = document.createElement("span");
                                    var newModelflowMain = document.createElement("UL");

                                    liModelflowMain.appendChild(spanModelflowMain);
                                    spanModelflowMain.innerText = "Requirements";
                                    $(spanModelflowMain).attr("onclick", "collapseExpand(event,this)");
                                    $(spanModelflowMain).addClass("span orange");

                                    $(newModelflowMain).attr("id", "Req" + module[m].moduleid);
                                    $(newModelflowMain).attr("class", "childhidden");

                                    $(liModelflowMain).attr("class", "parent_li");

                                    liModelflowMain.appendChild(newModelflowMain);

                                    $('#' + $(newmoduleList).attr("spanId")).next('ul').append(liModelflowMain);
                                }

                                ReqId = module[m].requirements[r].reqid;
                                ReqName = module[m].requirements[r].reqname;
                                ReqDescription = module[m].requirements[r].description;
                                AccCriteria = module[m].requirements[r].accCriteria

                                var objReq = {
                                    projectid: projectId,
                                    projectname: projectName,
                                    projectversion: projectVersion,
                                    moduleid: moduleId,
                                    modulename: moduleName,
                                    moduleversion: moduleVersion,
                                    reqid: ReqId,
                                    reqname: ReqName,
                                    description: ReqDescription,
                                    accCriteria: AccCriteria
                                };

                                var objM = JSON.stringify(objProj);

                                var liModule = document.createElement("li");
                                var spanModule = document.createElement("span");
                                var newmoduleList = document.createElement("UL");

                                $(newmoduleList).attr("spanId", ReqId);
                                $(spanModule).attr("id", ReqId);
                                $(spanModule).attr("data", JSON.stringify(objReq));

                                liModule.appendChild(spanModule);
                                spanModule.innerText = ReqName;

                                $(spanModule).attr("oncontextmenu", "funcDropdownReq(event,this)");
                                $(spanModule).attr("onclick", "getreqDetails('" + projectId + "','" + moduleId + "','" + moduleName + "'," + null + ",'" + ReqId +"')");
                                $(spanModule).addClass("span");
                                if (ReqName.length > 10) {
                                    $(spanModule).addClass("texttitle");
                                    $(spanModule).attr("title", ReqName);
                                }

                                $(liModule).attr("class", "parent_li");

                                liModule.appendChild(newmoduleList);
                                $("#Req" + module[m].moduleid).append(liModule);
                            }
                        }


                    }

                    $('.pull-left div').hide();
                    $('.pull-right').hide();
                    $('#drawingArea').hide();
                    $("#divRegAnalysis").hide();
                    $("#divRegAnalysis").css("visibility", "hidden");
                    $('#rightCheckBoxBar').hide();
                    if ($('.activeElement').length > 0) {
                        drawingAreaReady($('.activeElement'), createdBy);



                    }
                }
            }
        },
        error: function (Response) {
            alert("Failed");
        }
    })

}
//when create project is clicked
function createProject(createdBy) {
    debugger;

    var err = false;
    if (!$('#txtProjectName').val().trim()) {
        $('.footer-disabled').find("button").attr("disabled", "disabled");
        $('#txtProjectName').val("");
        $('#txtProjectName').focus();
        $('#lblErrPr').css("visibility", "visible");
        $('#lblErrPr').html("Please enter a proper name for the module!");
        err = true;
    }

    var existsInDB = "";
    var ApiUrl = getURL();

    $.ajax({
        url: ApiUrl + '/TestProject/GetProjectDetails/' + createdBy,
        type: 'GET',
        async: false,
        success: function (data) {
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    existsInDB = existsInDB + ";" + data[i].projectsdetail.name;
                }
            }
        },
        error: function (Response) {
            $('#lblErrOpen').css("visibility", "visible");
            $('#lblErrOpen').html("Oops! Something went wrong.");
        }
    });

    if (existsInDB.indexOf($('#txtProjectName').val()) > -1) {
        $('.footer-disabled').find("button").attr("disabled", "disabled");
        $('#txtModelFlow').val("");
        $('#txtModelFlow').focus();
        $('#lblErrPr').css("visibility", "visible");
        $('#lblErrPr').html("Project with the same name exists!");
        err = true;
    }

    $('#createProjectTree li').find("span").each(function (idx, li) {
        var existing = $(li).html();

        if ($('#txtProjectName').val() == existing) {
            $('.footer-disabled').find("button").attr("disabled", "disabled");
            $('#txtModelFlow').val("");
            $('#txtModelFlow').focus();
            $('#lblErrPr').css("visibility", "visible");
            $('#lblErrPr').html("Project with the same name exists!");
            err = true;
        }
    });

    if (!err) {


        var projectId = GetGuid();
        var projectName = $('#txtProjectName').val();
        var projectVersion = "0";
        var newModuleList = document.createElement("UL");

        var liProject = document.createElement("li");
        var spanProject = document.createElement("span");
        $(spanProject).attr("id", "p_" + $('#txtProjectName').val());

        var objProj = {
            projectid: projectId,
            projectname: projectName,
            projectversion: projectVersion,
            projectCreatedBy: createdBy,
            moduleid: null,
            modulename: null,
            moduleversion: null,
            modelflowid: null,
            modelflowname: null,
            modelflowversion: null
        };

        var obj = JSON.stringify(objProj);

        $(spanProject).attr("id", projectId);
        $(spanProject).attr("data", obj);

        liProject.appendChild(spanProject);
        spanProject.innerText = projectName;

        $(spanProject).attr("oncontextmenu", "funcDropdown(event,this,'" + createdBy.replace("\\", "-") + "')");
        $(spanProject).attr("onclick", "collapseExpand(event,this)");
        $(spanProject).addClass("span");
        if (projectName.length > 10) {
            $(spanProject).addClass("texttitle");
            $(spanProject).attr("title", projectName);
        }
        $(liProject).attr("class", "parent_li clsproject");

        liProject.appendChild(newModuleList);

        var ProjectDTO = {
            "projectid": projectId,
            "name": projectName,
            "description": "Creating new test project",
            "createdBy": createdBy,
            "version": projectVersion
        }

        var url = getURL();

        $.ajax({
            url: url + '/TestProject/CreateProjectDetail/',
            type: 'POST',
            data: ProjectDTO,
            async: false,
            success: function (Response, XMLHttpRequest, textStatus, errorThrown) {

                $('#createProjectTree').append(liProject);
                $('#btnOpenExisting').attr("projects", $('#btnOpenExisting').attr("projects") + "," + projectId)
            },
            error: function (Response, XMLHttpRequest, textStatus, errorThrown) {
                alert("Failed");

            }
        });
        $("#drawingArea").hide();
        $("#divRegAnalysis").hide();
        $(".pull-left div").hide();
        $(".pull-right").hide();
    }
}

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function GetGuid() {
    // then to call it, plus stitch in '4' in the third group
    return (guid = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase());
}


function funcDropdown(e, obj, owner) {
    //debugger;
    e.preventDefault();
    $(".contextmenucustom").css("display", "none");
    $("#dropModule").attr("spanId", $(obj).attr("id"));
    $("#dropModule").attr("data", $(obj).attr("data"));

    var createdBy = JSON.parse($(obj).attr("data")).projectCreatedBy.replace("\\", "-");
    if (createdBy != owner) {
        $('#liShareWith').addClass("disable");
    }
    else {
        $('#liShareWith').removeClass("disable");
    }
    $("#dropModule").css("left", e.clientX);
    $("#dropModule").css("top", e.clientY);
    $("#dropModule").fadeIn(200, startFocusOut());

}

function funcDropdownProject(e, obj) {
    e.preventDefault();
    $(".contextmenucustom").css("display", "none");
    $("#dropModelProject").attr("spanId", $(obj).attr("id"));
    $("#dropModelProject").attr("data", $(obj).attr("data"));
    $("#dropModelProject").css("left", e.clientX);
    $("#dropModelProject").css("top", e.clientY);
    $(".droptoggles").addClass("active");
    $("#dropModelProject").fadeIn(200, startFocusOut());
}


//function funcDropdownInclusion(e, obj) {
//    e.preventDefault();
//    $(".oninclusion").css("display", "none");
//    $("#dropModelProject").attr("spanId", $(obj).attr("id"));
//    $("#dropModelProject").attr("data", $(obj).attr("data"));
//    $("#dropModelProject").css("left", e.clientX);
//    $("#dropModelProject").css("top", e.clientY);
//    $(".droptoggles").addClass("active");
//    $("#dropModelProject").fadeIn(200, startFocusOut());
//}

function funcDropdownFlow(e, obj) {
    //debugger;
    e.preventDefault();
    $(".contextmenucustom").css("display", "none");
    $("#dropModelFlow").attr("spanId", $(obj).attr("id"));
    $("#dropModelFlow").attr("data", $(obj).attr("data"));
    $("#dropModelFlow").css("left", e.clientX);
    $("#dropModelFlow").css("top", e.clientY);
    $("#dropModelFlow").fadeIn(200, startFocusOut());
}

function funcDropdownFlowOps(e, obj) {
    //debugger;
    e.preventDefault();
    $(".contextmenucustom").css("display", "none");
    $("#dropModelFlowOps").attr("spanId", $(obj).attr("id"));
    $("#dropModelFlowOps").attr("data", $(obj).attr("data"));
    $("#dropModelFlowOps").attr("tcase", $(obj).attr("tcase"));
    $("#dropModelFlowOps").css("left", e.clientX);
    $("#dropModelFlowOps").css("top", e.clientY);
    $("#dropModelFlowOps").fadeIn(200, startFocusOut());
}

function funcdropCopyVersions(e, obj) {
    //debugger;
    e.preventDefault();
    $(".contextmenucustom").css("display", "none");
    var details = $($(obj).parent().parent().parent().parent().parent().children()[0]).attr("data");
    var id = $($(obj).parent().parent().parent().parent()).attr("spanid");
    if (details) {
        $("#dropCopyAllVersions").attr("ProjectID", JSON.parse(details).projectid);
        $("#dropCopyAllVersions").attr("ModuleID", JSON.parse(details).moduleid);
    }
    if (id) {
        $("#dropCopyAllVersions").attr("ModelFlowID", id);
    }

    $("#dropCopyAllVersions").attr("FlowName", $(obj).html());
    $("#dropCopyAllVersions").attr("tcase", $(obj).attr("tcase"));
    $("#dropCopyAllVersions").css("left", e.clientX);
    $("#dropCopyAllVersions").css("top", e.clientY);
    $("#dropCopyAllVersions").fadeIn(200, startFocusOut());
}

function RenameFlow() {
    $(".zoombuttons").show();
    $('#txtRenameFlow').val("");

    $('.footer-disabled').find("button").attr("disabled", "disabled");
    $('#lblErr').css("visibility", "hidden");

    $('#RenameModelFlow').on('shown.bs.modal', function () {
        $('#txtRenameFlow').focus();
    });

    $('#RenameModelFlow').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });

    $('.footer-disabled').find("button").attr("projectId", $("#dropCopyAllVersions").attr("ProjectID"));
    $('.footer-disabled').find("button").attr("ModuleID", $("#dropCopyAllVersions").attr("ModuleID"));
    $('.footer-disabled').find("button").attr("ModelFlowID", $("#dropCopyAllVersions").attr("ModelFlowID"));
}

function RenameModule() {
    $(".zoombuttons").show();
    $('#txtRenameModule').val("");

    $('.footer-disabled').find("button").attr("disabled", "disabled");
    $('#lblErr').css("visibility", "hidden");

    $('#RenameModule').on('shown.bs.modal', function () {
        $('#txtRenameModule').focus();
    });

    $('#RenameModule').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });

    $('.footer-disabled').find("button").attr("data", $("#dropModelFlow").attr("data"));
}

function renameFlow(obj, createdBy) {
    $('#lblErrRenameFlow').css("visibility", "hidden");
    var activeproject = $('#' + $(obj).attr("ModelFlowID")).closest('.clsproject');


    var existsInDB = false;
    var ApiUrl = getURL();

    $.ajax({
        url: ApiUrl + '/TestProject/GetProjectDetails/' + createdBy,
        type: 'GET',
        async: false,
        success: function (data) {
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    if ($(obj).attr("projectId") == data[i].projectsdetail.projectid) {
                        for (var j = 0; j < data[i].projectsdetail.module.length; j++) {
                            if ($(obj).attr("ModuleID") == data[i].projectsdetail.module[j].moduleid) {
                                for (var k = 0; k < data[i].projectsdetail.module[j].modelflow.length; k++) {
                                    if (data[i].projectsdetail.module[j].modelflow[k].modelflowname == $('#txtRenameFlow').val()) {
                                        existsInDB = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        error: function (Response) {
            $('#lblErrRenameFlow').css("visibility", "visible");
            $('#lblErrRenameFlow').html("Oops! Something went wrong.");
        }
    });

    var url = getURL();

    if (!existsInDB) {
        $.ajax({
            url: url + '/TestProject/RenameModelFlowDetail/' + $(obj).attr("projectId") + '/' + $(obj).attr("ModuleID") + '/' + $("#dropCopyAllVersions").attr("FlowName") + '/' + $('#txtRenameFlow').val(),
            type: 'PUT',
            async: false,
            success: function (Response, XMLHttpRequest, textStatus, errorThrown) {
                alert("Flow was renamed successfully!");
                OpenExisting(createdBy, activeproject);
            },
            error: function (Response, XMLHttpRequest, textStatus, errorThrown) {
                alert("Failed");
            }
        });
    }
    else {
        $('.footer-disabled').find("button").attr("disabled", "disabled");
        $('#txtRenameFlow').val("");
        $('#txtRenameFlow').focus();
        $('#lblErrRenameFlow').css("visibility", "visible");
        $('#lblErrRenameFlow').html("Flow with the same name exists in this Module!");
    }
}

function renameModule(obj, createdBy) {
    $('#lblErrRenameModule').css("visibility", "hidden");
    var existsInDB = false;
    var Details = JSON.parse($(obj).attr("data"));
    var ApiUrl = getURL();

    $.ajax({
        url: ApiUrl + '/TestProject/GetProjectDetails/' + createdBy,
        type: 'GET',
        async: false,
        success: function (data) {
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    if (Details.projectid == data[i].projectsdetail.projectid) {
                        for (var j = 0; j < data[i].projectsdetail.module.length; j++) {
                            if ($('#txtRenameModule').val() == data[i].projectsdetail.module[j].name) {

                                existsInDB = true;

                            }
                        }
                    }
                }
            }
        },
        error: function (Response) {
            $('#lblErrRenameModule').css("visibility", "visible");
            $('#lblErrRenameModule').html("Oops! Something went wrong.");
        }
    });

    if (!existsInDB) {

        var renamed;

        var ModelDTO = {
            "moduleid": Details.moduleid,
            "name": Details.modulename,
            "description": "Creating new module",
            "version": Details.moduleversion
        }

        var activeproject = $('#' + Details.moduleid).closest('.clsproject');
        var url = getURL();

        $.ajax({
            url: url + '/TestProject/RenameModuleDetail/' + Details.projectid + '/' + $('#txtRenameModule').val(),
            type: 'PUT',
            data: ModelDTO,
            async: false,
            success: function (Response, XMLHttpRequest, textStatus, errorThrown) {
                renamed = true;
                OpenExisting(createdBy, activeproject);
                if (renamed) {
                    alert(Details.modulename + " was Renamed succesfully!");
                }
            },
            error: function (Response, XMLHttpRequest, textStatus, errorThrown) {
                alert("Failed");
            }
        });
    }
    else {
        $('.footer-disabled').find("button").attr("disabled", "disabled");
        $('#txtRenameModule').val("");
        $('#txtRenameModule').focus();
        $('#lblErrRenameModule').css("visibility", "visible");
        $('#lblErrRenameModule').html("Module with the same name exists in this project!");
    }

}

function funcDropdownReq(e, obj) {
    e.preventDefault();
    $(".contextmenucustom").css("display", "none");
    $("#dropReq").attr("spanId", $(obj).attr("id"));
    $("#dropReq").attr("data", $(obj).attr("data"));
    $("#dropReq").attr("tcase", $(obj).attr("tcase"));
    $("#dropReq").css("left", e.clientX);
    $("#dropReq").css("top", e.clientY);
    $("#dropReq").fadeIn(200, startFocusOut());
}

function DeleteReq(createdBy) {
    var r = confirm("Are you sure you want to delete selected Requirement?");
    if (r == true) {
        deleteRequirement($("#dropReq").attr("data"), createdBy);
    }
}

function deleteRequirement(data, createdBy) {
    var ProjectDetails = JSON.parse(data);
    var ReqDTO = {
        "reqid": ProjectDetails.reqid,
        "reqname": ProjectDetails.reqname,
        "description": ProjectDetails.description,
        "accCriteria": ProjectDetails.accCriteria
    }
    var url = getURL();

    $.ajax({
        url: url + '/TestProject/DeleteReq/' + ProjectDetails.projectid + '/' + ProjectDetails.moduleid + '/' + ProjectDetails.modulename,
        type: 'DELETE',
        data: ReqDTO,
        async: false,
        success: function (Response, XMLHttpRequest, textStatus, errorThrown) {
            alert("Requirement was deleted successfully!");
        },
        error: function (Response, XMLHttpRequest, textStatus, errorThrown) {
            alert("Failed");
        }
    })
    var activeproject = $('#' + ProjectDetails.moduleid).closest('.clsproject');
    OpenExisting(createdBy, activeproject);
}

function EditReq() {
    $(".zoombuttons").show();
    var ProjectDetails = JSON.parse($('#dropReq').attr("data"));
    var url = getURL();

    $.ajax({
        url: url + '/TestProject/FetchReq/' + ProjectDetails.projectid + '/' + ProjectDetails.moduleid + '/' + ProjectDetails.modulename + '/' + ProjectDetails.reqid,
        type: 'GET',
        async: false,
        success: function (data) {
            var jsonobj = data[0];
            $('#txtRequirementName').val(jsonobj.reqname);
            $('#txtDesc').val(jsonobj.description);
            $('#txtAccCriteria').val(jsonobj.accCriteria);

            $('#editReq').show();
            $('#createReq').hide();
            $('#lblErr').css("visibility", "hidden");

            $('#CreateRequirement').on('shown.bs.modal', function () {
                $('#txtRequirementName').focus();
            });

            $('#CreateRequirement').modal({
                show: true,
                backdrop: 'static',
                keyboard: true
            });
            $('#editReq').attr("spanId", $("#dropReq").attr("spanId"));
            $('#editReq').attr("data", $("#dropReq").attr("data"));
        },
        error: function (Response, XMLHttpRequest, textStatus, errorThrown) {
            alert("Failed");
        }
    });


}

function getreqDetails(projectid, moduleid, modulename, ddlnum,reqname) {
    var url = getURL();
    var val;
    if (ddlnum != null) {
        val = $('#Req' + ddlnum + ' :selected').val();
    }
    else if (reqname) {
        val = reqname;
    }

    if (val != -1) {

        $.ajax({
            url: url + '/TestProject/FetchReq/' + projectid + '/' + moduleid + '/' + modulename + '/' + val,
            type: 'GET',
            async: false,
            success: function (data) {
                if (data) {
                    var jsonobj = data[0];
                    $('#txtRequirementName').val(jsonobj.reqname);
                    $('#txtDesc').val(jsonobj.description);
                    $('#txtAccCriteria').val(jsonobj.accCriteria);

                    $('#editReq').hide();
                    $('#createReq').hide();
                    $('#lblErr').css("visibility", "hidden");

                    $('#CreateRequirement').on('shown.bs.modal', function () {
                        $('#txtRequirementName').focus();
                    });

                    $('#CreateRequirement').modal({
                        show: true,
                        backdrop: 'static',
                        keyboard: true
                    });
                    $('#editReq').attr("spanId", $("#dropReq").attr("spanId"));
                    $('#editReq').attr("data", $("#dropReq").attr("data"));
                }
                else {
                    alert("Please Select a proper value for Request");
                }
            },
            error: function (Response, XMLHttpRequest, textStatus, errorThrown) {
                alert("Failed");
            }
        });
    }
    else {
        alert("Please Select a proper value for Request");
    }

}

function editRequirement(obj, createdBy) {
    createRequirement(obj, createdBy)
}

function CopyWithVersions() {
    if ($("#dropCopyAllVersions").attr("ProjectID") && $("#dropCopyAllVersions").attr("ModuleID")) {
        localStorage.setItem("Projectid", $("#dropCopyAllVersions").attr("ProjectID"));
        localStorage.setItem("Moduleid", $("#dropCopyAllVersions").attr("ModuleID"));
        localStorage.setItem("FlowName", $("#dropCopyAllVersions").attr("FlowName"));
        $('#pasteVersions').removeClass('disable');
    }
}

function PasteVersions(createdBy) {
    var objModule = JSON.parse($("#dropModelFlow").attr("data"));
    var flowname = localStorage.getItem("FlowName");
    var Projectid = localStorage.getItem("Projectid");
    var Moduleid = localStorage.getItem("Moduleid");


    var existsInDB = false;
    var ApiUrl = getURL();

    $.ajax({
        url: ApiUrl + '/TestProject/GetProjectDetails/' + createdBy,
        type: 'GET',
        async: false,
        success: function (data) {
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    if (objModule.projectid == data[i].projectsdetail.projectid) {
                        for (var j = 0; j < data[i].projectsdetail.module.length; j++) {
                            if (objModule.moduleid == data[i].projectsdetail.module[j].moduleid) {
                                for (var k = 0; k < data[i].projectsdetail.module[j].modelflow.length; k++) {
                                    if (data[i].projectsdetail.module[j].modelflow[k].modelflowname == flowname) {
                                        existsInDB = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        error: function (Response) {
            $('#lblErrOpen').css("visibility", "visible");
            $('#lblErrOpen').html("Oops! Something went wrong.");
        }
    });
    var url = getURL();

    $.ajax({
        url: url + '/TestProject/CopyAllWithVersions/' + objModule.projectid + '/' + objModule.moduleid + '/' + flowname + '/' + Projectid + '/' + Moduleid + '/' + existsInDB,
        type: 'PUT',
        async: false,
        success: function (Response, XMLHttpRequest, textStatus, errorThrown) {
            alert("Flow was copied with versions!");
        },
        error: function (Response, XMLHttpRequest, textStatus, errorThrown) {
            alert("Failed");
        }
    });


    var activeproject = $('#' + objModule.moduleid).closest('.clsproject');

    OpenExisting(createdBy, activeproject);

    $('#pasteVersions').addClass("disable");
}

function DeleteModelFlow(createdBy) {
    var r = confirm("Are you sure you want to delete selected Model Flow?");
    if (r == true) {
        deleteFlow($("#dropModelFlowOps").attr("data"), createdBy);
    }
}

function DeleteWithVersions(createdBy) {
    var r = confirm("Are you sure you want to delete all the versions of selected Model Flow?");
    if (r == true) {
        deleteAllVersions($("#dropCopyAllVersions").attr("ProjectID"), $("#dropCopyAllVersions").attr("ModuleID"), $("#dropCopyAllVersions").attr("ModelFlowID"), $("#dropCopyAllVersions").attr("FlowName"), createdBy);
    }
}

function CopyModelFlow() {
    if ($("#dropModelFlowOps").attr("tcase")) {
        localStorage.setItem("CopiedFlow", $("#dropModelFlowOps").attr("tcase"));
        localStorage.setItem("CopiedFlowDetails", $("#dropModelFlowOps").attr("data"));
        $('#pasteFlow').removeClass('disable');
    }
}

function DeleteModule(createdBy) {
    var r = confirm("Are you sure you want to delete the current module?");
    if (r == true) {
        deleteModule($("#dropModelFlow").attr("data"), createdBy);
    }
}

function PasteModelFlow(createdBy) {

    var objModule = JSON.parse($("#dropModelFlow").attr("data"));
    var listItems = $('#' + objModule.moduleid).next('ul');

    var projectId = objModule !== undefined && objModule !== null ? objModule.projectid : null;//$(obj).attr("projectid") !== undefined && $(obj).attr("projectid") !== null ? $(obj).attr("projectid") : null;
    var projectName = objModule !== undefined && objModule !== null ? objModule.projectname : null;//$(obj).attr("projectname") !== undefined && $(obj).attr("projectname") !== null ? $(obj).attr("projectname") : null;
    var projectVersion = objModule !== undefined && objModule !== null ? objModule.projectversion : null;
    var moduleId = objModule !== undefined && objModule !== null ? objModule.moduleid : null;//$(obj).attr("moduleid") !== undefined && $(obj).attr("moduleid") !== null ? $(obj).attr("moduleid") : null;
    var moduleName = objModule !== undefined && objModule !== null ? objModule.modulename : null;//$(obj).attr("modulename") !== undefined && $(obj).attr("modulename") !== null ? $(obj).attr("modulename") : null;
    var moduleVersion = objModule !== undefined && objModule !== null ? objModule.moduleversion : null;
    var modelflowId = null;
    var modelflowName = null;
    var modelflowVersion = null;


    var existsInDB = false;
    var ApiUrl = getURL();

    $.ajax({
        url: ApiUrl + '/TestProject/GetProjectDetails/' + createdBy,
        type: 'GET',
        async: false,
        success: function (data) {
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    if (objModule.projectid == data[i].projectsdetail.projectid) {
                        for (var j = 0; j < data[i].projectsdetail.module.length; j++) {
                            if (objModule.moduleid == data[i].projectsdetail.module[j].moduleid) {
                                for (var k = 0; k < data[i].projectsdetail.module[j].modelflow.length; k++) {
                                    if (data[i].projectsdetail.module[j].modelflow[k].modelflowname == JSON.parse(localStorage.getItem("CopiedFlowDetails")).modelflowname) {
                                        existsInDB = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        error: function (Response) {
            $('#lblErrOpen').css("visibility", "visible");
            $('#lblErrOpen').html("Oops! Something went wrong.");
        }
    });

    var version = "0";
    listItems.find("span").each(function (idx, li) {
        var existing = $(li).html();
        if (localStorage.getItem("CopiedFlowDetails").modelflowname == existing) {
            var versions = existing.next('ul');
            versions.find("span").each(function (idx, li) {
                version = li.data.modelflowversion;
            });
            parseInt(version)++;
        }
    });

    modelflowId = GetGuid();
    if (!existsInDB) {
        modelflowName = JSON.parse(localStorage.getItem("CopiedFlowDetails")).modelflowname;
    }
    else {
        modelflowName = JSON.parse(localStorage.getItem("CopiedFlowDetails")).modelflowname + "_Copy";
    }
    modelflowVersion = version.toString();
    var liModule = document.createElement("li");
    var spanModule = document.createElement("span");
    var newModelFlowList = document.createElement("UL");

    liModule.appendChild(spanModule);
    $(liModule).css("display", "list-item");

    var objModelflow = {
        projectid: projectId,
        projectname: projectName,
        projectversion: projectVersion,
        moduleid: moduleId,
        modulename: moduleName,
        moduleversion: moduleVersion,
        modelflowid: modelflowId,
        modelflowname: modelflowName,
        modelflowversion: modelflowVersion
    };

    var objMF = JSON.stringify(objModelflow);

    spanModule.innerText = modelflowName;//$('#txtModelFlow').val();
    $(spanModule).attr("data", objMF);
    $(spanModule).attr("id", modelflowId);

    $('#createFlowTree' + objModule.moduleid).append(liModule);
    $('#createFlowTree' + objModule.moduleid + " li").css("display", "list-item");

    $(spanModule).attr("onclick", "drawingAreaReady(this,'" + createdBy + "')");
    $(spanModule).addClass("span");
    if (modelflowName.length > 10) {
        $(spanModule).addClass("texttitle");
        $(spanModule).attr("title", modelflowName);
    }
    $(spanModule).addClass("flowElement");
    $('.flowElement').removeClass("activeElement");
    $(spanModule).addClass("activeElement");

    $(spanModule).attr("tcase", localStorage.getItem("CopiedFlow"));

    $("#drawingArea").css("visibility", "visible");
    $(".pull-left div").show();
    $(".pull-left div").css("display", "inline");
    $(".pull-right").show();

    drawingAreaReady($(spanModule), createdBy);
    $('#generateTCasesButton').hide();
    $('#btnTestSuit').hide();
    $('#regAnalysisButton').hide();
    $('#saveNUpdateButton').show();
    $('#saveButton').show();

    $('#pasteFlow').addClass("disable");
}

function DeleteProject() {
    var r = confirm("Are you sure you want to delete the current Project?");
    if (r == true) {
        deleteCurrProject($("#dropModule").attr("data"));
    }
}

function RenameProject() {
    $(".zoombuttons").show();
    $('#txtRenameProject').val("");

    $('.footer-disabled').find("button").attr("disabled", "disabled");
    $('#lblErr').css("visibility", "hidden");

    $('#RenameProject').on('shown.bs.modal', function () {
        $('#txtRenameProject').focus();
    });

    $('#RenameProject').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });

    $('.footer-disabled').find("button").attr("data", $("#dropModule").attr("data"));
}

function renameProject(obj, createdBy) {
    $('#lblErrRenameProject').css("visibility", "hidden");
    var Details = JSON.parse($(obj).attr("data"));

    var existsInDB = false;
    var ApiUrl = getURL();

    $.ajax({
        url: ApiUrl + '/TestProject/GetProjectDetails/' + createdBy,
        type: 'GET',
        async: false,
        success: function (data) {
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    if ($("#txtRenameProject").val() == data[i].projectsdetail.name) {
                        existsInDB = true;

                    }
                }
            }
        },
        error: function (Response) {
            $('#lblErrRenameProject').css("visibility", "visible");
            $('#lblErrRenameProject').html("Oops! Something went wrong.");
        }
    });

    if (!existsInDB) {
        var url = getURL();

        $.ajax({
            url: url + '/TestProject/RenameProjectDetail/' + Details.projectid + '/' + $("#txtRenameProject").val(),
            type: 'PUT',
            async: false,
            success: function (Response, XMLHttpRequest, textStatus, errorThrown) {
                alert("Project was renamed successfully");
                var activeproject = $('#' + Details.projectid).closest('.clsproject');
                OpenExisting(createdBy, activeproject);
            },
            error: function (Response, XMLHttpRequest, textStatus, errorThrown) {
                alert("Failed");
            }
        });
    }
    else {
        $('.footer-disabled').find("button").attr("disabled", "disabled");
        $('#txtRenameProject').val("");
        $('#txtRenameProject').focus();
        $('#lblErrRenameProject').css("visibility", "visible");
        $('#lblErrRenameProject').html("Project exists with the same name!");
    }

}

function deleteFlow(project, createdBy) {

    var ProjectDetails = JSON.parse(project);
    var ModelflowDTO = {
        "modelflowid": ProjectDetails.modelflowid,
        "modelflowname": ProjectDetails.modelflowname !== undefined && ProjectDetails.modelflowname !== null ? ProjectDetails.modelflowname : "NA",
        "description": "Deleting model flow",
        "version": ProjectDetails.modelflowversion,
        "nodes": "",
        "connections": "",
        "numberOfElements": ""
    }

    var activeproject = $('#' + ProjectDetails.modelflowid).closest('.clsproject');
    var url = getURL();

    $.ajax({
        url: url + '/TestProject/DeleteModelFlowDetail/' + ProjectDetails.projectid + '/' + ProjectDetails.moduleid + '/' + ProjectDetails.modulename,
        type: 'PUT',
        data: ModelflowDTO,
        async: false,
        success: function (Response, XMLHttpRequest, textStatus, errorThrown) {
            alert("Flow was deleted successfully!");
        },
        error: function (Response, XMLHttpRequest, textStatus, errorThrown) {
            alert("Failed");
        }
    })

    OpenExisting(createdBy, activeproject);
    $("#" + ProjectDetails.modelflowid).closest('.clsproject').addClass("activeproject");


}

function deleteAllVersions(projectid, moduleid, flowid, flowname, createdBy) {

    var activeproject = $('#' + flowid).closest('.clsproject');
    var url = getURL();

    $.ajax({
        url: url + '/TestProject/DeleteAllVersions/' + projectid + '/' + moduleid + '/' + flowname,
        type: 'PUT',
        async: false,
        success: function (Response, XMLHttpRequest, textStatus, errorThrown) {
            alert("Flow with all its versions was deleted successfully!");
        },
        error: function (Response, XMLHttpRequest, textStatus, errorThrown) {
            alert("Failed");
        }
    })
    OpenExisting(createdBy, activeproject);

}


function deleteModule(projectdetails, createdBy) {
    var Details = JSON.parse(projectdetails);
    var deleted=false;

    var ModelDTO = {
        "moduleid": Details.moduleid,
        "name": Details.modulename,
        "description": "Creating new module",
        "version": Details.moduleversion
    }

    var activeproject = $('#' + Details.moduleid).closest('.clsproject');
    var url = getURL();

    $.ajax({
        url: url + '/TestProject/DeleteModuleDetail/' + Details.projectid,
        type: 'PUT',
        data: ModelDTO,
        async: false,
        success: function (Response, XMLHttpRequest, textStatus, errorThrown) {
            deleted = true;
        },
        error: function (Response, XMLHttpRequest, textStatus, errorThrown) {
            alert("Failed");
        }
    })

    OpenExisting(createdBy, activeproject);

    if (deleted) {
        alert(Details.modulename + " was deleted succesfully!");
    }
}


function deleteCurrProject(projectdetails) {
    var Details = JSON.parse(projectdetails);
    var deleted = false;
    var ProjectDTO = {
        "projectid": Details.projectid,
        "name": Details.projectname,
        "description": "Creating new test project",
        "createdBy": "",
        "version": Details.projectversion
    }

    var url = getURL();

    $.ajax({
        url: url + '/TestProject/DeleteProjectDetail/' + Details.projectid,
        type: 'PUT',
        data: ProjectDTO,
        async: false,
        success: function (Response, XMLHttpRequest, textStatus, errorThrown) {
            deleted = true;
        },
        error: function (Response, XMLHttpRequest, textStatus, errorThrown) {
            alert("Failed");
        }
    })
    var x = $('#' + Details.projectid);

    for (var i = 0; i < $(x.parent().parent()).children().length; i++) {
        if ($(x.parent().parent()).children()[i].children[0].id == Details.projectid) {
            $(x.parent().parent()).children()[i].remove();
        }
    }
    if (deleted) {
        alert(Details.projectname + " was deleted succesfully!");
        $("#drawingArea").hide();
        $("#divRegAnalysis").hide();
        $('#rightCheckBoxBar').hide();
        $(".pull-left div").hide();
        $(".pull-right").hide();
    }
}

function funcDropdownAddExpResnTdata(e, obj) {
    //debugger;
    e.preventDefault();

    $("#dropAddResultnData li").attr("spanId", $(obj).attr("id"));
    $("#dropAddResultnData li").attr("tcase", $(obj).attr("flow"));
    $("#dropAddResultnData").css("left", e.clientX);
    $("#dropAddResultnData").css("top", e.clientY);
    $("#dropAddResultnData").fadeIn(200, startFocusOut());
    $("#dropModule").css("display", "none");
    $("#dropModelProject").css("display", "none");
    $("#dropModelFlow").css("display", "none");
}


function funcPrepTestSuite() {
    $('#btnAddFlow').show();
    $('#btnAssFlow').show();
    $('#btnE2ECases').show();
    var JSONflow = '{\"nodes\":[{\"blockId\":\"startpoint\",\"nodetype\":\"startpoint\",\"positionX\":419,\"positionY\":50,\"DisplayText\":\"\"},{\"blockId\":\"endpoint\",\"nodetype\":\"endpoint\",\"positionX\":425,\"positionY\":500,\"DisplayText\":\"\"}],\"connections\":[],\"numberOfElements\":0}'
    loadFlowchart(JSON.parse(JSONflow));
}



function startFocusOut() {
    $(document).on("click", function (e) {
        $("#dropModule").hide();
        $("#dropModelFlow").hide();
        $("#dropModelProject").hide();
        $("#dropAddResultnData").hide();
        $("#dropModelFlowOps").hide();
        $("#dropCopyAllVersions").hide();
        $(".droptoggles").removeClass("active");
        $("#dropReq").hide();  
        $(document).off("click");
    });
}


$("body").click(function (e) {
    if (e.target.id == "dropScripts" || $(e.target).parents("#dropScripts").length) {
        
    } else {
        $("#dropScripts").hide(); 
    }
});


function AddModule() {
    $('#txtModuleName').val("");

    $('.footer-disabled').find("button").attr("disabled", "disabled");
    $('#lblErrMo').css("visibility", "hidden");
    $('.footer-disabled').find("button").attr("spanId", $("#dropModule").attr("spanId"));
    $('.footer-disabled').find("button").attr("data", $("#dropModule").attr("data"));

    $('#CreateModule').on('shown.bs.modal', function () {
        $('#txtModuleName').focus();
    });

    ////open the table as dialog box
    $('#CreateModule').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });
}


function newModule(obj) {
    //debugger;
    var objProject = $(obj).attr("data") !== undefined && $(obj).attr("data") !== null ? JSON.parse($(obj).attr("data")) : null;
    var listItems = $('#' + $(obj).attr("spanId")).next('ul');
    var err = false;

    var projectId = objProject !== undefined && objProject !== null ? objProject.projectid : null;
    var projectName = objProject !== undefined && objProject !== null ? objProject.projectname : null;
    var projectVersion = objProject !== undefined && objProject !== null ? objProject.projectversion : null;
    var moduleId = null;
    var moduleName = null;
    var moduleVersion = null;

    if (!$('#txtModuleName').val().trim()) {
        $('.footer-disabled').find("button").attr("disabled", "disabled");
        $('#txtModuleName').val("");
        $('#txtModuleName').focus();
        $('#lblErrMo').css("visibility", "visible");
        $('#lblErrMo').html("Please enter a proper name for the module!");
        err = true;
    }

    listItems.find("span").each(function (idx, li) {
        var existing = $(li).html();
        if ($('#txtModuleName').val() == existing && $(li).parent().parent().attr("id").indexOf("createModuleTree") > -1) {
            $('.footer-disabled').find("button").attr("disabled", "disabled");
            $('#txtModuleName').val("");
            $('#txtModuleName').focus();
            $('#lblErrMo').css("visibility", "visible");
            $('#lblErrMo').html("Module with the same name exists in this project!");
            err = true;
        }
    });

    if (!err) {

        moduleId = GetGuid();
        moduleName = $('#txtModuleName').val().trim();

        var liModule = document.createElement("li");
        var spanModule = document.createElement("span");
        var newModelFlowList = document.createElement("UL");

        var objProj = {
            projectid: projectId,
            projectname: projectName,
            projectversion: projectVersion,
            moduleid: moduleId,
            modulename: moduleName,
            moduleversion: moduleVersion,
            modelflowid: null,
            modelflowname: null,
            modelflowversion: null
        };

        var objP = JSON.stringify(objProj);

        $(spanModule).attr("id", moduleId);
        $(spanModule).attr("data", objP);
        liModule.appendChild(spanModule);

        spanModule.innerText = moduleName;

        $(spanModule).attr("oncontextmenu", "funcDropdownFlow(event,this)");
        $(spanModule).attr("onclick", "collapseExpand(event,this)");
        $(spanModule).addClass("span");
        if (moduleName.length > 10) {
            $(spanModule).addClass("texttitle");
            $(spanModule).attr("title", moduleName);
        }
        $(liModule).attr("class", "parent_li");
        $(liModule).css("display", "list-item");

        liModule.appendChild(newModelFlowList);

        var ModelDTO = {
            "moduleid": moduleId,
            "name": moduleName,
            "description": "Creating new module",
            "version": moduleVersion
        }

        var url = getURL();

        $.ajax({
            url: url + '/TestProject/UpdateModuleDetail/' + projectId,
            type: 'PUT',
            data: ModelDTO,
            async: false,
            success: function (Response, XMLHttpRequest, textStatus, errorThrown) {

                if ($('#' + $(obj).attr("spanId")).next('ul').children().length > 0) {
                    $('#' + $(obj).attr("spanId")).next('ul').children()[0].children[1].append(liModule);
                }
                else {
                    var liModuleMain = document.createElement("li");
                    var spanModuleMain = document.createElement("span");
                    var newmoduleListMain = document.createElement("UL");

                    liModuleMain.appendChild(spanModuleMain);
                    spanModuleMain.innerText = "Modules";
                    $(spanModuleMain).attr("onclick", "collapseExpand(event,this)");
                    $(spanModuleMain).addClass("span orange");

                    $(newmoduleListMain).attr("id", "createModuleTree" + 0);
                    $(newmoduleListMain).attr("class", "childhidden");

                    $(liModuleMain).attr("class", "parent_li");

                    liModuleMain.appendChild(newmoduleListMain);
                    $(liModuleMain).css("display", "list-item");

                    $('#' + $(obj).attr("spanId")).next('ul').append(liModuleMain);
                    $('#' + $(obj).attr("spanId")).next('ul').children()[0].children[1].append(liModule);
                }
            },
            error: function (Response, XMLHttpRequest, textStatus, errorThrown) {
                alert("Failed");
            }
        })
    }
}

function AddModelFlow() {

    $('#txtModelFlow').val("");

    $('.footer-disabled').find("button").attr("disabled", "disabled");
    $('#lblErr').css("visibility", "hidden");

    $('#CreateModelFlow').on('shown.bs.modal', function () {
        $('#txtModelFlow').focus();
    });

    $('#CreateModelFlow').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });
    $('.footer-disabled').find("button").attr("spanId", $("#dropModelFlow").attr("spanId"));
    $('.footer-disabled').find("button").attr("data", $("#dropModelFlow").attr("data"));
}

function AddProject() {
    $('#txtProjectName').val("");

    $('.footer-disabled').find("button").attr("disabled", "disabled");
    $('#lblErrPr').css("visibility", "hidden");
    $('#CreateProject').on('shown.bs.modal', function () {
        $('#txtProjectName').focus();
    });
    $('#CreateProject').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });
}

function AddRequirement() {
    $(".zoombuttons").show();
    $('#txtRequirementName').val("");
    $('#txtDesc').val("");
    $('#txtAccCriteria').val("");

    $('#editReq').hide();
    $('#createReq').show();

    $('.footer-disabled').find("button").attr("disabled", "disabled");
    $('#lblErr').css("visibility", "hidden");

    $('#CreateRequirement').on('shown.bs.modal', function () {
        $('#txtRequirementName').focus();
    });

    $('#CreateRequirement').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });
    $('.footer-disabled').find("button").attr("spanId", $("#dropModelFlow").attr("spanId"));
    $('.footer-disabled').find("button").attr("data", $("#dropModelFlow").attr("data"));
}

function createRequirement(obj, createdBy) {
    var objModule = JSON.parse($(obj).attr("data"));
    var listItems = $('#' + $(obj).attr("spanId")).next('ul');

    var projectId = objModule !== undefined && objModule !== null ? objModule.projectid : null;//$(obj).attr("projectid") !== undefined && $(obj).attr("projectid") !== null ? $(obj).attr("projectid") : null;
    var projectName = objModule !== undefined && objModule !== null ? objModule.projectname : null;//$(obj).attr("projectname") !== undefined && $(obj).attr("projectname") !== null ? $(obj).attr("projectname") : null;
    var projectVersion = objModule !== undefined && objModule !== null ? objModule.projectversion : null;
    var moduleId = objModule !== undefined && objModule !== null ? objModule.moduleid : null;//$(obj).attr("moduleid") !== undefined && $(obj).attr("moduleid") !== null ? $(obj).attr("moduleid") : null;
    var moduleName = objModule !== undefined && objModule !== null ? objModule.modulename : null;//$(obj).attr("modulename") !== undefined && $(obj).attr("modulename") !== null ? $(obj).attr("modulename") : null;
    var moduleVersion = objModule !== undefined && objModule !== null ? objModule.moduleversion : null;
    var modelflowId = null;
    var modelflowName = null;
    var modelflowVersion = null;
    var reqId = null;
    var reqName = null;
    var description = null; var accCriteria = null;

    if (!$('#txtRequirementName').val().trim()) {
        $('.footer-disabled').find("button").attr("disabled", "disabled");
        $('#txtRequirementName').val("");
        $('#txtRequirementName').focus();
        $('#lblErr').css("visibility", "visible");
        $('#lblErr').html("Please enter a proper name for the Flow!");
        err = true;
    }

    var err = false;
    listItems.find("span").each(function (idx, li) {
        var existing = $(li).html();
        if ($('#txtRequirementName').val() == existing) {
            $('.footer-disabled').find("button").attr("disabled", "disabled");
            $('#txtRequirementName').val("");
            $('#txtRequirementName').focus();
            $('#lblErr').css("visibility", "visible");
            $('#lblErr').html("Requirement with the same name exists in this Module!");
            err = true;
        }
    });

    if (!err) {
        if ($(obj).attr('id') == "createReq") {
            reqId = GetGuid();
        }
        else if ($(obj).attr('id') == "editReq") {
            var jsondata = JSON.parse($(obj).attr('data'));
            reqId = jsondata.reqid;
        }

        reqName = $('#txtRequirementName').val();
        description = $('#txtDesc').val();
        accCriteria = $('#txtAccCriteria').val();
        var liModule = document.createElement("li");
        var spanModule = document.createElement("span");
        var newModelFlowList = document.createElement("UL");

        liModule.appendChild(spanModule);

        var objReq = {
            projectid: projectId,
            projectname: projectName,
            projectversion: projectVersion,
            moduleid: moduleId,
            modulename: moduleName,
            moduleversion: moduleVersion,
            reqid: reqId,
            reqname: reqName,
            description: description,
            accCriteria: accCriteria
        };

        var objRQ = JSON.stringify(objReq);

        spanModule.innerText = reqName;//$('#txtModelFlow').val();
        $(spanModule).attr("data", objRQ);
        $(spanModule).attr("id", reqId);
        $(liModule).css("display", "inline-block");

        if ($('#createReqTree' + moduleId).attr("id") == null) {
            var liModelflowMain = document.createElement("li");
            var spanModelflowMain = document.createElement("span");
            var newModelflowMain = document.createElement("UL");

            liModelflowMain.appendChild(spanModelflowMain);
            spanModelflowMain.innerText = "Requirements";
            $(spanModelflowMain).attr("onclick", "collapseExpand(event,this)");
            $(spanModelflowMain).addClass("span orange");

            $(newModelflowMain).attr("id", "Req" + moduleId);
            $(newModelflowMain).attr("class", "childhidden");

            $(liModelflowMain).attr("class", "parent_li");

            $(liModelflowMain).css("display", "inline-block");

            $('#' + $(obj).attr("spanId")).next('ul').append(liModelflowMain);
            liModelflowMain.append(newModelflowMain);
            newModelflowMain.appendChild(liModule);
        }
        else {
            $('#createReqTree' + moduleId).append(liModule);
            $('#createReqTree' + moduleId).parent().css("display", "inline-block");
        }

        $(spanModule).addClass("span");
        if (reqName.length > 10) {
            $(spanModule).addClass("texttitle");
            $(spanModule).attr("title", reqName);
        }

        var RequirementsDTO = {
            "reqid": reqId,
            "reqname": reqName,
            "description": description,
            "accCriteria": accCriteria
        }


        var bPublish = false;

        if ($(obj).attr('id') == "createReq") {
            bPublish = true;
        }
        else if ($(obj).attr('id') == "editReq") {
            bPublish = false;
        }
        var url = getURL();

        $.ajax({
            url: url + '/TestProject/UpdateReq/' + projectId + '/' + moduleId + '/' + moduleName + '/' + bPublish,
            type: 'PUT',
            data: RequirementsDTO,
            async: false,
            success: function (Response, XMLHttpRequest, textStatus, errorThrown) {
                alert("Your Action was completed successfully!");
            },
            error: function (Response, XMLHttpRequest, textStatus, errorThrown) {
                alert("Failed");
            }
        });
        var activeproject = $('#' + moduleId).closest('.clsproject');
        OpenExisting(createdBy, activeproject);

    }


}



function newFlow(obj) {
    //debugger;
    $(".zoombuttons").show();
    if ($('#liAddModFlow').attr("unsaved") != "true") {
        var objModule = JSON.parse($(obj).attr("data"));
        var listItems = $('#' + $(obj).attr("spanId")).next('ul');

        var projectId = objModule !== undefined && objModule !== null ? objModule.projectid : null;//$(obj).attr("projectid") !== undefined && $(obj).attr("projectid") !== null ? $(obj).attr("projectid") : null;
        var projectName = objModule !== undefined && objModule !== null ? objModule.projectname : null;//$(obj).attr("projectname") !== undefined && $(obj).attr("projectname") !== null ? $(obj).attr("projectname") : null;
        var projectVersion = objModule !== undefined && objModule !== null ? objModule.projectversion : null;
        var moduleId = objModule !== undefined && objModule !== null ? objModule.moduleid : null;//$(obj).attr("moduleid") !== undefined && $(obj).attr("moduleid") !== null ? $(obj).attr("moduleid") : null;
        var moduleName = objModule !== undefined && objModule !== null ? objModule.modulename : null;//$(obj).attr("modulename") !== undefined && $(obj).attr("modulename") !== null ? $(obj).attr("modulename") : null;
        var moduleVersion = objModule !== undefined && objModule !== null ? objModule.moduleversion : null;
        var modelflowId = null;
        var modelflowName = null;
        var modelflowVersion = null;

        if (!$('#txtModelFlow').val().trim()) {
            $('.footer-disabled').find("button").attr("disabled", "disabled");
            $('#txtModelFlow').val("");
            $('#txtModelFlow').focus();
            $('#lblErr').css("visibility", "visible");
            $('#lblErr').html("Please enter a proper name for the Flow!");
            err = true;
        }

        var err = false;
        listItems.find("span").each(function (idx, li) {
            var existing = $(li).html();
            if ($('#txtModelFlow').val() == existing) {
                $('.footer-disabled').find("button").attr("disabled", "disabled");
                $('#txtModelFlow').val("");
                $('#txtModelFlow').focus();
                $('#lblErr').css("visibility", "visible");
                $('#lblErr').html("Model Flow with the same name exists in this Module!");
                err = true;
            }
        });

        if (!err) {

            modelflowId = GetGuid();
            modelflowName = $('#txtModelFlow').val();
            modelflowVersion = "0";
            var liModule = document.createElement("li");
            var spanModule = document.createElement("span");
            var newModelFlowList = document.createElement("UL");

            liModule.appendChild(spanModule);

            var objModelflow = {
                projectid: projectId,
                projectname: projectName,
                projectversion: projectVersion,
                moduleid: moduleId,
                modulename: moduleName,
                moduleversion: moduleVersion,
                modelflowid: modelflowId,
                modelflowname: modelflowName,
                modelflowversion: modelflowVersion
            };

            var objMF = JSON.stringify(objModelflow);

            spanModule.innerText = modelflowName;//$('#txtModelFlow').val();
            $(spanModule).attr("data", objMF);
            $(spanModule).attr("id", modelflowId);
            $(liModule).css("display", "inline-block");


            if ($('#createFlowTree' + moduleId).attr("id") == null) {
                var liModelflowMain = document.createElement("li");
                var spanModelflowMain = document.createElement("span");
                var newModelflowMain = document.createElement("UL");

                liModelflowMain.appendChild(spanModelflowMain);
                spanModelflowMain.innerText = "Model Flows";
                $(spanModelflowMain).attr("onclick", "collapseExpand(event,this)");
                $(spanModelflowMain).addClass("span orange");

                $(newModelflowMain).attr("id", "createFlowTree" + moduleId);
                $(newModelflowMain).attr("class", "childhidden");

                $(liModelflowMain).attr("class", "parent_li");

                $(liModelflowMain).css("display", "inline-block");

                $('#' + $(obj).attr("spanId")).next('ul').append(liModelflowMain);
                liModelflowMain.append(newModelflowMain);
                newModelflowMain.appendChild(liModule);
            }
            else {
                $('#createFlowTree' + moduleId).append(liModule);
                $('#createFlowTree' + moduleId).parent().css("display", "inline-block");
            }

            $(spanModule).attr("onclick", "drawingAreaReady(this," + null + ")");
            $(spanModule).addClass("span");
            if (modelflowName.length > 10) {
                $(spanModule).addClass("texttitle");
                $(spanModule).attr("title", modelflowName);
            }
            $(spanModule).addClass("flowElement");
            $('.flowElement').removeClass("activeElement");
            $(spanModule).addClass("activeElement");

            $(spanModule).attr("tcase", '{"nodes":[{"blockId":"startpoint","nodetype":"startpoint","positionX":400,"positionY":50,"DisplayText":""},{"blockId":"endpoint","nodetype":"endpoint","positionX":400,"positionY":480,"DisplayText":""}],"connections":[],"numberOfElements":0}');

            $("#drawingArea").css("visibility", "visible");
            $(".pull-left div").show();
            $(".pull-left div").css("display", "inline");
            $(".pull-right").show();

            drawingAreaReady($(spanModule), null);

            $('#liAddModFlow').attr("unsaved", "true");
            $('#regAnalysisButton').hide();

        }
    }
    else {
        alert("Please Save previously created Model Flow first before adding new flow!")
    }
}



$('#CreateModule').on('shown.bs.modal', function () {
    $('#txtModuleName').focus();
});
$('#CreateModelFlow').on('shown.bs.modal', function () {
    $('#txtModelFlow').focus();
});
$('#CreateProject').on('shown.bs.modal', function () {
    $('#txtProjectName').focus();
});





$('#btnOpenFloat').on("click", function () {
    $(".btnsFloat").show();
    $('#btnOpenFloat').hide();
    $("#btnCloseFloat").show();
});

$('#btnCloseFloat').on("click", function () {
    $(".btnsFloat").hide();
    $('#btnOpenFloat').show();
    $("#btnCloseFloat").hide();
});

function shareWithModal() {
    $('#txtPSID').val("");

    $('.footer-disabled').find("button").attr("disabled", "disabled");
    $('#lblErrPr').css("visibility", "hidden");
    var data = $("#dropModule").attr("data");
    $('#btnShare').attr("project", JSON.parse(data).projectid);
    $('#ShareWithDialog').on('shown.bs.modal', function () {
        $('#txtPSID').focus();
    });
    $('#ShareWithDialog').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });
}

function ShareWith(createdBy) {

    //var domain = createdBy.substring(0, createdBy.indexOf("-") + 1);

    var element = $('#sharedWithList li:contains("' + $('#txtPSID').val() + '")');
    var ApiUrl = getURL();

    if (element.length == 0) {
        $.ajax({
            url: ApiUrl + '/TestProject/ShareWith/' + $('#txtPSID').val() + '/' + $('#btnShare').attr("project"),
            type: 'POST',
            async: false,
            success: function (data) {
                if (data) {
                    alert("Current Project will now be accessible to " + data.substring(0, data.length-1)+".");
                    getSharedWith($('#btnShare').attr("project"), createdBy);
                    $(".divSharedWith").show();
                    if (".activeElement") {
                        $(".pull-right").show();
                    }
                }
                else {
                    alert("Please Enter a Valid UserId. Project can only be shared with Employees of your Company!");
                }
            },
            error: function (Response) {
                alert("Failed!")
            }
        });
    }
    else {
        alert("This project is already shared with " + $('#txtPSID').val());
    }


}

function getSharedWith(projectid, createdBy) {
    var ApiUrl = getURL();

    $.ajax({
        url: ApiUrl + '/TestProject/getSharedWith/' + projectid + '/' + createdBy,
        type: 'GET',
        async: false,
        success: function (data) {
            $("#sharedWithList").html("");
            var accessusers = [];
            if (data != null)
                accessusers = data.split(",");
            if (accessusers.length > 1) {
                for (var i = 0; i < accessusers.length; i++) {
                    if (accessusers[i] != "")
                        $("#sharedWithList").append("<li projectid='" + projectid + "'>" + accessusers[i] + "<span class='close' onclick='deleteLi(this)'>&times;</span></li>");

                }
            }
            else {
                $('.divSharedWith').hide();
            }
        },
        failure: function (Response) { }
    });
}

function deleteLi(obj) {
    var psid = $(obj).parent()[0].innerText.substring(0, $(obj).parent()[0].innerText.length - 1);
    var projectid = $($(obj).parent()[0]).attr("projectid");
    var r = confirm("Are you sure you want to revoke access from user " + psid + " to this project?");
    if (r == true) {
        var ApiUrl = getURL();

        $.ajax({
            url: ApiUrl + '/TestProject/RevokeAcess/' + projectid + '/' + psid.replace("\\", "-"),
            type: 'PUT',
            success: function (data) {
                alert(psid + " will not be able to access this project anymore.");
            },
            error: function (response) { alert("Failed!") }
        });

        if ($(obj).parent().parent().children().length == 1) {
            $('.pull-right').hide();
        }
        $(obj).parent().remove();

    }
}


function fndropScripts(e, obj) {
    //debugger;
    e.preventDefault();

    var keyword = $(obj).attr("keyword").split("|");
    var jscript = $(obj).attr("jscript").split("|");
    var pscript = ($(obj).attr("pscript").split("|"));
    var csscript = ($(obj).attr("csscript").split("|"));
    var vbscript = ($(obj).attr("vbscript").split("|"));
    $("#dropScripts").attr("gearActive", $(obj).attr("id"));
    $("#dropScripts .items").html("");
    for (var i = 0; i < keyword.length; i++)
    {
        if (/*jscript[i] != "" &&*/ keyword[i] != "" /*&& pscript[i]!=""*/) {
            var li = $("<li></li>");
            var input = $("<input type='checkbox' name='fooby[1][]' onclick='fnChkOne(this)' vbscript ='" + vbscript[i] + "' csscript ='" + csscript[i] + "'  jscript='" + jscript[i] + "'pscript='" + pscript[i].replace(/\'/g, "&#8217;") + "'></input>");
            $(li).append(input);
            $(li).html($(li).html()+keyword[i]);            
            $("#dropScripts .items").append(li)
        }
    }

    if ($(obj).attr("selectedVal")) {
        var li = $("#dropScripts .items").find('li').each(function () {
            if ($(this).text() == $(obj).attr("selectedVal"))
                $($(this).children()[0]).attr("checked", "checked");
        });
    }
    else if (keyword.length > 0) {
        $($($("#dropScripts .items").children()[0]).children()[0]).attr("checked", "checked");
        $("#dropScripts").attr("selectedVal", $($("#dropScripts .items").children()[0]).text());
        $(obj).attr("selectedVal", $($("#dropScripts .items").children()[0]).text());
        $(obj).attr("selectedJ", ($($("#dropScripts .items").children()[0]).attr("jscript")));
        $(obj).attr("selectedP", ($($("#dropScripts .items").children()[0]).attr("pscript")));
        $(obj).attr("selectedCs", ($($("#dropScripts .items").children()[0]).attr("csscript")));
        $(obj).attr("selectedVb", ($($("#dropScripts .items").children()[0]).attr("vbscript")));
    }

    $(".contextmenucustom").css("display", "none");
    $("#dropScripts").css("left", e.clientX);
    $("#dropScripts").css("top", e.clientY);
    $("#dropScripts").fadeIn(200, startFocusOut());
}

function fnChkOne(obj) {
    // in the handler, 'this' refers to the box clicked on
    var $box = $(obj);
    if ($box.is(":checked")) {
        // the name of the box is retrieved using the .attr() method
        // as it is assumed and expected to be immutable
        var group = "input:checkbox[name='" + $box.attr("name") + "']";
        // the checked state of the group/box on the other hand will change
        // and the current value is retrieved using .prop() method
        $(group).prop("checked", false);
        $box.prop("checked", true);
        $("#" + $("#dropScripts").attr("gearActive")).attr("selectedVal", $($box.parent()).text());
        $("#" + $("#dropScripts").attr("gearActive")).attr("selectedJ", ($box.attr("jscript")));
        $("#" + $("#dropScripts").attr("gearActive")).attr("selectedP", ($box.attr("pscript")));
        $("#" + $("#dropScripts").attr("gearActive")).attr("selectedCs", ($box.attr("csscript")));
        $("#" + $("#dropScripts").attr("gearActive")).attr("selectedVb", ($box.attr("vbscript")));
    } else {
        $box.prop("checked", false);
    }
}

$("#lnkLicenseInfo").on("click", function (e) {
    e.preventDefault();
    $('#LicenseInfo').modal({
        show: true,
        backdrop: 'static',
        keyboard: true
    });

});

function dismissmodal(obj,e) {
    if (e.keyCode == 13) {
        if ($("#"+$(obj).attr("id") + " .modal-footer" + " .btn").attr("disabled")!="disabled")
            $("#"+$(obj).attr("id") + " .modal-footer" + " .btn").click();
    }
}