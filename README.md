# TwinPrimeAPI-examples

<a href="http://twinprime.com/">
	<img height="40" src="http://twinprime.com/wp-content/themes/root/build/images/svgs/twinprime-logo.svg" alt="Twin Prime logo">
</a>

[Twin Prime](http://twinprime.com/) offers a rich customer facing [dashboard](https://dashboard.twinprime.com) that provides access to important performance and traffic related information. We realize thought that some customers might prefer to integrate Twin Prime's performance data into other applications/dashboards already in use.  For this reason we also offer a web API to our customers.  The official API docs can be found [here](https://web-api.twinprime.com/docs/).

To go along with the API docs we have developed a set of sample integrations for [Geckoboard](https://www.geckoboard.com/).  You are by no means limited to utilizing Geckoboard, it just happens to be a great platform for quickly assembling dashboards from a variety of popular and/or custom services.  Our sample integrations act as a proxy between the Twin Prime API and the [Geckoboard custom widget API](https://developer.geckoboard.com/#custom-widget-types).  The proxy samples enabled a series of endpoints that Geckoboard can call to retrieve JSON data in the format it expects for various widget types.

We've provided open source samples written in JavaScript (Node.js) and PHP, but any language capable of making HTTP requests would work just fine.

Screenshot of the sample dashboard:
![enter image description here](https://www.evernote.com/l/ADHnQSkTWudLEoTnqVIJGBFD9nukjnYyB2oB/image.png)

For more information please see the following [blog post](http://twinprime.com/category/blog/).

## Node.js sample

##Requirements

 - Node 4.x
 - API Key & App GUID from Twin Prime

###Setup

    cd TwinPrimeAPI-examples/geckoboard/nodejs
    npm install
    vim config/default.json (UPDATE SETTINGS)
    node app.js

###Exposes 

 - http://localhost:3000/content_types/bar
 - http://localhost:3000/domains/bar
 - http://localhost:3000/network/pie
 - http://localhost:3000/performance/line
 - http://localhost:3000/requests/text
 - http://localhost:3000/sessions/text
 - http://localhost:3000/timezones/map


## PHP sample

##Requirements

 - PHP 5.x, Curl, web server (Apache, Nginx, etc)
 - API Key & App GUID from Twin Prime

###Setup

    cd TwinPrimeAPI-examples/geckoboard/php
    vim config/default.ini.php (UPDATE SETTINGS)

###Exposes 

 - http://{DOMAIN/FOLDER}/content_types.php
 - http://{DOMAIN/FOLDER}/domains.php
 - http://{DOMAIN/FOLDER}/networks.php
 - http://{DOMAIN/FOLDER}/performance_daily.php
 - http://{DOMAIN/FOLDER}/requests.php
 - http://{DOMAIN/FOLDER}/sessions.php
 - http://{DOMAIN/FOLDER}/timezones.php
