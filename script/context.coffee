class Context
    defaults:
        x: 0
        y: 0
        autoshow: true
        zindex: 1000

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
                    item.append "<span class=\"submarker\">&gt;</span>"
                    item.hover ( ( e ) =>
                        v.ul.css
                            left: e.pageX
                            top: e.pageY
                        v.killthis = @
                        func = => v.show( )
                        setTimeout func, 100
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
            @hide( )
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
        $( @div.node ).css
            "z-index": @options.zindex++
        @ul.animate
            opacity: 1,
            250

    hide: ->
        @ul.animate
            opacity: 0,
            250, 'linear', =>
                @div.hide( )

    destroy: ( killparent = true ) ->
        @ul.animate
            opacity: 0,
            250, 'linear', =>
                @div.remove( )
                if @killthis and killparent
                    @killthis.destroy( )
                delete @

this.Context = Context
