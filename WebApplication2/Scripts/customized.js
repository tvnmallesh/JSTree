/* customized.js
 *
 This is a custom js file and contains mostly UI/UX specific methods
*/

$(function () {
    "use strict";

    //Left Section Tree Logic Starts here

    //$('.treedropdown li:has(ul)').addClass('parent_li').find(' > .span').attr('title', 'Collapse this branch');
    $('.treedropdown li:has(ul)').addClass('parent_li').find(' > .span');
    $('.treedropdown li.parent_li > .span').on('click', function (e) {
        var children = $(this).parent('li.parent_li').find(' > ul > li');
        if (children.is(":visible")) {
            children.hide('fast');

        } else {
            children.show('fast');

        }
        e.stopPropagation();
    });

    //Scrollbar logic starts here

    $('#content-scroll').mCustomScrollbar({
        theme: 'dark-3',
        axis: "yx",
        scrollbarPosition: "outside",
        autoDraggerLength: true

    });

    // Project Popup modal Starts here

    $(".level").on('click mouseenter', function () {
        $(this).toggleClass("active");
    });
    $(".level").on('mouseleave', function () {
        $(this).removeClass("active");
    });

    $(".panel").on('click', function (e) {
        var target = $(e.target);
        if (!target.is(".admin")) {
            $('.level.active').removeClass("active");
        }
    });
    $('[data-toggle="tooltip"]').tooltip();
});



/* Sidebar */
function openNav() {
    document.getElementById("mySidenav").style.width = "240px";
    document.getElementById("hamburgerbtn").style.display = "none";
    document.getElementById("mainhead").style.marginLeft = "240px";
    document.getElementById("mySidenav").style.marginTop = "26px";
    document.getElementById("parentDrawing").style.margin = "0 auto";
    $('.flowdiagram').css("margin-top", "80px");
    $('.flowdiagram').css("margin-left", "240px");
}


function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("mainhead").style.marginLeft = "0";
    document.getElementById("hamburgerbtn").style.display = "inline-block";
    document.body.style.backgroundColor = "white";
    document.getElementById("parentDrawing").style.margin = "0";
    $('.flowdiagram').css("margin-top", "80px");
}
function checkBox() {
    document.getElementById("rightCheckBoxBar").style.display = "inline-block";
    document.getElementById("leftcolumn").style.width = "81.80%";
}

function removeCheckBox() {
    document.getElementById("rightCheckBoxBar").style.display = "none";
}

/* sidebar ends*/
/* more button*/
$(document).ready(function () {

    $(".drop").click(function () {

        var x = $("#regression").text();

        $("#regression").text($(this).text());
        $(this).text(x);


    });


});

// prevents quotes(' or ") to be entered in any type of input field
function restrictq(e) {
    if (e.which == 222 || (e.which == 55 && e.shiftKey == true) || (e.which == 57 && e.shiftKey == true) || (e.which == 48 && e.shiftKey == true)) {
        e.preventDefault();
        return false;
    }
}

$(function () {
    $('.tree li:has(ul)').addClass('parent_li').find(' > span');
    $('.tree li.parent_li > span').on('click', function (e) {
        var children = $(this).parent('li.parent_li').find(' > ul > li');
        if (children.is(":visible")) {
            children.hide('fast');
            $(this).find(' > i').addClass('icon-plus-sign').removeClass('icon-minus-sign');
        } else {
            children.show('fast');
            $(this).find(' > i').addClass('icon-minus-sign').removeClass('icon-plus-sign');
        }
        e.stopPropagation();
    });
});



function collapseExpand(e, obj) {
    var children = $(obj).parent('li.parent_li').find(' > ul > li');

    //$("."+$(children[0]).attr("class") + " .childhidden .parent_li").css("display", "list-item");

    if ($(obj).find(' > ul > li').hasClass("orange")) {
        $(obj).find(' > ul > li > .childhidden > .parent_li').css("display", "list-item");
    }
    if (children.is(":visible")) {
        children.hide('fast');
        $(obj).find(' > i').addClass('icon-plus-sign').removeClass('icon-minus-sign');
    } else {
        children.show('fast');
        $(obj).find(' > i').addClass('icon-minus-sign').removeClass('icon-plus-sign');
    }
    e.stopPropagation();
}

function validateLength(obj) {
    var currContext = $(obj).parent().parent();
    if ($(obj).val().length > 0) {
        $(currContext).find("button").removeAttr("disabled");
    }
    else {
        $(currContext).find("button").attr("disabled", "disabled");
    }
    $(".close").removeAttr("disabled");
}



//prevents special characters to be entered in any type of input field
$('.nospcl').on('keypress', function (event) {
    var regex = new RegExp("^[a-zA-Z0-9_/@/./-]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key) && event.keyCode!=13) {
        event.preventDefault();
        return false;
    }
});

//prevents special characters but accepts "space" to be entered in any type of input field
$('.nospclbtspce').on('keypress', function (event) {
    var regex = new RegExp("^[a-zA-Z0-9 ]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }
});



//This function is responsible for checking idle state of browser 
//and ending the session if browser is found to be idle for more than 10 mins
function Session() { }

Session.prototype.init = function () {
    console.log('inside Session.init()');

    //capturing all click, touch and keypress events
    if (window.addEventListener) {
        window.addEventListener('touchstart', Timeout, false);
        window.addEventListener('click', Timeout, false);
        window.addEventListener('keypress', Timeout, false);
    }
    else if (window.attachEvent) {
        window.attachEvent('touchstart', Timeout, false);
        window.attachEvent('click', Timeout, false);
        window.attachEvent('keypress', Timeout, false);
    }
    function _timeout() {
        return function () {
            SaveUserWork();
            if (confirm('Session Timeout. You have been logged out.')) {
                window.location.href = "/MBTTool/Home/Logout/";
            }
            else {
                window.location.href = "/MBTTool/Home/Logout/";
            }
            
            //window.location.reload();            
            
        };
    }

    function Timeout() {
        console.log('inside goTimeout()');
        if (typeof(timer) != 'undefined') {
            console.log("clearing timer");
            timer = clearTimeout(timer); //reset as soon as something is clicked
        }
        timer = setTimeout(_timeout(), 600000 /*test tiemout period in millisec*/);
    }
};

var sessionTimeout = new Session();
sessionTimeout.init();
