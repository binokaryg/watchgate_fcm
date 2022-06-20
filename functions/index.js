const functions = require("firebase-functions");
const cors = require("cors")({origin: true});
const admin = require("firebase-admin");

admin.initializeApp();

exports.sendData = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    console.log("topic", request.query.topic);
    const topic = request.query.topic;
    const message = {
      "data": {
        "task": request.query.title,
        "body": request.query.body,
      },
    };

    if (request.query.package) {
      message.data.package = request.query.package;
    } else {
      message.data.package = "";
    }

    const options = {
      priority: "high",
      collapseKey: "lastStandingMan",
      timeToLive: 600,
    };
    admin.messaging().sendToTopic(topic, message, options)
        .then((msgID) => {
          console.log("Successfully sent message: ", msgID);
          response.send("Successfully sent message.");
          return true;
        })
        .catch((error) => {
          console.log("Error sending message: ", error);
          response.send("Error sending message: " + error);
          return false;
        });
  });
});
