# *consume the chalk*

## What is this?
*consume the chalk* is a RESTful API with a React front-end written in TypeScript. This service lets you query for all chalkboards on the UNC Charlotte campus that fit a set of user-provided requirements, such as number of chalkboards in a room, the color of the chalkboard, and whether or not there is currently a class going on at a given time.

## Setting up environment and initializing database
Run `npm install` to get all dependencies. Afterwards, fetch the class schedule for a given semester by accessing UNCC Banner, selecting `Student Services > Registration > Look-up Classes to Add`, selecting the desired term to use, choose `Advanced Search`, select all subjects, and run the `Section Search`. Once this is done, save the HTML by hitting `Ctrl-S` and save the data to the `scraper` directory, renaming the main HTML to `classes.html`. Once this is done, you can run `npm run scrape` to generate the database schema along with the class schedules in CSV format.

TODO: Give directions for starting SQL server

## Building client and server
Running `npm run build` should compile the TypeScript of both the client and server applications while also WebPacking the client.

## Running server
`npm start` will start the Express app while also checking for `id_rsa.pub` within the current working directory, which will be used to verify updates made from the admin panel. If this is not present, the app will run in insecure mode with no RSA signature verification.
