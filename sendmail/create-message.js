//PROCESS DATA & COMPOSE EMAIL MESSAGE

const createMessage = (weatherData, address, messageData) => {
  const message = {
    to: "max@max.com",
    //to: messageData.email,
    from: "weather@maximonline.ca",
    subject: weatherData.daily.summary,
    templateId: "d-dbbb8898cd7d467ba82674016ba2e6b4",

    dynamic_template_data: {
      currently: weatherData.currently,
      dailySummary: weatherData.daily.summary,
      dailyData: weatherData.daily.data,
      address
    }
  };

  return message;
};

module.exports.createMessage = createMessage;
