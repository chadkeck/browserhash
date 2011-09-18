class window.AlertArea
    constructor: (element_id) ->
        @element = $( element_id )
        @element.css( 'visibility', 'hidden' )

    show_message: (message) =>
        @element.html message
        @element.fadeTo( 0, 0 ).css( 'visibility', 'visible' ).fadeTo( 600, 1 )

    show_filesize_message: (files) =>
        @element.empty()
        for file in files
            @element.html file

    clear: =>
        if @element.css( 'visibility' ) is 'visible'
            @element.fadeTo( 0, 1 ).css( 'visibility', 'visible' ).fadeTo( 600, 0 )

class window.DropZone
    constructor: (element_id, new_file_callback, alert_callback, alert_clear_callback) ->
        @element = document.getElementById element_id
        #$( @element ).addClass 'zoomable'

        @alert = alert_callback
        @alert_clear = alert_clear_callback

        one_megabyte = 1024 * 1024
        @file_size_limit = one_megabyte * 10

        @element.ondragover =  @handle_drag_over
        @element.ondragenter = @handle_drag_enter
        @element.ondragleave = @handle_drag_leave
        @element.ondrop = 	   @handle_drop

        @new_file_callback = new_file_callback

    show_drag_state: (show) =>
        element = $ @element
        if show
            element.addClass 'drag-on'
            element.find( '*' ).addClass 'drag-on'
        else
            element.removeClass 'drag-on'
            element.find( '*' ).removeClass 'drag-on'
        false

    handle_drag_over: (event) =>
        #console.log( 'DropZone::ondragover' )
        @show_drag_state true
        event.preventDefault()
        false

    handle_drag_enter: (event) =>
        #console.log( 'DropZone::ondragenter' )
        @show_drag_state true
        event.preventDefault()
        false

    handle_drag_leave: (event) =>
        #console.log( 'DropZone::ondragleave' )
        @show_drag_state false
        event.preventDefault()
        false

    handle_drop: (event) =>
        event.stopPropagation()
        event.preventDefault()
        @show_drag_state false

        files = event.dataTransfer.files

        if files.length is 0
            @alert 'Sorry! You can only drop files!'
            return

        error = false
        for file in files
            if file.size is 0
                @alert 'You dropped an empty file.'
                error = true
                continue
            if file.size > @file_size_limit
                #@alert_filesize file.name
                @alert 'You can only drop files smaller than 10 MB.'
                error = true
                continue

            @new_file_callback file

        if not error
            @alert_clear()


class window.Digester
    constructor: (file, callbacks) ->
        @file_contents = undefined
        @file = file
        @callbacks = callbacks

        file_reader = new FileReader
        file_reader.onload = (event) =>
            @file_contents = event.target.result

            worker = new Worker 'javascripts/digester_worker.js'
            worker.onmessage = (event) =>
                @handle_digest_message( event.data )

            file_info =
                file_name: @file.name
                file_contents: @file_contents
            worker.postMessage file_info

        file_reader.readAsBinaryString @file

    handle_digest_message: (digest_info) =>
        digest_type = digest_info.digest_type
        digest = digest_info.digest
        file_name = digest_info.file_name
        @callbacks[digest_type]( digest )


class window.TableRow
    constructor: (row, file) ->
        @row = row

        @callbacks =
            md5: @handle_md5
            sha1: @handle_sha1
            sha256: @handle_sha256
            sha512: @handle_sha512

        new Digester file, @callbacks

    set_field: (digest_type, digest) =>
        @row.children( '.' + digest_type ).children( '.digest' ).html( digest )
        @row.children( '.' + digest_type ).children( '.spinner' ).css( 'visibility', 'hidden' )

    handle_md5:    (digest) => @set_field( 'md5', digest )
    handle_sha1:   (digest) => @set_field( 'sha1', digest )
    handle_sha256: (digest) => @set_field( 'sha256', digest )
    handle_sha512: (digest) => @set_field( 'sha512', digest )

class window.ResultsTable
    constructor: (table_id, template) ->
        @table_id = table_id
        @template = template

    handle_new_file: (file) =>
        table_data =
            filename: file.name
        row_obj = @template.tmpl( table_data ).appendTo @table_id
        new TableRow row_obj.children( 'ul' ), file
