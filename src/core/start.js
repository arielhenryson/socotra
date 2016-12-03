// set root folder
const ROOT = __dirname + "/../../.build/";
// end set root folder

const fs = require("fs");
const spawn = require("child_process").spawn;
const config = JSON.parse(fs.readFileSync("./src/config/config.json"));
let appProcess, compileProcess;
const chokidar = require('chokidar');

function clearProcess() {
    if (appProcess) process.kill(-appProcess.pid);
    if (compileProcess) compileProcess.kill();
    appProcess = null;
    compileProcess = null;
}

function compile(type) {
    clearProcess();

    compileProcess = spawn('gulp', [type, "--gulpfile", __dirname + "/gulpfile.js"], {
        stdio: 'inherit'
    });

    if (type === "compileSASS") return;

    compileProcess.on('close', () => {
        run();
    });
}

let intentionallyKill = false;
let watchSet = false;
function run() {
    clearProcess();

    appProcess = spawn('node', [ ROOT + "main.js"], {
        stdio: 'inherit',
        detached: true
    });

    appProcess.on('close', () => {
        if(intentionallyKill) {
            intentionallyKill = false;
            return;
        }

        if (config.development) {
            console.log('Error detected, waiting for changes...');
            return;
        }

        console.log("server stop restart in 3 sec..");

        let errorData = "Error server stop at " + new Date() + "\n";
        fs.appendFile("./errorLog.log", errorData);

        setTimeout(() => {
            run();
        }, 2000);
    });



    if(!watchSet && config.development) {
        watchSet = true;
        chokidar.watch('./src/**/*.*').on('change', path => {
            console.log(path);

            // compile only client code
            if (path.search('/public/app/') > -1) {
                clearProcess();
                compile("webpack");
                return;
            }

            // if its typescript but not client side compile tsServer
            if (path.search('.ts') > -1) {
                clearProcess();
                compile("compileTSServer");
                return;
            }

            // if its sass file
            if (path.search('/public/scss/') > -1) {
                compile("compileSASS");
                return;
            }


            intentionallyKill = true;
            clearProcess();
            compile("compile");
        });
    }
}


compile("compile");