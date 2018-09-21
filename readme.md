This project contains two main components:
1. The actual [monitor](monitor) that collects configured social media events.
2. A web based user interface to browse the collected data. The [webapp](webapp) is made of a [backend](webapp/backend/) component and a [frontend](webapp/frontend/) component.


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

### Runtime
`node index.js`



# Webapp

## Backend Rest Service
`npm start` will run the app on port 3000

## Frontend
`npm run build` will build the ui and put it in a build/ directory. Configure your http directives to direct port 80 at this folder.

When running locally you can use `npm run serve` to serve the build directory on port 8000.
Depending on how you run the backend you may need to adjust [BaseService.js](webapp/frontend/src/services/BaseService.js) to direct rest calls to the appropriate mount point for your backend.


# Deployment
- The deployment script (deploy.sh) relies on a .pem file in the root of the project.
- The deployment scripts expects to find the file [update_creds.sh](update_creds.sh) in the directory directly above this repository. This file updates the credentials in aws.json and twitter.js so that you don't have to manually enter the creds on the server every time you deploy.
- `./update_creds.sh (-h|-d|-c)`
  - -d : deploy latest master branch to production
  - -c : update config files with credentials (not stored in vcs)