class Context
    defaults:
        x: 0
        y: 0

    constructor: ( params ) ->
        @options = {}
        $.extend @options, @defaults
        $.extend @options, params

        @div = $( '<div class="context" />' )
        @ul = $( '<ul />' )
        @div.append @ul

        if @options.items
            for k,v of @options.items
                item = $( "<li>#{k}</li>" )
                item.click v
                item.click ( e ) =>
                    @destroy( )
                @ul.append item
        else
            throw "No menu items!"

        $( 'body' ).append @div

        @ul.css
            left: @options.x
            top: @options.y
            opacity: 0
        @ul.animate
            opacity: 1,
            250
        @div.click ( e ) =>
            @destroy( )

    destroy: ->
        @ul.animate
            opacity: 0,
            250, 'linear', =>
                @div.remove( )
                delete @

this.Context = Context
