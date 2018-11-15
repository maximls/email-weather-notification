//PROCESS DATA & COMPOSE EMAIL MESSAGE

const createMessage = (weatherData, location, email) => {
  const message = {
    to: email, //"maxim.lysakovsky@gmail.com",
    from: "weather@emailweather.info",
    subject: weatherData.daily.summary,
    templateId: "d-dbbb8898cd7d467ba82674016ba2e6b4",

    dynamic_template_data: {
      currently: weatherData.currently,
      dailySummary: weatherData.daily.summary,
      dailyData: weatherData.daily.data,
      location: location
    }
  };

  return message;
};

module.exports.createMessage = createMessage;
