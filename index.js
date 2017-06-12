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

    // Filter data
    tweets = tweets.filter(item => {
        let filterArray = [];
        let tweetText = item.text;
        filterArray.push(item.is_retweet === false);
        filterArray.push(!(tweetText[0] === "@" && tweetText.length < 50)); // filter out replies to other Twitter accounts
        filterArray.push(!(tweetText.startsWith(".@") && tweetText.length < 50)); // filter out replies to other Twitter accounts
        filterArray.push(!(tweetText[0] === "\"" && tweetText.indexOf("--" != -1))); // filter out quotations
        filterArray.push(!(tweetText[0] === "“" && tweetText.indexOf("--" != -1))); // filter out quotations
        filterArray.push(tweetText.match("-- [A-Za-z]+ [A-Za-z]+$") === null); // filter out quotations
        filterArray.push(tweetText.toLowerCase().match("[^A-Za-z]?tune in[^A-Za-z]") === null); // "tune in"
        filterArray.push(!tweetText.toLowerCase().endsWith("the art of the deal"));
        filterArray.push(!tweetText.toLowerCase().endsWith("midas touch"));
        filterArray.push(!tweetText.toLowerCase().startsWith("rt "));
        filterArray.push(!tweetText.toLowerCase().startsWith("via "));
        filterArray.push(!tweetText.toLowerCase().startsWith("check out "));
        filterArray.push(!tweetText.toLowerCase().startsWith("my interview "));
        filterArray.push(!tweetText.toLowerCase().startsWith("i'll be on "));
        filterArray.push(!tweetText.toLowerCase().startsWith("will be on "));
        filterArray.push(!tweetText.toLowerCase().startsWith("entrepreneurs:"));
        filterArray.push(!tweetText.toLowerCase().startsWith("i will be on "));
        filterArray.push(!tweetText.toLowerCase().startsWith("from donald trump: "));
        filterArray.push(!tweetText.toLowerCase().startsWith("donald trump appear"));
        filterArray.push(!(tweetText.toLowerCase().indexOf("my new book") != -1));
        filterArray.push(!(tweetText.toLowerCase().indexOf("premiere") != -1));
        filterArray.push(!(tweetText.toLowerCase().indexOf("finale") != -1));
        filterArray.push(!(tweetText.toLowerCase().indexOf(" will be on ") != -1));
        filterArray.push(!(tweetText.toLowerCase().indexOf("#tbt") != -1));
        filterArray.push(!(tweetText.toLowerCase().indexOf("albert einstein") != -1));
        filterArray.push(!(tweetText.toLowerCase().indexOf("happy birthday") != -1));
        filterArray.push(!(tweetText.toLowerCase().indexOf(" via @") != -1));
        filterArray.push(!(tweetText.toLowerCase().indexOf("interview") != -1 && tweetText.toLowerCase().indexOf("discussing") != -1));
        filterArray.push(!(tweetText.toLowerCase().indexOf("int.") != -1 && tweetText.toLowerCase().indexOf("discussing") != -1));
        filterArray.push(!(tweetText.toLowerCase().indexOf("winston churchill") != -1));
        filterArray.push(!(tweetText.toLowerCase().indexOf("thank you") != -1 && tweetText.toLowerCase().indexOf("#supertuesday") != -1));
        return !filterArray.includes(false);
    });

    // Decode HTML entities, strip out links
    tweets = tweets.map(tweet => {
        tweet.text = Entities.XmlEntities.decode(tweet.text);
        tweet.text = tweet.text.replace(/((http|https|ftp):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g, '');
        return tweet;
    });

    tweets.forEach(item => {
        console.log(item.text);
        console.log('\n\n');
    });
}

sanitizeTweets();