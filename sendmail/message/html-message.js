// dynamic_template_data: {
//   id,
//   date: weatherData.date,
//   currently: weatherData.currently,
//   dailySummary: weatherData.daily.summary,
//   dailyData: weatherData.daily.data[0],
//   alerts: weatherData.alerts,
//   location: location
// }

const htmlMessage = (
  weatherData,
  location,
  id
) => `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<title>Today's weather</title>
        <style type="text/css">
                @import url('https://fonts.googleapis.com/css?family=Lato:400,700');
				body {font-family: 'Lato', Arial, sans-serif; font-size: 16px;}
                .container {border: 1px solid lightgrey}
                .logo{width: 50% }
				.summary {font-size: 18px; font-weight: 400; font-family: 'Lato', Arial, sans-serif; padding: 5px 20px 30px 20px}
				.temps-row td {padding-top: 10px}
				.temps { text-align: center;  width: 100%}
				.temps td{padding: 10px 0px; color: white; }
				.temps tr:nth-of-type(2){font-size: 22px}
				.high {  }
				.low {}

		</style>
	</head>	
	<body bgcolor="#fff">

		<table width = "100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#fff">
			<tr>
				<td>
					<table class="container" width="320" align="center" border="0" cellpadding="0">
						<tr>
							<td valign="top" class="logo" bgcolor="#ffffff" style="padding-left: 5px" >
								<h4 style="font-size: 14px; font-weight: 100; font-family: 'Lato', Arial, sans-serif;">${
                  weatherData.time
                }</h4>
                            </td>
                            <td valign="top"  class="logo" bgcolor="#ffffff" >
								<h4 style="font-size: 14px; font-weight: 100; font-family: 'Lato', Arial, sans-serif;">${location}</h4>
							</td>
						</tr>
						<tr>
                            <td colspan="2" align="center"><img style="width: 70%" src="../../public/assets/SVG/${
                              weatherData.daily.data[0].icon
                            }.svg"></td>
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
									<td>${weatherData.daily.data[0].temperatureHighTime}</td>	
								</tr>
								<tr>
									<td>High ${
                    weatherData.daily.data[0].temperatureHigh
                  } ${weatherData.labels.tempDegrees()}</td>	
								</tr>
								<tr>
									<td>Feels like ${
                    weatherData.daily.data[0].apparentTemperatureHigh
                  } ${weatherData.labels.tempDegrees()}</td>	
								</tr>
							</table>
						</td>
						<td align="center" bgcolor="#6f9de2"> 
							<table class="temps" >
								<tr>
									<td>${weatherData.daily.data[0].temperatureLowTime}</td>	
								</tr>
								<tr>
									<td>Low ${
                    weatherData.daily.data[0].temperatureLow
                  } ${weatherData.labels.tempDegrees()}</td>	
								</tr>
								<tr>
									<td>Feels like ${
                    weatherData.daily.data[0].apparentTemperatureLow
                  } ${weatherData.labels.tempDegrees()}</td>	
								</tr>
							</table>
						</td>
						</tr>
						<tr>
							<td colspan="2">Precipitation: ${weatherData.daily.data[0].precipType}</td>
						</tr>
						<tr>
							<td colspan="2"> ${
                weatherData.daily.data[0].precipAccumulation !== "undefined"
                  ? `Accumulation: 
                    ${
                      weatherData.daily.data[0].precipAccumulation
                    } ${weatherData.labels.precipAccumulation()}`
                  : ""
              }</td>
						</tr>				
						<tr>
							<td colspan="2">Wind ${
                weatherData.daily.data[0].windSpeed
              } ${weatherData.labels.windSpeed()}, Wind Gusts ${
  weatherData.daily.data[0].windGust
} ${weatherData.labels.windSpeed()}</td>
						</tr>
						<tr>
							<td colspan="1"><a href="https://emailweather.info/update/${id}">Update preferences</a></td>
							<td colspan="2"><a href="https://emailweather.info/delete/${id}">Unsubscribe</a></td>
						</tr>
						<tr>
							
						</tr>
					</table>
				</td>
			</tr>
			</table>

	</body>	
</html>
`;

module.exports = htmlMessage;
