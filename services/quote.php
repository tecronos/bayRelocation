<?php
// Get Data service
$data = json_decode(file_get_contents('php://input'));

$response = new stdClass();
$response->status = true;

// Validate email
$emailRegex = '/^\w+([-+.\']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/';
$regex = preg_match($emailRegex, $object->email, $emailMatches, PREG_OFFSET_CAPTURE, 0);

if(sizeof($emailMatches) < 0) {
	$response->status = false;
	$response->message = "Invalid email";
	return $response;
}

if ($data->recaptcha != '') {

    $secret = "6LdWqyEUAAAAAOIf4JN8c1gP_NC_ZR_b3fo4NOFt";
    $ip = $_SERVER['REMOTE_ADDR'];
    $recaptcha = $data->recaptcha;
    $result = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=$secret&response=$recaptcha&remoteip=$ip");

    $responseFormat = json_decode($result, true);

    if ($result['success']) {
        
        // Validate Data
        if (!$response->status) {
            header('HTTP/1.1 400 Bad request');
            echo $response->message;
        }
        else {
            $to = 'vanessa@goldenbayrelocation.com';

            $subject = 'New Quote Request';

            $mensaje = '<html><head><title>New Quote Request</title></head><body style="font-family:verdana;">';

            $mensaje .= 'Full name:'. $data->fullName.'<br>';
            $mensaje .= 'How did you find out about us (please be specific): '.$data->findOutUs.'<br>';
            $mensaje .= 'Email: <a href="mailto:'.$data->email.'">'.$data->email. '</a><br>';
            $mensaje .= 'Contact number: <a href="tel:'.$data->contactNumber.'">'.$data->contactNumber.'</a><br><br>';

            $mensaje .= 'Move date: '.$data->moveDate.'<br>';
            $mensaje .= 'Alternate move date: '.$data->alternateMoveDate.'<br>';
            $mensaje .= 'Origin address: '.$data->originAddress.'<br>';
            $mensaje .= 'Destination address: '.$data->destinationAddress.'<br>';
            $mensaje .= 'Address for any additional pick-up&#39;s?: '.$data->additionalPickUp.'<br>';
            $mensaje .= 'Address for any additional drop-off&#39;s?: '.$data->additionalDropOff.'<br><br>';

            $mensaje .= 'How many adults / kids / toddlers live at your place?: '.$data->adultsKidsToddler.'<br>';
            $mensaje .= 'At origin, what type of residence are you moving out of? (is it a 1 bedroom apartment or 1 bedroom loft or 2 bedroom condo or 2 bedroom flat or 3 bedroom townhouse or 4 bedroom house - please be specific): '.$data->kindOfResidence.'<br>';
            $mensaje .= 'Square footage for origin (approximate): '.$data->originFootage.'<br>';
            $mensaje .= 'At destination, what type of residence are you moving into?: '.$data->kindOfResidenceInto.'<br>';
            $mensaje .= 'Square footage at destination (approximate): '.$data->destinationFootage.'<br>';
            $mensaje .= 'Stairs or elevators at origin? if stairs...how many?: '.$data->stairsElevatorsOrigin.'<br>';
            $mensaje .= 'Stairs or elevators at destination? if stairs...how many?: '.$data->stairsElevatorsDestination.'<br><br>';

            $mensaje .= 'Is everything being moved?  "furniture" + "boxes" + "hanging clothes" + "misc items"?: '.$data->miscItems.'<br>';
            $mensaje .= 'Anything else being moved? I.E: garage stuff, storage in your building, back yard stuff, patio or deck stuff?: '.$data->deckStuff.'<br>';
            $mensaje .= 'Will you be packed prior to movers showing up? ("packed" as in having all small stuff placed into boxes - we take care of the big stuff that does not fit into boxes including TV&#39;s): '.$data->packedPrior.'<br>';
            $mensaje .= 'Do you want us to pack your breakables only? ("BREAKABLES" are defined as glassware, porcelain, crystal, china, small electrical kitchen appliances, picture frames, TV&#39;s, lamps - please be specific - thanks): '.$data->packYourBreakables.'<br><br>';
            $mensaje .= 'Any cumbersome items being moved? (I.E: piano, murphy bed, treadmill, elliptical, high end antiques, safe, refrigerator, washer, dryer, etc): '.$data->cumbersomeItems.'<br>';
            $mensaje .= 'Any issues with your prior move? Or anything relevant we should know about your specific move or moving needs?: '.$data->anythingRelevant.'<br>';

            $mensaje .="</body></html>";

            // To send HTML mail, the Content-type header must be set
            $headers  = 'MIME-Version: 1.0' . "\r\n";
            $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";

            // Additional headers
            $headers .= 'To: <vanessa@goldenbayrelocation.com>' . "\r\n";
            $headers .= 'From: '.$data->fullName.' <'.$data->email.'>' . "\r\n";



            // Sending Email
            if(mail($to, $subject, $mensaje, $headers)) {

                $thank_text = "To Our Valued Customer,

                Thank you for your interest in Golden Bay Relocation LLC. We are currently experiencing a high volume of emails and phone calls from prospective movers.  We will get back to you as soon as we can and appreciate your patience.
                We look forward to serving you and your family!

                Sincerely,

                Golden Bay Relocation LLC
                Phone: 415-668-9562
                www.GoldenBayRelocation.com
                ";

                mail($data->email,"Thank you for your interest in Golden Bay Relocation LLC",$thank_text , "From:  info@gbrmoving.com\r\n"."X-Mailer: Content Manager - PHP/".phpversion());

                header('HTTP/1.1 204 No Content');
            }
            else {
                header('HTTP/1.1 400 Bad request');
                echo "An unexpected error occurred";
            }
        }
    }
    else {
        header('HTTP/1.1 400 Bad request');
        echo "Recaptcha Error";
    }
}
else {
    header('HTTP/1.1 400 Bad request');
    echo "Recaptcha Error";
}
?>