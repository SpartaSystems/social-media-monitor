#!/bin/bash

user=ubuntu
host=ec2-xx-xxx-xxx-xxx.us-east-1.compute.amazonaws.com
repo=git@github.com:SpartaSystems/social-media-monitor.git
script_dir=$(dirname $0)
temp=orion
source ${script_dir}/../update_creds.sh # contains update_creds() to update credential files

function execute() {
    while [ "$1" != "" ]; do
        case $1 in
            -h| help ) echo "Usage: deploy.sh (-d|-c)"
                       echo "-d : deploy latest master branch to production"
                       echo "-c : update config files with credentials (not stored in vcs)"
            ;;
            -d| deploy ) echo "deploying..."
                 git clone ${repo} ${temp}
                 update_creds ${script_dir}/${temp}/monitor/configuration # directory that has config files in it
                 rm -rf ${temp}/.git* ${temp}/deploy.sh
                 ssh -i "orion.pem" ${user}@${host} << EOF
                     rm -rf ${temp}.backup
                     mv ${temp} ${temp}.backup
EOF

                 scp -r -i "orion.pem" ${temp} ${user}@${host}:~
                 rm -rf ${temp}
                 ssh -i "orion.pem" ${user}@${host} << EOF
                     pidfile=~/pid.txt
                     cd ~/orion/webapp/frontend && npm install && npm run build
                     if [ -f \$pidfile ]; then
                         echo "killing processes based on pid.txt" 
                         while read line; do
                             kill -9 \$line
                         done < \$pidfile
                         rm \$pidfile 2> /dev/null
                     fi
                     cd ~/orion/webapp/backend && npm install
                     nohup npm start 1> webapp-out.log 2>&1 & echo \$! >> \$pidfile
                     cd ~/orion/monitor && npm install
                     nohup node index.js 1> monitor-out.log 2>&1 & echo \$! >> \$pidfile
                     cat \$pidfile
EOF

                echo "deployed successfully."
                ;;
            -c| config ) update_creds ${script_dir}
                ;;
        esac
    shift
	done
}

if [ $# -eq 0 ]; then
	execute -h
else
	execute $@
fi
