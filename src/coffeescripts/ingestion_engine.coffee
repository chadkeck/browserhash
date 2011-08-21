$ ->
    Modernizr.addTest 'filereader', ->
        return typeof FileReader isnt "undefined"

    if Modernizr.draganddrop
        console.log 'yes'
    else
        console.log 'no'

    if Modernizr.webworkers
        console.log 'yes'

    if Modernizr.filereader
        console.log 'yes for filereader'
    else
        console.log 'NO for filereader'


    # prevent the browser from opening dropped items
    page = document.getElementById 'page'
    page.ondragover = ->
        console.log 'ondragover'
        false

    page.ondragend = ->
        console.log 'ondragend'
        false

    page.ondrop = (event) ->
        console.log 'ondrop'
        false

    table_handler = new ResultsTable '#results-container', $ '#entry-tmpl'
    drop_zone = new DropZone 'drop-zone', table_handler.handle_new_file

    return
