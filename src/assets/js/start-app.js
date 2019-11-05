var launcher = {
    packageLaunch: function(appSchemeStr){
        // launch app using package name (for Android devices)
        window.plugins.launcher.launch({
                packageName: appSchemeStr
            }, 
            function(){ }, 
            function(){ alert('Failed to open app') }
        );
    },
    uriLaunch: function(appUriStr){
        // launch app using URI (for iOS devices)
        window.plugins.launcher.launch({
                uri: appUriStr
            }, 
            function(){ }, 
            function(){ alert('Failed to open app') }
        );
    },
}

/*
export class launch {

    packageLaunch(appSchemeStr)
    {
        // launch app using package name (for Android devices)
        window.plugins.launcher.launch({
                packageName: appSchemeStr
            }, 
            function(){ }, 
            function(){ alert('Failed to open app') }
        );
    }

    uriLaunch(appUriStr) {
        // launch app using URI (for iOS devices)
        window.plugins.launcher.launch({
                uri: appUriStr
            }, 
            function(){ }, 
            function(){ alert('Failed to open app') }
        );
    }
}
*/