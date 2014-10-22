var initialize = function ( details )
{

    // Get the mute cookie
    chrome.cookies.get
    (
        {
            url: 'http://relaxound.tk/',
            name: 'SOUND_MUTED',
        },
        function ( cookie )
        {

            var mute = false;

            if ( cookie )
            {
                mute = cookie.value === 'true' ? true : false;
            }

            updateIcon(mute);

        }
    );

};

var processMessage = function ( message , sender , callback )
{

    // Validate the message sender
    if  ( sender.id !== chrome.runtime.id )
    {
        return;
    }

    // Validate the message type
    if ( message.type !== 'mute-toggled' )
    {
        return;
    }

    updateIcon(message.mute);

};

var processClick = function ( tab )
{

    // An extension tabs query
    var tabsQuery = { url: 'http://relaxound.tk/*' };

    // An mute toggle routine
    var toggleMute = function ( tabs )
    {

        // The site is not opened yet
        if ( tabs.length === 0 )
        {

            // Open it then
            openSite();

        }

        // The site is already opened
        else
        {

            // Toggle the mute
            $(tabs).each
            (
                function()
                {
                    var tabId = this.id;
                    var message = { type: 'toggle-mute' };
                    chrome.tabs.sendMessage(tabId,message);
                }
            );

        }

    };

    // Find extension tabs and toggle their mute
    chrome.tabs.query(tabsQuery,toggleMute);

};

var openSite = function()
{

    chrome.tabs.create
    (
        {
            url: 'http://relaxound.tk/',
            active: false,
            selected: false,
            pinned: true,
            index: 0,
        },
        null
    );

};

var updateIcon = function ( mute )
{

    // Get a path to the extension icon
    var iconType = mute ? 'disabled' : 'enabled';
    var iconPath = 'images/sound-' + iconType + '.png';
    var icon = { path: iconPath };

    // Update the extension icon
    chrome.browserAction.setIcon(icon);

};

// Initialize the extension
chrome.runtime.onInstalled.addListener(initialize);

// Listen to the extension messages
chrome.runtime.onMessage.addListener(processMessage);

// Listen to clicks on the extension icon
chrome.browserAction.onClicked.addListener(processClick);
