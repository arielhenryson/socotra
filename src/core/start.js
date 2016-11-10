const fs = require("fs");
const spawn = require("child_process").spawn;
const config = JSON.parse(fs.readFileSync("./src/config/config.json"));
let appProcess, compileProcess, watcher;
const chokidar = require('chokidar');

function clearProcess() {
    if (appProcess) appProcess.kill();
    if (compileProcess) compileProcess.kill();
    appProcess = null;
    compileProcess = null;
}

function compile() {
    clearProcess();

    compileProcess = spawn('gulp', ["compile", "--gulpfile", "./src/core/gulpfile.js"], { stdio: 'inherit' });

    compileProcess.on('close', () => {
        run();
    });
}

let intentionallyKill = false;
let watchSet = false;
function run() {
    clearProcess();

    appProcess = spawn('node', [config.serverStart], { stdio: 'inherit' });

    appProcess.on('close', () => {
        if(intentionallyKill) {
            intentionallyKill = false;
            return;
        }

        if (config.NODE_ENV === "development") {
            console.log('Error detected, waiting for changes...');
            return;
        }

        console.log("server stop restart in 3 sec..");
        setTimeout(() => {
            run();
        }, 3000);
    });



    if(!watchSet && config.NODE_ENV === "development") {
        watchSet = true;
        chokidar.watch('./src/**/*.*').on('change', path => {
            intentionallyKill = true;
            clearProcess();
            compile();
        });
    }
}


compile();/////////////////////////