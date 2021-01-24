#!/bin/bash
PROJECT_CODE_FOLDER="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
NODEJS_VERSION="15"
printf "${RED}*** Project code folder is ${PROJECT_CODE_FOLDER} ***${NC}\n";
SERVER_TIMEZONE="UTC"
if [ -f /sys/hypervisor/uuid ] && [ `head -c 3 /sys/hypervisor/uuid` == ec2 ]; then
  SERVER_IP=$(dig +short myip.opendns.com @resolver1.opendns.com)  # EC2 server, use dig to find our public IP.
else
  SERVER_IP=$(hostname -I | awk '{ print $NF}')   # Local server, get last IP from hostname array
fi
printf "${RED}*** Server IP is ${SERVER_IP} ***${NC}\n";

if [ "${SERVER_IP}" == "10.10.10.52" ]; then
  SSH_IP="10.10.10.1"
else
  SSH_IP=$(echo $SSH_CLIENT | awk '{ print $1}')
fi
printf "${RED}*** Connected ssh client is ${SSH_IP} ***${NC}\n";

REQUIRED_PACKAGES='apt-transport-https libcurl4-openssl-dev build-essential curl git ssh nano chrpath libssl-dev libxft-dev libfreetype6 libfontconfig1 certbot sudo libjpeg-dev libpixman-1-dev libcairo2-dev libpango1.0-dev'

sudo ln -sf /usr/share/zoneinfo/${SERVER_TIMEZONE} /etc/localtime; 
export NODE_ENV=production; 

# Required Packages process:
# 1. Check to see if we're missing any of the packages listed in REQUIRED_PACKAGES string using dpkg -s command
# 2. If we're missing some packages, run apt-get update and apt-get install to grab them.
# NOTE: NodeJS is also installed at this stage via https://deb.nodesource.com/setup_6.x

sudo dpkg -s ${REQUIRED_PACKAGES} 2>/dev/null >/dev/null || (
  printf "${RED}*** Installing missing packages via apt-get ***${NC}\n";
  sudo add-apt-repository ppa:certbot/certbot;
  sudo apt-get update && sudo apt-get install -y apt-transport-https build-essential curl;
  sudo apt-get install -y ${REQUIRED_PACKAGES});

# Install npm
npm -v | grep -q "[0-9]" || (sudo apt-get update && sudo apt install npm -y);
# npm -v 2>/dev/null > /dev/null || (curl -L https://npmjs.org/install.sh | sudo sh);

# Install nodejs
NODEJS_VERSION="15"
node -v | grep -q "v${NODEJS_VERSION}" || (
  # sudo apt-get remove nodejs -y;
  sudo npm cache clean -f;
  sudo npm install -g n;
  sudo n ${NODEJS_VERSION};
);
# NodeJS process:
# 1. Install forever package if not present
# 2. cd to /home directory and unpack node_modules.tar.gz into here.
# 3. Check to see if the package.json has been modified (via shasum), delete existing package.json and run npm install if it has.
# 4. Finally, repack the node_modules folder to flag it as modified - a Git commit will upload the new archive when the developer saves their changes.

printf "${RED}*** Installing any missing node_modules ***${NC}\n";
forever --help 2>/dev/null > /dev/null || sudo npm install forever -g;
cd "/tmp"; 
rm -R ./node_modules; 
tar -zxf "${PROJECT_CODE_FOLDER}/node_modules.tar.gz"
mkdir -p ./node_modules;
cmp -s "${PROJECT_CODE_FOLDER}/package.json" "./node_modules/package.json" || (
  printf "${RED}*** package.json file has been modified - running npm install ***${NC}\n"; 
  #npm config set loglevel="info"; 
  #npm config set progress=false; 
  cd "${PROJECT_CODE_FOLDER}";
  rm -R ./node_modules;
  sudo npm install ${PROJECT_CODE_FOLDER}/ && cp -ura ${PROJECT_CODE_FOLDER}/package.json ./node_modules/package.json;
  rm -R ./node_modules/ascalongw-discord-bot;
  tar -zcf "${PROJECT_CODE_FOLDER}/node_modules.tar.gz" node_modules);
cd "/tmp"; 
rm -R ./node_modules; 

# Combine all of the above commands into a single string. touch /tmp/forever.log && forever start -a -l /tmp/forever.log -o /tmp/forever.log -e /tmp/forever.log server.js

printf "${RED}*** ${PROJECT_CONTAINER}: Restarting server.js (forever stopall && forever start server.js) ***${NC}\n"; 
cd "${PROJECT_CODE_FOLDER}";

cp -ura server_config.json config.json;
sudo rm -R ./dist;
sudo npm run build;
sudo forever stop ${PROJECT_CODE_FOLDER}/dist/src/index.js;
sudo touch /tmp/forever.log; 
sudo chmod 777 /tmp/forever.log;
sudo forever start -a -l /tmp/forever.log -s -c "node --expose-gc" ${PROJECT_CODE_FOLDER}/dist/src/index.js;