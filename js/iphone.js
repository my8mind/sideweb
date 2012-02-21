var watchID = null;

$(document).bind("mobileinit", function(){
    $.mobile.loadingMessage = 'Caricamento...';
    $.mobile.pageLoadErrorMessage = 'Errore durante il caricamento';
    //$('#settings_form').submit(saveSettings);
    //$('#settings_form').submit(function(){console.log('tre');});
});

$.extend({
    getUrlVars: function(){
         var vars = [], hash;
         var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
         for(var i = 0; i < hashes.length; i++){
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
         }
         return vars;
    },
    getUrlVar: function(name){
         return $.getUrlVars()[name];
    }
});

function formatDate(d){
    var date = new Date(d);  
    return date.toLocaleDateString();
};

function loadNews(){
    if(window.localStorage.getItem("feed") == undefined)
        remoteLoadNews();
    else
        buildNews(JSON.parse(window.localStorage.getItem("feed")));
};

function buildNews(data){
    var markup = '<li class="newsItem"><a href="article.html?origLink=${link}">${title}<br /><span class="small">${formatDate(pubDate)}</span></a></li>';
    $.template("newsTemplate",markup);
    
    var newsList = $("#feeds");
    newsList.empty();
    $.tmpl("newsTemplate",data.query.results.item).appendTo(newsList);
    newsList.listview("refresh");
};

function remoteLoadNews(){
    url = 'http://www.forzearmate.org/app/reader.php?reload=false';
    //url = 'http://giove.hsgroup.net:8080/test/tmp/reader.php?reload=false';
    $.mobile.showPageLoadingMsg();
    jQuery.ajax({
        type:"GET",
        url: url,
        dataType:"json",
        success: function(data){
            window.localStorage.setItem('feed',JSON.stringify(data));
            buildNews(data);
            $.mobile.hidePageLoadingMsg();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            $.mobile.hidePageLoadingMsg();
            try{
                navigator.notification.alert("Impossibile comunicare con il server",function(){;},"Errore","Ok");
            }
            catch(e){
                alert("Errore\r\nImpossibile comunicare con il server");
            }
        }
    });
};

function loadArticle(idArt){
    $.mobile.showPageLoadingMsg();
    if(idArt == undefined){
        $.mobile.hidePageLoadingMsg();
        try{
            navigator.notification.alert("Impossibile caricare l'articolo richiesto",function(){;},"Errore","Ok");
        }
        catch(e){
            alert("Errore\r\nImpossibile caricare l'articolo richiesto");
        }
    }
    else {
        //url = 'http://giove.hsgroup.net:8080/test/tmp/article.php?origLink='+idArt;
        url = 'http://www.forzearmate.org/app/article.php?origLink='+idArt;
        var markupText = '<h2>${title}</h2><p class="first">{{html description}}</p>'
        var markupLink = '<li><a href="${link}" targer="_blank">Leggi su Sideweb.it</a></li>';      
        $.template("artTmpl",markupText);
        $.template("linkTmpl",markupLink);
        
        jQuery.ajax({
            type:"GET",
            url: url,
            dataType:"json",
            success: function(data){
                $("#art").empty();
                $("#link").empty();
                $.tmpl("artTmpl",data.query.results.item).appendTo($("#art"));
                $.tmpl("linkTmpl",data.query.results.item).appendTo($("#link"));
                $("#link").listview("refresh");
                $.mobile.hidePageLoadingMsg();	
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
                $.mobile.hidePageLoadingMsg();
                try{
                    navigator.notification.alert("Impossibile comunicare con il server",function(){;},"Errore","Ok");
                }
                catch(e){
                    alert("Errore\r\nImpossibile comunicare con il server");
                }
            }
        });
    }
};

function loadSettings(){
    $('#uname').val(window.localStorage.getItem('uname'));
    $('#passw').val(window.localStorage.getItem('passw'));
};

function saveSettings(){
    if($('#uname').val() == ""){
        try{
            navigator.notification.alert("Inserire il nome utente",function(){;},"Errore","Ok");
        }
        catch(e){
            alert("Errore\r\nInserire il nome utente");
        }
        return false;
    }
    if($('#passw').val() == ""){
        try{
            navigator.notification.alert("Inserire la password",function(){;},"Errore","Ok");
        }
        catch(e){
            alert("Errore\r\nInserire la password");
        }
        return false;
    }
    window.localStorage.setItem('uname', $('#uname').val());
    window.localStorage.setItem('passw', $('#passw').val());
    $.mobile.changePage("banca.html",{transition:"slidedown"});
    return false;
};

