/*
* NodeJS Deployment script
* Allows loading in server_config.json and doing stuff without worrying about environment variables.
*/
console.log("***\n* NodeJS Deploy script started @ "+__filename+"\n***\n");
const { exec,spawn } = require("child_process");
const fs = require('fs');
const server_config = JSON.parse(fs.readFileSync(__dirname+'/server_config.json'));

// Promosified shell command
async function cmd(cmd, log_output = true, throw_on_fail = true) {
  return new Promise((resolve, reject) => {    
    let stdout_buf = '', stderr_buf='', options = {};
    let first_arg = cmd;
    if(typeof cmd == 'string') {
      options.shell = true;
      cmd = [];
    } else {
      first_arg = cmd.shift();
    }
    let spawn_args = [first_arg,cmd,options];
    console.log(' >>> '+([first_arg].concat(cmd).join(' ')));
    let proc    = spawn.apply(exec,spawn_args);
    proc.stdout.on('data', function (data) {
      if(log_output) console.log(' <<< ' +data.toString());
      stdout_buf += data.toString();
    });

    proc.stderr.on('data', function (data) {
      if(log_output) console.log(' <<< '+data.toString());
      stdout_buf += data.toString();
    });
    if(throw_on_fail)
      proc.on('error', reject);
    proc.on('exit', function (code) {
      if(code != 0 && throw_on_fail) {
      console.log(' <<< '+stdout_buf);
      return reject(code);
    }
      return resolve(stdout_buf);
    });
  });
}
(async function deploy() {
  await cmd("sudo cp -ura server_config.json config.json;");
  await cmd("sudo npm run build;");
  await cmd("sudo forever stopall;");
  await cmd("sudo touch /tmp/forever.log;");
  await cmd("sudo chmod 777 /tmp/forever.log;");
  
  server_config.tokens.forEach(async function(token) {
    if(token) {
      await cmd(`sudo forever start -a -l /tmp/forever.log -s -c "node --expose-gc" ${PROJECT_CODE_FOLDER}/dist/src/index.js ${token};`);
    }
  });
})();