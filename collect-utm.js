// UTM Cache by Gabriel Oliveira
// Captures UTM parameters from the URL and stores them in cookies so they persist
// across multiple pages. On any page that has a form, reads the cookies and fills
// the hidden UTM fields automatically — even when the visitor landed on a different
// page that originally had the UTM parameters in the URL.
//
// Supports both plain JavaScript and jQuery environments.
// Cookie expiration defaults to 30 days so campaign data survives browser sessions.

(function () {
    // ─── Configuration ────────────────────────────────────────────────────────
    var UTM_PARAMS   = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    var COOKIE_DAYS  = 30;   // how long to keep UTM cookies (days)
    var COOKIE_PATH  = '/';  // share cookies across the whole domain

    // ─── Helpers ──────────────────────────────────────────────────────────────

    /**
     * Returns the value of a URL query parameter or an empty string.
     */
    function getQueryParam(name) {
        var regex   = new RegExp('[?&]' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '=([^&#]*)');
        var results = regex.exec(window.location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    /**
     * Sets a cookie with an expiration date.
     */
    function setCookie(name, value, days) {
        var expires = '';
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            expires = '; expires=' + date.toUTCString();
        }
        document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=' + COOKIE_PATH + '; SameSite=Lax';
    }

    /**
     * Reads a cookie value by name. Returns the value string or false when absent.
     */
    function getCookie(name) {
        var nameEQ = name + '=';
        var parts  = document.cookie.split(';');
        for (var i = 0; i < parts.length; i++) {
            var part = parts[i].replace(/^\s+/, '');
            if (part.indexOf(nameEQ) === 0) {
                return decodeURIComponent(part.substring(nameEQ.length));
            }
        }
        return false;
    }

    /**
     * Sets the value of a form field identified by its id attribute.
     * Works with jQuery (if loaded) or plain DOM.
     */
    function setFieldValue(id, value) {
        if (!value) return;
        if (typeof $ !== 'undefined') {
            $('#' + id).val(value);
        } else {
            var el = document.getElementById(id);
            if (el) el.value = value;
        }
    }

    // ─── Step 1 – Capture UTM parameters from the current URL ─────────────────
    // Only runs when the URL actually contains UTM parameters so we never
    // overwrite a previously cached value with an empty string.
    if (window.location.search.indexOf('utm_') !== -1) {
        for (var i = 0; i < UTM_PARAMS.length; i++) {
            var param = UTM_PARAMS[i];
            var value = getQueryParam(param);
            if (value) {
                setCookie(param, value, COOKIE_DAYS);
            }
        }
    }

    // ─── Step 2 – Populate form fields from the cached cookies ────────────────
    function populateFormFields() {
        for (var j = 0; j < UTM_PARAMS.length; j++) {
            var param = UTM_PARAMS[j];
            setFieldValue(param, getCookie(param));
        }
    }

    // Run after the DOM is ready, compatible with and without jQuery
    if (typeof $ !== 'undefined') {
        $(document).ready(populateFormFields);
    } else if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', populateFormFields);
    } else {
        populateFormFields();
    }
}());
