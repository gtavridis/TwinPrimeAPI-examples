<?php
	
require("classes/twinprime.class.php");
$tp = new Twinprime();

$geosData = $tp->requestData("geos", null);

//Fetch content type data and return in the required Geckoboard bar chart format
$endpointUrl = "app/data/performance";

//Image only traffic broken down by timezone
$endpointParams = array(
  "app_guid" => $tp->getConfigOption("app_guid"),
  "reldate" => "30day",
  "country_code" => "all",
  "timezone" => "detail",
  "parent_content_type" => "Image"
);

$requestData = $tp->requestData($endpointUrl, $endpointParams);
$rData = json_decode($requestData);

//We only want to plot bad performance on the map so look for high DCU
$filteredData = array();
foreach($rData->data as $rd) {
	if ($rd->acc_median_dcu > 1000) {
		$filteredData[] = $rd;
	}
}

$result = $tp->appDetailsToMapFormat($filteredData, $geosData);

header('Content-Type: application/json');
echo json_encode($result);