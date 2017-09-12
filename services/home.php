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
        	echo "all done";
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