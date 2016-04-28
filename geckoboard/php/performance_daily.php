<?php
	
require("classes/twinprime.class.php");
$tp = new Twinprime();

//Fetch content type data and return in the required Geckoboard bar chart format
$endpointUrl = "app/data/performance/breakdown";

$endpointParams = array(
  "app_guid" => $tp->getConfigOption("app_guid"),
  "reldate" => "30day"
);

$requestData = $tp->requestData($endpointUrl, $endpointParams);
$result = $tp->appDetailsToDateLineFormat($requestData, "Performance by Day", "rollup_date", "acc_median_dcu");

header('Content-Type: application/json');
echo json_encode($result);