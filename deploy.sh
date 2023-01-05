#!/bin/bash
CURRENT_BASH_SCRIPT="${BASH_SOURCE[0]}"
PROJECT_CODE_FOLDER="$( cd "$( dirname "${CURRENT_BASH_SCRIPT}" )" >/dev/null 2>&1 && pwd )"
NODEJS_VERSION="15"
printf "${RED}*** Project code folder is ${PROJECT_CODE_FOLDER}, ${USER} ***${NC}\n";
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

REQUIRED_PACKAGES='apt-transport-https libcurl4-openssl-dev build-essential curl git ssh nano chrpath libssl-dev libxft-dev libfreetype6 libfontconfig1 sudo libjpeg-dev libpixman-1-dev libcairo2-dev libpango1.0-dev node-typescript'

sudo ln -sf /usr/share/zoneinfo/${SERVER_TIMEZONE} /etc/localtime;
export NODE_ENV=production;

# Required Packages process:
# 1. Check to see if we're missing any of the packages listed in REQUIRED_PACKAGES string using dpkg -s command
# 2. If we're missing some packages, run apt-get update and apt-get install to grab them.
# NOTE: NodeJS is also installed at this stage via https://deb.nodesource.com/setup_6.x

sudo dpkg -s ${REQUIRED_PACKAGES} 2>/dev/null >/dev/null || (
  printf "${RED}*** Installing missing packages via apt-get ***${NC}\n";
  sudo apt-get update;
  sudo apt-get install -y apt-transport-https build-essential curl;
  sudo apt-get install -y ${REQUIRED_PACKAGES});

# Add this script to crontab on system start
CRONTAB_FILENAME="$( basename "${PROJECT_CODE_FOLDER}" )"
printf "${RED}*** Crontab file for this bash script is ${CRONTAB_FILENAME} ***${NC}\n";

[[ -f "/etc/cron.d/${CRONTAB_FILENAME}" ]] && sudo rm "/etc/cron.d/${CRONTAB_FILENAME}";

echo "SHELL=/bin/sh
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
@reboot ${USER} /bin/bash ${CURRENT_BASH_SCRIPT}" | sudo tee "/etc/cron.d/${CRONTAB_FILENAME}";


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
# Extract current version of node_modules.tar.gz into /tmp/node_modules
cd "/tmp";
[[ -d ./node_modules ]] && sudo rm -R ./node_modules;
[[ -f "${PROJECT_CODE_FOLDER}/node_modules.tar.gz" ]] && sudo tar -zxf "${PROJECT_CODE_FOLDER}/node_modules.tar.gz";

# Copy over the node_modules directory if its not there already
[[ -d "${PROJECT_CODE_FOLDER}/node_modules" ]] || mv "/tmp/node_modules/" "${PROJECT_CODE_FOLDER}/node_modules/";

# Compare extracted /tmp/node_modules to current /node_modules version
([[ -f "/tmp/node_modules/package.json" ]] && cmp -s "${PROJECT_CODE_FOLDER}/package.json" "/tmp/node_modules/package.json") || (
  printf "${RED}*** package.json file has been modified - running npm install ***${NC}\n";
  #npm config set loglevel="info";
  #npm config set progress=false;
  cd "${PROJECT_CODE_FOLDER}";
  [[ -d ./node_modules ]] && sudo rm -R ./node_modules;
  sudo npm install ./ --no-bin-links || exit 1;
  cp -ura ${PROJECT_CODE_FOLDER}/package.json ./node_modules/package.json;
  [[ -d ./node_modules/ascalongw-discord-bot ]] && sudo rm -R ./node_modules/ascalongw-discord-bot;

  # After npm install, zip the new node_modules folder up for future deployments
  sudo tar -zcf "${PROJECT_CODE_FOLDER}/node_modules.tar.gz" node_modules;
);

# Remove /tmp/node_modules
[[ -d "/tmp/node_modules" ]] && sudo rm -R "/tmp/node_modules";

# Combine all of the above commands into a single string. touch /tmp/forever.log && forever start -a -l /tmp/forever.log -o /tmp/forever.log -e /tmp/forever.log server.js
printf "${RED}*** ${PROJECT_CONTAINER}: Restarting server.js (forever stopall && forever start server.js) ***${NC}\n";

# Run rest of deployment process.
cd "${PROJECT_CODE_FOLDER}";
node deploy.js;