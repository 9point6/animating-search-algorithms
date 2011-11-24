<?php
/* Animating Search Algorithms
 *
 * (C) Ian Brown,
 *     Jack Histon,
 *     Colin Jackson,
 *     Jennifer Jones &
 *     John Sanderson
 * 2011 All Rights Reserved.
 *
 * Do not modify or distribute without permission.
 */

if ( !isset ( $_POST["action"] ) )
    exit ( "no action specified" );

switch ( $_POST["action"] )
{
    case "save":
        header ( "Cache-Control: public" );
        header ( "Content-Description: File Transfer" );
        header ( "Content-Disposition: attachment; filename=graph-" . time ( ) . ".searchomatic" );
        header ( "Content-type: application/x-searchomatic" );
        header ( "Content-Transfer-Encoding: base64" );
        echo $_POST["content"];
        break;
    case "load":
        if ( $_FILES['fileup']['error'] == UPLOAD_ERR_OK
                && is_uploaded_file( $_FILES['fileup']['tmp_name'] ) )
        {
            $data = file_get_contents ( $_FILES['fileup']['tmp_name'] );
            header ( "Content-type: application/json" );
            echo '{ "data" : "' . $data . '" }';
        }
}

