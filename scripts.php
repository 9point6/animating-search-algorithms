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
 
// Only needed whilst we're working with multiple uncompiled
// Coffeescript files.
header ( 'Content-Type: text/coffeescript' );
$dir = "./script/";
$scripts = glob ( $dir . "*.coffee" );
foreach ( $scripts as $script )
{
    readfile ( $script );
    echo "\n\n";
}