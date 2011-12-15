# Part of the **Animating Search Algorithms** project
#
# ## Developers
# * [Ian Brown](http://www.csc.liv.ac.uk/~cs8ib/)
# * [Jack Histon](http://www.csc.liv.ac.uk/~cs8jrh/)
# * [Colin Jackson](http://www.csc.liv.ac.uk/~cs8cj/)
# * [Jennifer Jones](http://www.csc.liv.ac.uk/~cs8jlj/)
# * [John Sanderson](http://www.csc.liv.ac.uk/~cs8js/)
#
# Do not modify or distribute without permission.

# ## Helper Functions

# ### window.uniqueId( )
# Generates a Unique ID. Taken from [here]
# (http://coffeescriptcookbook.com/chapters/strings/generating-a-unique-id)
# #### Parameters
# * `length` - Length of generated id string
window.uniqueId = ( length = 8 ) ->
    id = ""
    id += Math.random( ).toString( 36 ).substr( 2 ) while id.length < length
    id.substr 0, length

# ### window.base64Encode( )
# Base64 Encode. Adapted from [here]
# (https://gist.github.com/776329#file_base64_conversion_coffeescript_test_suite.html)
# #### Parameters
# * `text` - Base 64 string to encode
window.base64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
window.base64Encode = ( text ) ->
    i = 0
    result = []

    while i < text.length
        cur = text.charCodeAt i
        byteNum = i % 3

        switch byteNum
            when 0
                result.push base64.charAt cur >> 2
            when 1
                result.push base64.charAt ( prev & 3 ) << 4 | ( cur >> 4 )
            when 2
                result.push base64.charAt ( prev & 0x0f ) << 2 | ( cur >> 6 )
                result.push base64.charAt cur & 0x3f

        prev = cur
        i++

    if byteNum is 0
        result.push base64.charAt ( prev & 3 ) << 4
        result.push "=="
    else if byteNum is 1
        result.push base64.charAt ( prev & 0x0f ) << 2
        result.push "="

    result.join ""

# ### window.base64Decode( )
# Base64 Decode. Adapted from [here]
# (https://gist.github.com/776329#file_base64_conversion_coffeescript_test_suite.html)
# #### Parameters
# * `text` - Base 64 string to decode
window.base64Decode = ( text ) ->
    text = text.replace /\s/g, ""

    if not /^[a-z0-9\+\/\s]+\={0,2}$/i.test text or text.length % 4 > 0
        throw new Error "Not a base64-encoded string."
    i = 0
    result = []

    text = text.replace /\=/g, ""

    while i < text.length
        cur = base64.indexOf text.charAt i
        digitNum = i % 4;

        switch digitNum
            when 1
                result.push String.fromCharCode prev << 2 | cur >> 4
            when 2
                result.push String.fromCharCode (prev & 0x0f) << 4 | cur >> 2
            when 3
                result.push String.fromCharCode (prev & 3) << 6 | cur

        prev = cur
        i++

    result.join ""

# Adapted from PPK's cookie methods
window.setCookie = ( name, value, days ) ->
    if days
        date = new Date( )
        date.setTime date.getTime( ) + ( days * 24 * 60 * 60 * 1000 )
        expires = "; expires=#{date.toGMTString( )}"
    else
        expires = ""
    document.cookie = "#{name}=#{value}#{expires}; path=/"

window.getCookie = ( name ) ->
    nameEQ = "#{name}="
    ca = document.cookie.split ';'
    for c in ca
        while ' ' is c.charAt 0
            c = c.substring 1, c.length
        if 0 is c.indexOf nameEQ
            return c.substring nameEQ.length, c.length
    null

window.deleteCookie = ( name ) ->
    setCookie name, "", -1

# ## Bootstrap Code
# The stuff needed to get everything started!

# Executes on document.ready event
$ ->
    # Stop IE text selection
    $( 'body' ).onselectstart = -> false

    window.ALGORITHMS = [
        BFS
        DFS
        DLS
        IterativeDeepening
        AStar
        BiDirectional
    ]

    # Instantiates the main class and starts the program
    window.APP = new Main
