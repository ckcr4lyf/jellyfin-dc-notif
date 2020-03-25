const sqlite3 = require('sqlite3').verbose();

import { scanDB } from './functions';
import { dbpath } from './config.json';
import * as fs from 'fs';

// let timeFrom = new Date();
let timeFrom = new Date("2020-03-25 12:34:35.8228137Z"); //Hardcoded for testing
let lock = false;

if(!fs.existsSync(dbpath)){
    console.log("DB (at given path) does not exist! Check ./build/config.json");
    process.exit(1);
}

let db = new sqlite3.Database(dbpath, (err: any) => {
    if (err){
        console.log(err);
    }

    console.log("Connected to DB.");
});

fs.watch(dbpath, async (event, filename) => {
    
    if (lock){
        return;
    }

    lock = true;
    console.log(event, filename);
    timeFrom = await scanDB(db, timeFrom);
    console.log("New timeFrom is", timeFrom);
    lock = false;
});