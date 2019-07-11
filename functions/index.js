const functions = require('firebase-functions');
const request = require('request-promise');

const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message';
const LINE_HEADER = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer 3GawPXPAF4cDB/b4L7ZDC9x50bZYf2MwmJ37LgDp6uhA94edJX9rMAWGgghaiCogfsRFdviuoflqIumB7mRlPTwM9VvV+HPy2AprHnC6oFtqhIFvxM7vcBAJXUyz0Qn7BSXYhyD9ShE5V0n9sLJocQdB04t89/1O/w1cDnyilFU=`
};

exports.webhook = functions.https.onRequest((req, res) => {
  if (req.method === "POST") {
    let event = req.body.events[0]
    if (event.type === "message" && event.message.type === "text") {
      postToDialogflow(req);
    } else {
      reply(req);
    }
  }
  return res.status(200).send(req.method);
});

const reply = req => {
  return request.post({
    uri: `${LINE_MESSAGING_API}/reply`,
    headers: LINE_HEADER,
    body: JSON.stringify({
      replyToken: req.body.events[0].replyToken,
      messages: [
        {
          type: "text",
          text: JSON.stringify(req.body)
        }
      ]
    })
  });
};

const postToDialogflow = req => {
  req.headers.host = "bots.dialogflow.com";
  return request.post({
    uri: "https://bots.dialogflow.com/line/57d09c06-542e-4fd6-89e0-86223e9b0ff4/webhook",
    headers: req.headers,
    body: JSON.stringify(req.body)
  });
};