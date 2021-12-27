# *consume the chalk*

## What is this?
*consume the chalk* is a RESTful API with a React front-end written in TypeScript. This service lets you query for all chalkboards on the UNC Charlotte campus that fit a set of user-provided requirements, such as number of chalkboards in a room, the color of the chalkboard, and whether or not there is currently a class going on at a given time.

## Setting up environment and initializing database
Run `npm install` to get all dependencies. Afterwards, fetch the class schedule for a given semester by accessing UNCC Banner, selecting `Student Services > Registration > Look-up Classes to Add`, selecting the desired term to use, choose `Advanced Search`, select all subjects, and run the `Section Search`. Once this is done, save the HTML by hitting `Ctrl-S` and save the data to the `scraper` directory, renaming the main HTML to `classes.html`. Once this is done, you can run `npm run scrape` to generate the database schema along with the class schedules in CSV format. You can then import the outputted CSV into the `chalkboards` table using the Postgres `COPY` command.

## Building client and server
Running `npm run build` should compile the TypeScript of both the client and server applications while also WebPacking the client.

## Running server
`npm start` will start the Express app while also checking for a `PUBLIC_KEY` environment variable which will be used to verify updates made from the admin panel. If this is not present, the app will run in insecure mode with no RSA signature verification.

## API Documentation
The API endpoint is `"/chalkboards"`, with these parameters -

### Query Parameters
`color: ("black" | "brown" | "green")[]` An array of the desired chalkboard colors  
`panels: [integer, integer]` The inclusive range of panels that results should fall in
`number: integer` The minimum number of chalkboards that should be in the room  
`width: ("normal" | "wide" | "extra wide")[]` The desired chalkboard widths  
`days: bitmap<integer>` An 8-bit bitmap encoding the days of the week  
`start_time: string` The desired start time of the range  
`end_time: string` The desired end time of the range

For example, with an endpoint at `localhost:3000`, to get all rooms that have at least 3 black or green chalkboards and are available on Monday from 2:30PM to 3:30PM, the request would be

`localhost:3030/chalkboards?color=black&color=green&number=3&start_time=14:30&end_time=15:30&days=1`
