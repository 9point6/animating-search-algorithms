class Modal
    options:
        title: false
        intro: false
        fields: false
        okay: "Okay"
        cancel: false
        animations:
            background:
                in: ( elem ) ->
                    $( elem ).animate
                        opacity: 100
                out: ( elem ) ->
                    $( elem ).animate
                        opacity: 0,
                        250, "linear", =>
                            $( elem ).hide( )
                default: ( elem ) ->
                    $( elem ).css
                        opacity: 0
            dialog:
                in: ( elem ) ->
                    $( elem ).animate
                        "margin-top": 0
                out: ( elem ) ->
                    $( elem ).animate
                        "margin-top": -1000
                default: ( elem ) ->
                    $( elem ).css
                        "margin-top": -1000

    constructor: ( params ) ->
        $.extend @options, params

        @wrap = $( '<div />' ).addClass "modal"
        @div = $( '<div />' ).appendTo @wrap

        if @options.title
            @div.append "<h2>#{@options.title}</h2>"

        if @options.intro
            @div.append "<div class=\"intro\">#{@options.intro}</div>"

        submit_h = ( e ) =>
            @options.animations.background.out @wrap
            @options.animations.dialog.out @div
            @options.callback @return( )
        submit_hk = ( e ) =>
            if event.which is 13
                submit_h e

        if @options.fields
            fdiv = $( "<div class=\"fields\" />" )
            @div.append fdiv
            for fr,field of @options.fields
                field.default ?= ""
                label = $( "<label />" )
                fdiv.append label
                label.append "<span>#{field.label}:</span>"
                if field.type is "radio"
                    first = true
                    for k,v of field.values
                        llabel = $( '<label />' )
                        label.append llabel
                        input = $( """
                            <input type="radio" id="modf-#{fr}" name="modf-#{fr}" class="modal_fields"
                                value="#{k}" #{if first then 'checked="checked"' else ""}/>
                            """ )
                        llabel.append input
                        llabel.append "<span>#{v}</span>"
                        input.keypress submit_hk
                        first = false
                else
                    input = $( "<input />" ).addClass "modal_fields"
                    input.attr
                        type: field.type
                        id: "modf-#{fr}"
                        value: field.default
                    input.keypress submit_hk
                    label.append input
                fdiv.append "<br class=\"clear\" />"

        buttons = $( "<div class=\"buttons\" />" )
        @div.append buttons

        submit = $( "<button type=\"button\">#{@options.okay}</button>" )
        buttons.append submit
        submit.click submit_h
        submit.keypress submit_hk

        if @options.cancel
            cancel = $( "<button type=\"button\">#{@options.cancel}</button>" )
            buttons.append cancel
            cancel.click ( e ) =>
                @options.animations.background.out @wrap
                @options.animations.dialog.out @div

        @options.animations.background.default @wrap
        @options.animations.dialog.default @div

        $( 'body' ).append @wrap

    show: ->
        @options.animations.background.in @wrap
        @options.animations.dialog.in @div
        $( 'input.modal_fields' )[0].focus( )

    return: ->
        ret = {}
        for elem in $( "input.modal_fields:not([type=\"radio\"])", @div )
            elem = $( elem )
            key = elem.attr( "id" ).substring 5
            ret[key] = elem.val( )
        for elem in $( "input.modal_fields:checked", @div )
            elem = $( elem )
            key = elem.attr( "id" ).substring 5
            ret[key] = elem.val( )
        console.log ret
        ret

this.Modal = Modal
