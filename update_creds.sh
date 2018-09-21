#!/bin/bash

update_twitter_creds(){
	printf "module.exports = {
	Authentication : {
		consumer_key : '',
		consumer_secret : '',
		token : '',
		token_secret : ''
	}
};" > ${1}/twitter.js
}

update_aws_creds(){
	printf '{\n  "region":"",\n  "accessKeyId":"",\n  "secretAccessKey":""\n}' > ${1}/aws.json
}

update_creds(){
	echo "updating credentials"
	update_twitter_creds $1
	update_aws_creds $1
}