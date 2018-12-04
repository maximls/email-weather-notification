// dynamic_template_data: {
//   id,
//   date: weatherData.date,
//   currently: weatherData.currently,
//   dailySummary: weatherData.daily.summary,
//   dailyData: weatherData.daily.data[0],
//   alerts: weatherData.alerts,
//   location: location
// }

const htmlMessage = weatherData => `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>Today's weather</title>
        <style type="text/css">
                @import url('https://fonts.googleapis.com/css?family=Lato:400,700');
				body {font-family: 'Lato', Arial, sans-serif; font-size: 16px;}
                .container {border: 1px solid blue}
                .logo{width: 50% }
				.summary {font-size: 18px; font-weight: 400; font-family: 'Lato', Arial, sans-serif; padding: 5px 20px}
				.temps-row td {padding-top: 40px}
				.temps { text-align: center;  width: 100%}
				.temps td{padding: 10px 0px; color: white; }
				.temps tr:nth-of-type(2){font-size: 22px}
				.high {background-color: hsl(24, 69%, 55%) ; text-shadow: hsl(216, 66%, 66%) 1px 1px 3px}
				.low {background-color: hsl(216, 66%, 66%); text-shadow: hsl(24, 69%, 55%) 1px 1px 3px}

		</style>
	</head>	
	<body bgcolor="#fff">

		<table width = "100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#fff">
			<tr>
				<td>
					<table class="container" width="320" align="center" border="0" cellpadding="0">
						<tr>
							<td valign="top" class="logo" bgcolor="#ffffff" style="padding-left: 5px" >
								<h4 style="font-size: 14px; font-weight: 100; font-family: 'Lato', Arial, sans-serif;">Wednesday, Nov 15</h4>
                            </td>
                            <td valign="top"  class="logo" bgcolor="#ffffff" >
								<h4 style="font-size: 14px; font-weight: 100; font-family: 'Lato', Arial, sans-serif;">Toronto, ON, Canada</h4>
							</td>
						</tr>
						<tr>
                            <td colspan="2" align="center"><img style="width: 70%" src="../../public/assets/SVG/Cloud-Drizzle.svg"></td>
						</tr>
						<tr>
							<td colspan="2" align="center" class="summary">Light snow (&lt; 1cm) in the morning and breezy overnight</td>
						</tr>
						<tr class="temps-row">
							<td align="center">
							<table class="temps high">
								<tr>
									<td>7:00 AM</td>	
								</tr>
								<tr>
									<td>High -2</td>	
								</tr>
								<tr>
									<td>Feels like -4</td>	
								</tr>
							</table>
						</td>
						<td align="center" bgcolor="#cccccc">
							<table class="temps" >
								<tr>
									<td>6:00 PM</td>	
								</tr>
								<tr>
									<td>Low -6</td>	
								</tr>
								<tr>
									<td>Feels like -4</td>	
								</tr>
							</table>
						</td>
						</tr>				
					</table>
				</td>
			</tr>
			</table>

	</body>	
</html>
`;

module.exports = htmlMessage;
