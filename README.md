Project Build and Deployment using Gulp

This README file provides an overview of the Gulp tasks and setup used in this project for building, minifying, and deploying web assets.
Prerequisites

Ensure you have Node.js and npm installed. Additionally, this project uses environment variables. Create a .env file in the root directory with the following content:

HOST=<your_sftp_host>
USERNAME=<your_sftp_username>
PASSWORD=<your_sftp_password>
PORT=<your_sftp_port>

Folder Structure

    src/ - Source files
        sass/ - SASS/SCSS files
        ts/ - TypeScript files
        fonts/ - Font files
        *.html - HTML files
        *.php - PHP files
    dist/ - Distribution files (output directory)
        inc/css - Compiled and minified CSS
        inc/js - Compiled and minified JavaScript
        inc/sass - SASS source files
        inc/fonts - Font files
        config - Configuration files

Environment Variables

Set the following environment variables in the .env file for SFTP deployment:

    HOST - SFTP host
    USERNAME - SFTP username
    PASSWORD - SFTP password
    PORT - SFTP port

Additional Information

    Gulp Plugins Used:
        gulp-sass - Compiles SASS/SCSS files
        gulp-clean-css - Minifies CSS
        gulp-htmlmin - Minifies HTML
        gulp-postcss - Processes CSS with PostCSS plugins (e.g., TailwindCSS)
        gulp-typescript - Compiles TypeScript
        gulp-minify - Minifies JavaScript
        gulp-if - Conditional plugin for Gulp
        gulp-sftp-up4 - Uploads files via SFTP
        gulp-watch - Watches files for changes