function loadConsulenze(){
    if($('#uname').val() == ""){
        try{
            navigator.notification.alert("Inserire il nome utente",function(){;},"Errore","Ok");
        }
        catch(e){
            alert("Errore\r\nInserire il nome utente");
        }
        return;
    }
    if($('#passw').val() == ""){
        try{
            navigator.notification.alert("Inserire la password",function(){;},"Errore","Ok");
        }
        catch(e){
            alert("Errore\r\nInserire la password");
        }
        return;
    }
    dati = 'uname='+window.localStorage.getItem('uname')+'&passw='+window.localStorage.getItem('passw');
    url = 'http://www.forzearmate.org/app/consulenze.php';
    //url = 'http://giove.hsgroup.net:8080/test/tmp/consulenze.php';
    $.mobile.showPageLoadingMsg();
    jQuery.ajax({
        type:"POST",
        url: url,
        data: dati,
        dataType:"json",
        success: function(data){
            $("#results").empty();
            if(data.status == "OK")
                $("#results").append(data.text);
            else{
                try{
                    navigator.notification.alert(data.text,function(){;},'Errore','Ok');
                }
                catch(e){
                    alert(data.text);
                }
            }
            $.mobile.hidePageLoadingMsg();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            $.mobile.hidePageLoadingMsg();
            try{
                navigator.notification.alert("Impossibile comunicare con il server",function(){;},"Errore","Ok");
            }
            catch(e){
                alert("Errore\r\nImpossibile comunicare con il server");
            }
        }
    });
};


function loadJuris(link){
    if($('#uname').val() == ""){
        try{
            navigator.notification.alert("Inserire il nome utente",function(){;},"Errore","Ok");
        }
        catch(e){
            alert("Errore\r\nInserire il nome utente");
        }
        return;
    }
    if($('#passw').val() == ""){
        try{
            navigator.notification.alert("Inserire la password",function(){;},"Errore","Ok");
        }
        catch(e){
            aclert("Errore\r\nInserire la password");
        }
        return;
    }
    dati = 'uname='+window.localStorage.getItem('uname')+'&passw='+window.localStorage.getItem('passw');
    
    url = 'http://www.sideweb.org/app/juris.php';
    //url = 'http://giove.hsgroup.net:8080/test/tmp/juris.php';
    
    if(link == undefined)
        link = "";
    else
        link = "&path="+link;
    
    var markup_head = '${back_title}';
    $.template("headTemplate",markup_head);
    var head = $("#juris_head_h1");

    var markup_menu = '<li><a href="banca_2.html?link=${link}">${title}</a></li>';
    $.template("menuTemplate",markup_menu);
    var menu = $("#juris_menu");

    var markup = '<li class="newsItem"><a href="${link}">${title}<br /></a></li>';
    $.template("newsTemplate",markup);
    var newsList = $("#juris_feeds");

    $.mobile.showPageLoadingMsg();
    jQuery.ajax({
    type:"POST",
    url: url,
    data: dati+link,
    dataType:"json",
    success: function(data){
        if(data.status == "OK"){
        head.empty();
        $("#juris_error").empty();
        newsList.empty();

        $.tmpl("headTemplate",data).appendTo(head);
        $("#juris_back").attr('href',data.back_link);
        menu.empty();

        if(data.dirs.length > 0)
            $.tmpl("menuTemplate",data.dirs).appendTo(menu);
        else
            if(data.files.length > 0)
                $.tmpl("newsTemplate",data.files).appendTo(newsList);
            else
                $("#juris_error").append('Nessun Documento');

        menu.listview("refresh");
        newsList.listview("refresh");
        }
        else{
            head.empty();
            $.tmpl("headTemplate",data).appendTo(head);
            $("#juris_back").attr('href',data.back_link);
            try{
                navigator.notification.alert(data.text,function(){;},"Errore","Ok");
            }
            catch(e){
                alert(data.text);
            }
        }
        $.mobile.hidePageLoadingMsg();
        },
    error: function(XMLHttpRequest, textStatus, errorThrown){
        $.mobile.hidePageLoadingMsg();
        try{
            navigator.notification.alert("Impossibile comunicare con il server",function(){;},"Errore","Ok");
        }
        catch(e){
            alert("Errore\r\nImpossibile comunicare con il server");
        }
        }
    });
};

function startWatch(){
  try{
    var options = {frequency:3000};
    watchID = navigator.accelerometer.watchAcceleration(
        function(){
            remoteLoadNews();
        },
        function(){
            ;//console.log("Errore shake");
        },
        options
    );
  }catch(e){}
}

function stopWatch(){
  try{
    if(watchID){
        navigator.accelerometer.clearWatch(watchID);
        watchID = null;
    }
  }catch(e){}
}

