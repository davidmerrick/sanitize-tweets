import fs from 'fs'
import Entities from 'html-entities'

const PATH = `${__dirname}/data`;

function sanitizeTweets() {
    // Read all files into an array
    var fileArray = [];
    fs.readdirSync(PATH).forEach(file => {
        fileArray.push(PATH + "/" + file);
    });

    // Concatenate data from those files
    let tweets = [];
    try {
        fileArray.forEach(item => {
            let data = fs.readFileSync(item, 'utf8');
            let jsonArray = JSON.parse(data);
            tweets = tweets.concat(jsonArray);
        });
    } catch (e) {
        return console.error(e);
    }

    // Decode HTML entities
    tweets = tweets.map(tweet => {
        tweet.text = Entities.XmlEntities.decode(tweet.text);
        return tweet;
    });

    // Filter data
    tweets.filter(item => {
        return item.is_retweet === false;
    });

    tweets.forEach(item => {
        console.log(item.text);
        console.log('\n\n');
    });
}

sanitizeTweets();