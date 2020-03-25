"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var https = require("https");
var config_json_1 = require("./config.json");
function log(msg) {
    if (config_json_1.debug == true) {
        console.log(msg);
    }
}
function wait(time) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(true);
        }, time);
    });
}
function generateSQLQuery(timeFrom) {
    var sql = "SELECT * FROM ActivityLog WHERE Type IN (\"VideoPlayback\", \"VideoPlaybackStopped\") AND Datecreated > \"" + timeFrom.toISOString() + "\" ORDER BY Datecreated DESC";
    return sql;
}
function sendMessage(message) {
    return __awaiter(this, void 0, void 0, function () {
        var data, options;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = JSON.stringify({
                        "username": "Jellyfin",
                        "content": message
                    });
                    options = {
                        hostname: "discordapp.com",
                        port: 443,
                        path: config_json_1.webhook.substr(22),
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json"
                        }
                    };
                    return [4 /*yield*/, wait(500)];
                case 1:
                    _a.sent(); //To avoid discord rate limit. Bad to hardcode yes I know.
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var req = https.request(options, function (res) {
                                log('statusCode:' + res.statusCode.toString());
                                resolve(true);
                                // res.on("end", () => {
                                //     resolve(true);
                                // });
                                // res.on("close", () => {
                                //     resolve(true);
                                // });
                            });
                            req.on("error", function (err) {
                                console.error(err);
                                reject(false);
                            });
                            req.write(data);
                            req.end();
                        })];
            }
        });
    });
}
function scanDB(db, timeFrom) {
    return __awaiter(this, void 0, void 0, function () {
        var sql;
        var _this = this;
        return __generator(this, function (_a) {
            sql = generateSQLQuery(timeFrom);
            console.log("Scanning DB...");
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    db.all(sql, [], function (err, rows) { return __awaiter(_this, void 0, void 0, function () {
                        var i, row;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (err) {
                                        console.log(err);
                                    }
                                    rows = rows.reverse();
                                    log("We have " + rows.length.toString() + " rows.");
                                    i = 0;
                                    _a.label = 1;
                                case 1:
                                    if (!(i < rows.length)) return [3 /*break*/, 4];
                                    row = rows[i];
                                    log("Sending a message...");
                                    return [4 /*yield*/, sendMessage(row.Name + " - " + row.DateCreated.toISOString())];
                                case 2:
                                    _a.sent();
                                    log("Message sent for " + row.Name + "!");
                                    _a.label = 3;
                                case 3:
                                    i++;
                                    return [3 /*break*/, 1];
                                case 4:
                                    timeFrom = new Date();
                                    console.log("Scan Complete.");
                                    resolve(timeFrom); //If there was nothing new, then set it to the current date
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                })];
        });
    });
}
exports.scanDB = scanDB;
//# sourceMappingURL=functions.js.map