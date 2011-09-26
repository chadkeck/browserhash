$ ->
    $( window ).bind( "online offline",
        (event) ->
            console.log( navigator.onLine? "online" : "offline" )
    )

    cache = window.applicationCache
    $( cache ).bind( "checking",
        (event) ->
            console.log( "checking for manifest" )
    )

    $( cache ).bind( "noupdate",
        (event) ->
            console.log( "no update" )
    )

    $( cache ).bind( "downloading",
        (event) ->
            console.log( "downloading cache" )
    )

    $( cache ).bind( "progress",
        (event) ->
            console.log( "file downloaded" )
    )

    $( cache ).bind( "cached",
        (event) ->
            console.log( "all files downloaded" )
    )

    $( cache ).bind( "updateready",
        (event) ->
            console.log( "new cache available" )
    )

    $( cache ).bind( "obsolete",
        (event) ->
            console.log( "manifest not found" )
    )

    $( cache ).bind( "error",
        (event) ->
            console.log( "manifest error:" )
            console.log( event )
    )
