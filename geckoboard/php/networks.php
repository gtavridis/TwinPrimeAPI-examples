<?php
	
require("classes/twinprime.class.php");
$tp = new Twinprime();

//Fetch content type data and return in the required Geckoboard bar chart format
$endpointUrl = "app/data/performance";

$endpointParams = array(
  "app_guid" => $tp->getConfigOption("app_guid"),
  "reldate" => "30day",
  "network" => "detail"
);

$requestData = $tp->requestData($endpointUrl, $endpointParams);
$result = $tp->appDetailsToPieFormat($requestData, "network", "total_request_count");

header('Content-Type: application/json');
echo json_encode($result);