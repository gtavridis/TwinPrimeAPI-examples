<?php

class Twinprime {
    
  protected $config = null;
    
  public function __construct () {
  	$this->config = parse_ini_file("config/default.ini.php");
	}
	
	protected function doCurl($url) {
		//Create a new cURL resource
    $ch = curl_init();
    //Set URL and other appropriate options
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    //Call URL and fetch response
    $response = curl_exec($ch);
    //Close cURL resource, and free up system resources
    curl_close($ch);
    
    return $response;
	}
	
	public function getConfigOption($configKey) {
		return $this->config[$configKey];
	}
	
	public function requestData($endpoint, $endpointParams) {
		$finalUrlParms = "";
		
		if ($endpointParams != null) {
			foreach ($endpointParams as $k => $v) {
			  $finalUrlParms .= "&" . $k . "=" . rawurlencode($v);
			}
		}
		
		$finalUrl = $this->config["api_base_url"] . $endpoint . "?apikey=" . $this->config["apikey"] . $finalUrlParms;
		
		return $this->doCurl($finalUrl);
	}
	
	//https://developer.geckoboard.com/#bar-chart
	public function appDetailsToBarFormat($requestData, $titleProp, $valueProp) {
		$result = array(
			"x_axis" => array("labels" => array()),
			"y_axis" => array("format" => "decimal"),
			"series" => array(
				"data" => array()
			)
		);
		
		$rData = json_decode($requestData);
		
		if (isset($rData->data) && !empty($rData->data)) {
			foreach($rData->data as $d) {
				$result["x_axis"]["labels"][] = $d->{$titleProp};
				$result["series"]["data"][] = $d->{$valueProp};
			}
		}
		
		return $result;
	}
	
	//https://developer.geckoboard.com/#pie-chart
	public function appDetailsToPieFormat($requestData, $titleProp, $valueProp) {
		$result = array(
			"item" => array()
		);
		
		$rData = json_decode($requestData);
		
		if (isset($rData->data) && !empty($rData->data)) {
			foreach($rData->data as $d) {
				$result["item"][] = array(
					"label" => $d->{$titleProp},
					"value" => $d->{$valueProp}
				);
			}
		}
		
		return $result;
	}
	
	//https://developer.geckoboard.com/#datetime-example-14
	public function appDetailsToDateLineFormat($requestData, $chartName, $dateProp, $valueProp) {
		$result = array(
			"x_axis" => array("type" => "datetime"),
			"series" => array(
				"name" => $chartName,
				"data" => array()
			)
		);
		
		$rData = json_decode($requestData);
		date_default_timezone_set('America/Los_Angeles');
		
		if (isset($rData->data) && !empty($rData->data)) {
			foreach($rData->data as $d) {
				$formattedDate = date("Y-m-d", strtotime($d->{$dateProp}));
				$result["series"]["data"][] = array($formattedDate, $d->{$valueProp});
			}
		}
		
		return $result;
	}
	
	//https://developer.geckoboard.com/#number-and-secondary-stat
	public function appDetailsToTextFormat($requestData, $title, $valueProp) {
		$result = array(
			"item" => array(
				array(
					"text" => "",
					"value" => ""
				)
			)
		);
		
		$rData = json_decode($requestData);
		
		if (isset($rData->data) && !empty($rData->data)) {
			//Sum it
			$summedValue = 0;
			foreach($rData->data as $d) {
				$summedValue += $d->{$valueProp};
			}
			
			$result["item"][0]["text"] = $title;
			$result["item"][0]["value"] = $summedValue;
		}
		
		return $result;
	}
	
	//https://developer.geckoboard.com/#map
	public function appDetailsToMapFormat($filteredData, $geosData) {
		$result = array(
			"points" => array("point" => array())
		);
		
		$geos = json_decode($geosData);
		
		foreach($filteredData as $d) {
			$tzMatch = $geos->{$d->timezone};
			
			$result["points"]["point"][] = array(
        "latitude" => $tzMatch->latitude,
        "longitude" => $tzMatch->longitude,
        "color" => "ff0000",
        "size" => 5
			);
		}
		
		return $result;
	}
    
}
