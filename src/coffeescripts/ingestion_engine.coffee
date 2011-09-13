show_browsers = ->
    return

prevent_file_opening = ->
    # prevent the browser from opening dropped items
    page = document.getElementById 'page'
    page.ondragover = ->
        #console.log 'ondragover'
        false

    page.ondragend = ->
        #console.log 'ondragend'
        false

    page.ondrop = (event) ->
        #console.log 'ondrop'
        false

$ ->
    Modernizr.addTest 'filereader', ->
        return typeof FileReader isnt "undefined"

    failed = false
    if Modernizr.draganddrop
        console.log 'yes drag drop'
    else
        failed = true
        console.log 'no drag drop'

    if Modernizr.webworkers
        console.log 'yes webworkers'
    else
        failed = true
        console.log 'no webworkers'

    if Modernizr.filereader
        console.log 'yes filereader'
    else
        failed = true
        console.log 'no filereader'

    if failed
        template = $( '#browsers-tmpl' ).tmpl().appendTo( '#page' )
        $( '#drop-area-container' ).hide()
        $( '#footer' ).hide()
        return

    $( '#alert-area' ).hide()
    prevent_file_opening()

    alert_area = new AlertArea '#alert-area'
    table_handler = new ResultsTable '#results-container', $ '#entry-tmpl'
    drop_zone = new DropZone 'drop-zone', table_handler.handle_new_file, alert_area.show_message, alert_area.show_filesize_message

