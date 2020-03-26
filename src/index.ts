const sqlite3 = require('sqlite3').verbose();

import { scanDB } from './functions';
import { dbpath } from './config.json';
import * as fs from 'fs';

let timeFrom = new Date();
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
    timeFrom = await scanDB(db, timeFrom);
    lock = false;
});