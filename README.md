# ascalongw-discord-bot

## Prerequisites

NodeJS 14 or higher
NPM 6 or higher
Vagrant & Virtualbox if deploying to a server or VM

`.env.rb` is not included in the repository; see below for use
`ssh/3vcloud_ssh_key.ppk` is used for production deployment, but the ssh folder is not included in the repository; used for production deployment.

## Local deployment

`npm install --include-dev`
`npm run build`
`npm run dev`

## Local deployment (VM)

Ensure `ENV["ASCALONGW-TOKEN"]` is a valid token for the bot, or define `ENV["ASCALONGW-TOKEN"] = "<your_token>"` in `env.rb`

`vagrant up local --provision` to bring the server up
`vagrant provision local` to rebuild/restart the bot
`vagrant halt local` to stop the VM

## Production deployment

Jon has SHH keys for production server, but its basically the same as above with a different machine name.
Reve has the AscalonGW bot token, ask him for it before deploying