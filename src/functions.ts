import * as https from 'https';
import { webhook, debug } from './config.json';
import { action } from './declarations';

function log (msg: string) {
    if (debug == true){
        console.log(msg);
    }
}

function wait (time: number): Promise<boolean> {
    return new Promise( (resolve, reject) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    })

}

async function sendMessage (message: string): Promise<boolean> {

    const data = JSON.stringify({
        "username": "Jellyfin",
        "content": message
    });

    const options = {
        hostname: "discordapp.com",
        port: 443,
        path: webhook.substr(22),
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        }
    }

    await wait(500); //To avoid discord rate limit. Bad to hardcode yes I know.

    return new Promise( (resolve, reject) => {

        const req = https.request(options, res => {
            log('statusCode:' + res.statusCode.toString());
            resolve(true);

            // res.on("end", () => {
            //     resolve(true);
            // });

            // res.on("close", () => {
            //     resolve(true);
            // });
        });
    
        req.on("error", err => {
            console.error(err);
            reject(false);
        })
    
        req.write(data);
        req.end();
    });
}

export async function scanDB (db: any, timeFrom: Date): Promise<Date> {
    
    let sql: string = `SELECT * FROM ActivityLog WHERE Type IN ("VideoPlayback", "VideoPlaybackStopped") ORDER BY Datecreated DESC LIMIT 10`;
    console.log("Scanning DB...");
    
    return new Promise( (resolve, reject) => {
        db.all(sql, [], async (err: any, rows: action[]) => {
            if (err){
                console.log(err);
            }
        
            rows = rows.reverse();
            log("We have " + rows.length.toString() + " rows.");
        
            for (let i = 0; i < rows.length; i++){
                let row: action = rows[i];
                let thatDate = new Date(row.DateCreated);

                if (thatDate > timeFrom){
                    log("Sending a message...");
                    await sendMessage(row.Name + " - " + thatDate.toISOString());
                    log("Message sent for " + row.Name + "!");                    
                }
            }
        
            timeFrom = new Date();
            console.log("Scan Complete.");
            resolve(timeFrom); //If there was nothing new, then set it to the current date
        });
    });

}