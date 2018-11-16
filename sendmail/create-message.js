//PROCESS DATA & COMPOSE EMAIL MESSAGE

const createMessage = (weatherData, location, email, id) => {
  const message = {
    to: email, //"maxim.lysakovsky@gmail.com",
    from: "weather@emailweather.info",
    subject: ` ${
      weatherData.alerts
        ? weatherData.alerts[0].title
        : weatherData.daily.summary
    }`,
    templateId: "d-dbbb8898cd7d467ba82674016ba2e6b4",

    dynamic_template_data: {
      id,
      currently: weatherData.currently,
      dailySummary: weatherData.daily.summary,
      dailyData: weatherData.daily.data[0],
      alerts: weatherData.alerts,
      location: location
    }
  };

  return message;
};

module.exports.createMessage = createMessage;
