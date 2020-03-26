# Jellyfin Push Notifications

This program monitors the jellyfin activity DB for events and sends push notifications to a discord webhook when someone starts or stops playback.
Very rudeimentary stage, if you'd like to suggest a feature please open an issue!

## How to setup

Make sure your server has node and npm setup (this does not need root).
Here is a guide that should work on most systems: https://tecadmin.net/install-nodejs-with-nvm/

In some directory on your server (example `~/.apps/`), run:

```
git clone https://github.com/ckcr4lyf/jellyfin-dc-notif.git
cd jellyfin-dc-notif
```

to download the repository and go it.

Next install the necessary packages with:
```
npm install
```

To configure the program, you need to edit `./build/config.json` with your webhook URL and path to the jellyfin activity log database.

An example config.json is:

```
{
    "webhook": "https://discordapp.com/api/webhooks/692381889922727976/LwSqUxT0fZmxGG4rS4L4-qk_x4hcelugjI27uiY20kLO4FYEH5Z0VT87bWl4fvxzNPln",
    "dbpath": "/homexx/username/.apps/jellyfin/data/data/activitylog.db",
    "debug": false
}
```

`webhook` represent the entire discord webhook

`dbpath` is the absolute path to the jellyfin activity log database. The given example is the path on Ultraseedbox installations.

`debug` is a variable for logging, you can leave this as `false` or set to `true` to see some messy stuff.

To run this program, enter a screen session (`screen -S jelly-monitor` as an example) in the directory, and run `node ./build/index.js` or `npm start`