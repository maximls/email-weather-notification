const htmlMessage = (weatherData, location, id) => {
  //Show accumulation only if greater than 0
  const accumulation =
    weatherData.daily.data[0].precipAccumulation !== 0
      ? `<tr>
	<td colspan="2" align="center" style="font-size:18px; padding-top:15px; padding-bottom:15px"> 
	Accumulation: 
				${
          weatherData.daily.data[0].precipAccumulation
        } ${weatherData.labels.precipAccumulation()}
	</td>
</tr>				
<tr>`
      : "";

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<title>Today's weather</title>
        <style type="text/css">
                @import url('https://fonts.googleapis.com/css?family=Lato:400,700');
				td {font-family: 'Lato', Arial, sans-serif; font-size: 16px; color: #dfdfdf}
                .container {border: 1px solid lightgrey}
                .logo{width: 50% }
				.summary {font-size: 18px; font-weight: 400; font-family: 'Lato', Arial, sans-serif; padding: 5px 20px 30px 20px}
				.temps-row td {padding-top: 10px}
				.temps { text-align: center;  width: 100%}
				.temps td{padding: 10px 0px; color: white; }

		</style>
	</head>	
	<body bgcolor="#fff">

		<table width = "100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#2d2d2d">
			<tr>
				<td>
					<table class="container" width="320" align="center" border="0" cellpadding="0">
						<tr>
							<td valign="top" class="logo" style="padding-left: 5px" >
								<h4 style="font-size: 14px; font-weight: 100; font-family: 'Lato', Arial, sans-serif;">${
                  weatherData.time
                }</h4>
                            </td>
                            <td valign="top"  class="logo" >
								<h4 style="font-size: 14px; font-weight: 100; font-family: 'Lato', Arial, sans-serif;">${location}</h4>
							</td>
						</tr>
						<tr>
                            <td colspan="2" align="center"><img style="width: 70%" src="http://www.emailweather.info/assets/icons/${
                              weatherData.daily.data[0].icon
                            }.png"></td>
						</tr>
						<tr>
							<td colspan="2" align="center" class="summary">${
                weatherData.daily.data[0].summary
              }</td>
						</tr>
						<tr class="temps-row">
							<td align="center" bgcolor="#db7c3d">
							<table class="temps high">
								<tr>
									<td style="font-size:16px">${weatherData.daily.data[0].temperatureHighTime}</td>	
								</tr>
								<tr>
									<td  style="font-size:22px">High ${
                    weatherData.daily.data[0].temperatureHigh
                  } ${weatherData.labels.tempDegrees()}</td>	
								</tr>
								<tr>
									<td style="font-size:18px; padding-bottom: 20px">Feels like ${
                    weatherData.daily.data[0].apparentTemperatureHigh
                  } ${weatherData.labels.tempDegrees()}</td>	
								</tr>
							</table>
						</td>
						<td align="center" bgcolor="#6f9de2"> 
							<table class="temps" >
								<tr>
									<td style="font-size:16px">${weatherData.daily.data[0].temperatureLowTime}</td>	
								</tr>
								<tr>
									<td style="font-size:22px">Low ${
                    weatherData.daily.data[0].temperatureLow
                  } ${weatherData.labels.tempDegrees()}</td>	
								</tr>
								<tr>
									<td style="font-size:18px; padding-bottom: 20px">Feels like ${
                    weatherData.daily.data[0].apparentTemperatureLow
                  } ${weatherData.labels.tempDegrees()}</td>	
								</tr>
							</table>
						</td>
						</tr>
						<tr>
							<td colspan="2" align="center" style="font-size:18px; padding-top:25px; padding-bottom:15px;" >Precipitation: ${
                weatherData.daily.data[0].precipType
              }</td>
						</tr>
						${accumulation}
						<tr>
							<td colspan="2" align="center" style="font-size:18px; padding-top:15px; padding-bottom:45px">Wind ${
                weatherData.daily.data[0].windSpeed
              } ${weatherData.labels.windSpeed()}, Gusts ${
    weatherData.daily.data[0].windGust
  } ${weatherData.labels.windSpeed()}</td>
						</tr>
						<tr>
							<td colspan="1" align="center" style="padding-bottom:20px"><a style="color:#1b89ef" href="http://www.emailweather.info/update/${id}">Update preferences</a></td>
							<td colspan="2" align="center" style="padding-bottom:20px"><a style="color:#1b89ef" href="http://www.emailweather.info/delete/${id}">Unsubscribe</a></td>
						</tr>
						<tr>
							<td calign="center" style="font-size:14px" colspan="2"> All Rights Reserved</td>
						</tr>
					</table>
				</td>
			</tr>
			</table>

	</body>	
</html>
`;
};

module.exports = htmlMessage;
