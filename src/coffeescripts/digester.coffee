class window.DropZone
    constructor: (element_id, new_file_callback) ->
        @element = document.getElementById element_id

        @element.ondragover =  @handle_drag_over
        @element.ondragenter = @handle_drag_enter
        @element.ondrop = 	   @handle_drop

        @new_file_callback = new_file_callback

    handle_mouse_enter: (event) ->
        #console.log( event.target )
        false

    handle_drag_over: (event) ->
        #console.log( 'DropZone::ondragover' )
        false

    handle_drag_enter: (event) ->
        #console.log( 'DropZone::ondragenter' )
        event.preventDefault()
        false

    handle_drop: (event) =>
        event.stopPropagation()
        event.preventDefault()
        files = event.dataTransfer.files

        if files.length is 0
            # do something
            return

        for file in files
            if file.size is 0
                # sorry, can only drop files
                return
            @new_file_callback file

class window.Digester
    constructor: (file, callbacks) ->
        @file_contents = undefined
        @file = file
        @callbacks = callbacks

        file_reader = new FileReader
        file_reader.onload = (event) =>
            @file_contents = event.target.result

            worker = new Worker 'javascripts/worker.js'
            worker.onmessage = (event) =>
                #console.log( 'returned from worker:', event )
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
