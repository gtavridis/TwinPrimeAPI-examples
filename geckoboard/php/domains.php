<?php
	
require("classes/twinprime.class.php");
$tp = new Twinprime();

//Fetch content type data and return in the required Geckoboard bar chart format
$endpointUrl = "app/data/performance";

$endpointParams = array(
  "app_guid" => $tp->getConfigOption("app_guid"),
  "reldate" => "30day",
  "url_domain" => "detail"
);

$requestData = $tp->requestData($endpointUrl, $endpointParams);
$result = $tp->appDetailsToBarFormat($requestData, "url_domain", "acc_median_origin_latency");

header('Content-Type: application/json');
echo json_encode($result);