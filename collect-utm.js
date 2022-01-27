// UTM cookies by Gabriel Oliveira
// Script stores the user's UTM information in cookies and uses the information to populate the utm fields in the form
// Using JavaScript with jQuery

$( document ).ready(function() {
    // check the url for UTM
    if(window.location.href.indexOf("utm") > -1){
        // Collect URL Parameters
        function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }
    
        var source = getParameterByName('utm_source');
        var medium = getParameterByName('utm_medium');
        var campaign = getParameterByName('utm_campaign');
        var content = getParameterByName('utm_content');
        var term = getParameterByName('utm_term');
    
        // Store Cookie
    
        document.cookie = "utm_source=" + source + ";path=/";
        document.cookie = "utm_medium=" + medium + ";path=/";
        document.cookie = "utm_campaign=" + campaign + ";path=/";
        document.cookie = "utm_content=" + content + ";path=/";
        document.cookie = "utm_term=" + term + ";path=/";
    }
    
    // Cookie request function
    function valor_cookie(nome_cookie) {
        var cname = ' ' + nome_cookie + '=';
        
        var cookies = document.cookie;
        
        if (cookies.indexOf(cname) == -1) {
            return false;
        }
        
        cookies = cookies.substr(cookies.indexOf(cname), cookies.length);
    
        if (cookies.indexOf(';') != -1) {
            cookies = cookies.substr(0, cookies.indexOf(';'));
        }
        
        cookies = cookies.split('=')[1];
        
        return decodeURI(cookies);
    }
    
    // Collect and store UTM via cookies

    $("#utm_source").val(valor_cookie('utm_source'));
    $("#utm_medium").val(valor_cookie('utm_medium'));
    $("#utm_campaign").val(valor_cookie('utm_campaign'));
    $("#utm_term").val(valor_cookie('utm_term'));
    $("#utm_content").val(valor_cookie('utm_content'));
    
});