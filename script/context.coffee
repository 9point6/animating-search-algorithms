class Context
    defaults:
        x: 0
        y: 0
        autoshow: true

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
                # TODO: Finish this
                if v instanceof Context
                    item.hover ( ( e ) =>
                        v.ul.css
                            left: e.pageX
                            top: e.pageY
                        v.killthis = @
                        v.show( )
                    ) , ( e ) ->
                        # v.hide( )
                else
                    item.click v
                    item.click ( e ) =>
                        @destroy( )
                @ul.append item
        else
            throw "No menu items!"

        @div.click ( e ) =>
            @destroy( )
        @ul.css
            left: @options.x
            top: @options.y
            opacity: 0

        if @options.autoshow
            @show( )

    show: ( root = null ) ->
        $( 'body' ).append @div
        if root?
            @ul.css
                left: $( root ).position( ).left
                top: $( root ).position( ).top
        @ul.animate
            opacity: 1,
            250

    hide: ->
        @ul.animate
            opacity: 0,
            250, 'linear', =>
                @div.hide( )

    destroy: ->
        @ul.animate
            opacity: 0,
            250, 'linear', =>
                @div.remove( )
                if @killthis
                    @killthis.destroy( )
                delete @

this.Context = Context
