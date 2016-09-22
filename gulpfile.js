const gulp = require("gulp");
const typescript = require("gulp-typescript");
const nodemon = require("gulp-nodemon");
const mjml = require("gulp-mjml");
const fs = require("fs");
const foreach = require("gulp-foreach");
const glob = require("glob");
const mkdirp = require("mkdirp");
const getDirName = require("path").dirname;
const config = JSON.parse(fs.readFileSync("./src/config/config.json"));
const forever = require("forever-monitor");
const sass = require("gulp-sass");
const inlineNg2Template = require("gulp-inline-ng2-template");
const tsConfig = typescript.createProject("./tsconfig.json", { typescript: require("typescript")});
const tsConfigNode = typescript.createProject("./tsconfigNode.json", { typescript: require("typescript")});
const webpack = require("webpack");
let spawn = require("child_process").spawn,node;

let webpackConfig = require("./../../Desktop/Socotra/webpack.config.js");

console.log("----------------------------------------------------------");
console.log("");
console.log("");
if (config.NODE_ENV === "development") {
    webpackConfig = require("./../../Desktop/Socotra/webpack.config.dev.js");


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
        '!' + config.srcTSFiles,
        "!" + config.mainStyleFolder + "/**",
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
    let layout = fs.readFileSync(config.emailMainLayout, "utf8");

//Insert the layout param to the template
    for (let key in layoutParms) {
        //For replace all string not only the first
        //string we use regex with g
        var re = new RegExp('{{' + key +'}}', 'g');
        layout = layout.replace(re, layoutParms[key]);
    }

    glob.sync(config.emailSrcDir).forEach((filePath, idx, array) => {
        //If the filePath is folder we skip to the next one
        if (fs.statSync(filePath).isDirectory()) {
            return;
        }

        let fileName = filePath.split('/');
        fileName = fileName[fileName.length -1];
        const fileContent =  fs.readFileSync(filePath, "utf8");
        let template = layout.replace('{{body}}', fileContent);
        writeFile(config.emailPartialsBuild + '/' + fileName, template, function () {
            if (idx === array.length - 1){
                cb();
            }
        });
    });
});


//Compile email from MJML to HTML
gulp.task('compileEmail',['buildEmailParts'], () => {
    return gulp.src(config.emailPartialsBuild + '/*.mjml')
        .pipe(mjml())
        .pipe(gulp.dest(config.emailBuildDir))
});


//Compile SASS to CSS
gulp.task('compileSASS', [], () => {
    return gulp.src(config.mainStyleFile)
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest(config.buildDir + '/public/css'));
});


//compile all the server side file to ES6 for Node.JS
gulp.task('compileTSServer', [], () => {
    return gulp.src([config.srcTSFiles ,"!" + config.angularTSFile])
        .pipe(typescript(tsConfigNode))
        .pipe(gulp.dest(config.buildDir));
});

//compile all the client side file to ES5
gulp.task('compileTSClient', [], () => {
    return gulp.src([config.angularTSFile])
        .pipe(inlineNg2Template({
            useRelativePaths: false,
            base: config.srcFolder + '/public/app/',
            removeLineBreaks: true,
            indent: 1
        }))
        .pipe(typescript(tsConfig))
        .pipe(gulp.dest(config.angularBuildFolder));
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
        if (code === 8) {
            gulp.log('Error detected, waiting for changes...');
        }
    });
});

//Compile and run server
gulp.task('startServer', ['compile'],  () => {
    gulp.start('serve');

//watch for email template change
    gulp.watch(config.srcFolder + "/views/email/**");


    gulp.watch(config.srcFolder + "/public/scss/**" , ['compileSASS']);


    gulp.watch(config.srcFolder +"/public/app/**" , ['webpack']);

    gulp.watch([
        config.srcFolder +"/**",
        "!" + config.srcFolder + "/public/**"
    ] , ['compileTSServer']);

    let waiter;
    gulp.watch(config.buildDir + "/**" , function () {
        clearTimeout(waiter);
        waiter = setTimeout(function () {
            console.log("change in build dir restart server");
            gulp.start('serve');
        }, 2000);
    });


    /*
     if (config.NODE_ENV === "development") {
     const nodemonOptions = {
     script: config.serverStart,
     ext: 'ts json mjml html scss'
     };

     nodemon(nodemonOptions).on('restart',['compile'], () => {
     setTimeout(() => {
     console.log("change detected resetting server");
     }, 500)
     });
     } else {
     let child = new(forever.Monitor)(config.serverStart, {
     max: 3,
     silent: true,
     args: []
     });

     child.on('exit', function() {
     console.log('app.js has exited after 3 restarts');
     });

     child.start();
     }
     */
});

gulp.task('test', () => {
    console.log("Should run test");
});


gulp.task('compile', ['copySrcFolder', 'buildEmailParts', 'compileEmail',
    'compileSASS', 'compileTSServer', 'compileTSClient', 'webpack']);

gulp.task('run', ['startServer']);