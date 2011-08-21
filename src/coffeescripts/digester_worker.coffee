@importScripts "lib/md5.js"
@importScripts "lib/sha1.js"
@importScripts "lib/sha256.js"
@importScripts "lib/sha512.js"

send_digest = (digest_type, file_info) ->
    file_contents = file_info.file_contents
    file_name = file_info.file_name
    lib_fn = eval 'rstr_' + digest_type
    digest = rstr2hex lib_fn file_contents
    digest_info =
        file_name: file_name
        digest_type: digest_type
        digest: digest
    postMessage digest_info


calculate_digests = (file_info) ->
    digest_types = ['md5', 'sha1', 'sha256', 'sha512']
    send_digest( digest_type, file_info ) for digest_type in digest_types

@onmessage = (event) ->
    file_info = event.data
    calculate_digests( file_info )
    return

