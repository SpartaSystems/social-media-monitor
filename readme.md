This project contains two main components.
1. The actual social media monitor that collects configured social media events
2. A web based user interface to browse the collected data. The webapp itself is made of a backend component and a frontend component.


# Monitor

### Monitoring setup
- Configure [credentials](https://console.aws.amazon.com/iam/home) for aws sdk in [aws.json](monitor/configuration/aws.json). The credentials should have permissions to AWS comprehend.
- Configure [credentials](https://developer.twitter.com) for twitter stream api in [twitter.js](monitor/configuration/twitter.js)
- Make sure you have a mongo database running locally and create a text index on the text column. `db.tweets.createIndex({"text":"text"})`

### Notifications setup
- Configure [smtp settings](monitor/configuration/app.js)
- Configure [notification filters](monitor/configuration/notification-filters/) to monitor for specific keywords/sentiment and indicate who should be notified. See sample filters for reference.
- For each filter type configure a corresponding email [notification template](monitor/src/templates/notifications)
- Logo and css styling for the email templates should go in the [media folder](monitor/media/)

## Runtime
shell$ node index.js



# Webapp

## Backend Rest Service
- shell$ npm start

## Frontend
- shell$ npm run build


# Deployment
- The deploy script (deploy.sh) relies on a .pem file in the root of the project.