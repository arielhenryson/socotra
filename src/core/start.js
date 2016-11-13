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

function compileClient() {
    clearProcess();

    compileProcess = spawn('gulp', ["webpack", "--gulpfile", "./src/core/gulpfile.js"], { stdio: 'inherit' });

    compileProcess.on('close', () => {
        run();
    });
}

function compileServer() {
    clearProcess();

    compileProcess = spawn('gulp', ["compileTSServer", "--gulpfile", "./src/core/gulpfile.js"], { stdio: 'inherit' });

    compileProcess.on('close', () => {
        run();
    });
}

function compileScss() {
    compileProcess = spawn('gulp', ["compileSASS", "--gulpfile", "./src/core/gulpfile.js"], { stdio: 'inherit' });
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
            console.log(path);

            // compile only client code
            if (path.search('/public/app/') > -1) {
                intentionallyKill = true;
                clearProcess();
                compileClient();
                return;
            }

            // if its typescript but not client side compile tsServer
            if (path.search('.ts') > -1) {
                intentionallyKill = true;
                clearProcess();
                compileServer();
                return;
            }

            // if its sass file
            if (path.search('/public/scss/') > -1) {
                compileScss();
                return;
            }


            intentionallyKill = true;
            clearProcess();
            compile();
        });
    }
}


compile();