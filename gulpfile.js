const gulp = require("gulp");
const typescript = require("gulp-typescript");
const mjml = require("gulp-mjml");
const fs = require("fs");
const foreach = require("gulp-foreach");
const glob = require("glob");
const mkdirp = require("mkdirp");
const getDirName = require("path").dirname;
const config = JSON.parse(fs.readFileSync("./src/config/config.json"));
const sass = require("gulp-sass");
const inlineNg2Template = require("gulp-inline-ng2-template");
const tsConfig = typescript.createProject("./tsconfig.json", { typescript: require("typescript")});
const tsConfigNode = typescript.createProject("./tsconfigNode.json", { typescript: require("typescript")});
const webpack = require("webpack");
const karmaServer = require('karma').Server;
let spawn = require("child_process").spawn,node;

let webpackConfig = require("./webpack.config.js");

console.log("----------------------------------------------------------");
console.log("");
console.log("");
if (config.NODE_ENV === "development") {
    webpackConfig = require("./webpack.config.dev.js");


    console.log("   Running in development mode");
} else {
    console.log("   Running in production mode");
}
console.log("");
console.log("");
console.log("----------------------------------------------------------");


//Helper function that will write file
//also if the folder is not exist
function writeFile(path, contents, cb) {
    mkdirp(getDirName(path), function (err) {
        if (err) return cb(err);

        fs.writeFile(path, contents, cb);
    });
}


//Copy all of the src folder to the build directory
gulp.task("copySrcFolder", () => {
    return gulp.src([
        config.srcFolder + "/**",
        '!' + config.srcFolder + "/**/*.ts",
        "!" + config.srcFolder + "/public/scss/**",
        "!" + config.srcFolder + "/public/less/**",
        "!" + config.srcFolder + "/public/app/**",
        "!" + config.srcFolder + "/views/email/**",
        "!" + config.srcFolder + "/public/app/**"
    ])
        .pipe(gulp.dest(config.buildDir))
});


//Build the email partials
gulp.task('buildEmailParts', [], (cb) => {
    let layoutParms = {
        _appName: config.appName,
        _year: new Date().getFullYear()
    };
    let layout = fs.readFileSync(config.srcFolder + "/views/email/layouts/main.layout.mjml", "utf8");

//Insert the layout param to the template
    for (let key in layoutParms) {
        //For replace all string not only the first
        //string we use regex with g
        var re = new RegExp('{{' + key +'}}', 'g');
        layout = layout.replace(re, layoutParms[key]);
    }

    glob.sync(config.srcFolder + "/views/email/*.mjml").forEach((filePath, idx, array) => {
        //If the filePath is folder we skip to the next one
        if (fs.statSync(filePath).isDirectory()) {
            return;
        }

        let fileName = filePath.split('/');
        fileName = fileName[fileName.length -1];
        const fileContent =  fs.readFileSync(filePath, "utf8");
        let template = layout.replace('{{body}}', fileContent);
        writeFile(config.buildDir + "/views/email/partialsBuild/" + fileName, template, function () {
            if (idx === array.length - 1){
                cb();
            }
        });
    });
});


//Compile email from MJML to HTML
gulp.task('compileEmail',['buildEmailParts'], () => {
    return gulp.src(config.buildDir + "/views/email/partialsBuild/*.mjml")
        .pipe(mjml())
        .pipe(gulp.dest(config.buildDir + "/views/email/build/"))
});


//Compile SASS to CSS
gulp.task('compileSASS', [], () => {
    return gulp.src(config.srcFolder + "/public/scss/style.scss")
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest(config.buildDir + '/public/css'));
});


//compile all the server side file to ES6 for Node.JS
gulp.task('compileTSServer', [], () => {
    return gulp.src([config.srcFolder + "/**/*.ts" ,"!" + config.srcFolder + "/public/app/**/*.ts"])
        .pipe(typescript(tsConfigNode))
        .pipe(gulp.dest(config.buildDir));
});

//compile all the client side file to ES5
gulp.task('compileTSClient', [], () => {
    return gulp.src([config.srcFolder + "/public/app/**/*.ts"])
        .pipe(inlineNg2Template({
            useRelativePaths: false,
            base: config.srcFolder + '/public/app/',
            removeLineBreaks: true,
            indent: 1
        }))
        .pipe(typescript(tsConfig))
        .pipe(gulp.dest(config.buildDir + "/public/app/"));
});


gulp.task("webpack", ['compileTSClient'], (cb) => {
    // modify some webpack config options
    var myConfig = Object.create(webpackConfig);

// run webpack
    webpack(myConfig, (err, stats) => {
        if (err) {
            console.log(err);
        }

        cb();
    });
});

gulp.task("serve", () => {
    if (node) node.kill();
    node = spawn('node', [config.serverStart], {stdio: 'inherit'});
    node.on('close', function (code) {
        if(code === null) {
            return;
        }

        if (config.NODE_ENV === "development") {
            console.log('Error detected, waiting for changes...');
        } else {
            console.log("server stop restart in 3 sec..");
            setTimeout(()=> {
                gulp.start('serve');
            }, 3000);
        }
    });
});


var taskCounter = 0;
gulp.task('addToTaskCounter', function () {
    taskCounter++;
});

gulp.task('ServerStart', function () {
    taskCounter--;

    // there are active task that didn't finished yet
    // so the last task will restart the server
    // so wee can skip restart
    if (taskCounter > 0) {
        return;
    }

    gulp.start('serve');
});




//Compile and run server
gulp.task('startServer', ['compile'],  () => {
    gulp.start('serve');

    //watch for email template change
    gulp.watch(config.srcFolder + "/views/email/**", function() {
        runSequence('addToTaskCounter', 'compileEmail', 'ServerStart');
    });


    gulp.watch(config.srcFolder + "/public/scss/**" , function() {
        runSequence('addToTaskCounter', 'compileSASS', 'ServerStart');
    });


    gulp.watch(config.srcFolder +"/public/app/**" , function() {
        runSequence('addToTaskCounter', 'webpack', 'ServerStart');
    });

    gulp.watch([
        config.srcFolder +"/**",
        "!" + config.srcFolder + "/public/**"
    ] , function() {
        runSequence('addToTaskCounter', 'compileTSServer', 'ServerStart');
    });
});

gulp.task('test', ['webpack'], (done) => {
    new karmaServer({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, function() { done(); }).start();
});

var runSequence = require('run-sequence');
gulp.task('compile', ['copySrcFolder', 'compileEmail',
    'compileSASS', 'compileTSServer', 'compileTSClient', 'webpack']);

gulp.task('run', ['startServer']);