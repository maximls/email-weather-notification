const request = require("request");

var geocodeAddress = address => {
  var encodedAddress = encodeURIComponent(address);
  return new Promise((resolve, reject) => {
    request(
      {
        url: `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyB2s3BLn0Wn2fnJoXN6qR2QRWtg5JnPV1k`,
        json: true
      },
      (error, response, body) => {
        if (error) reject(error);
        resolve(body);
      }
    );
  });
};

geocodeAddress("0sd000")
  .then(res => {
    console.log(JSON.stringify(res, undefined, 2));
  })
  .catch(err => console.log(err));
