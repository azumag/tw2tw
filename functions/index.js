const functions = require('firebase-functions');
const Twitter = require('twitter');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

exports.tw2tw = functions.https.onRequest(async (request, response) => {
  // console.log('params', request.params);
  // console.log('body', request.body);
  // console.log('query', request.query);

  if (request.query['hub.challenge']) {
    response.send(request.query['hub.challenge']);
  } else {
    data = request.body.data;

    const config = functions.config();
    if(config.credential && config.credential.twitter){
      
      const client = new Twitter({
        consumer_key: config.credential.twitter.consumer_key,
        consumer_secret: config.credential.twitter.consumer_secret,
        access_token_key: config.credential.twitter.access_token_key,
        access_token_secret: config.credential.twitter.access_token_secret
      });

      const tweet = (data) => {
        if (data.length > 0) {
          const streamInfo = data[0];
          return '配信を開始しました: '
            + streamInfo.title
            + ' https://www.twitch.tv/azumagbanjo';
        } else {
          return 'Twitch 配信を終了しました';
        }
      };

      try {
        await client.post('statuses/update', { status: tweet(data) })
      } catch (e) {
        console.log(e);
        throw e;
      }  

      response.send('ok');  
    } else {
      response.send("Not Found Config");
    }
  }
});

exports.profile2tw = functions.https.onRequest(async (request, response) => {
  // console.log('params', request.params);
  // console.log('body', requst.body);
  // console.log('query', request.query);
  
  if (request.query['hub.challenge']) {
    response.send(request.query['hub.challenge']);
  } else {
    data = request.body.data;

    const config = functions.config();
    if(config.credential && config.credential.twitter){
      
      const client = new Twitter({
        consumer_key: config.credential.twitter.consumer_key,
        consumer_secret: config.credential.twitter.consumer_secret,
        access_token_key: config.credential.twitter.access_token_key,
        access_token_secret: config.credential.twitter.access_token_secret
      });

      const tweet = (data) => {
        if (data.length > 0) {
          const streamInfo = data[0];
          return '(dummy) 配信を開始しました' + streamInfo.login;
        } else {
          return '(dummy) Twitch 配信を終了しました';
        }
      };

      try {
        await client.post('statuses/update', { status: tweet(data) })
      } catch (e) {
        console.log(e);
        throw e;
      }  
  
      response.send('ok');
  
    } else {
      response.send("Not Found Config");
    }
  }
});


exports.tweettest = functions.https.onRequest((req, res) => {
  const config = functions.config();
  if(config.credential && config.credential.twitter){
    
    const client = new Twitter({
      consumer_key: config.credential.twitter.consumer_key,
      consumer_secret: config.credential.twitter.consumer_secret,
      access_token_key: config.credential.twitter.access_token_key,
      access_token_secret: config.credential.twitter.access_token_secret
    });

    client.post('statuses/update', {status: 'tweeting test from firebase function'}, function(error, tweet, response) {
      if (error) {
        console.log(error);
      }
    });

    res.send('ok');

  } else {
    res.send("Not Found Config");
  }
});