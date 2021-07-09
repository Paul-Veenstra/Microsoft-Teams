//
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license.
//
const crypto = require('crypto');
const sharedSecret = ""; // e.g. "+ZaRRMC8+mpnfGaGsBOmkIFt98bttL5YQRq3p2tXgcE="
const bufSecret = Buffer(sharedSecret, "base64");

var http = require('http');
var PORT = process.env.port || process.env.PORT || 8080;
http.createServer(function(request, response) {
    var payload = '';
    // Process the request
    request.on('data', function(data) {
        payload += data;
    });

    // Respond to the request
    request.on('end', function() {
        try {
            // Retrieve authorization HMAC information
            var auth = this.headers['authorization'];
            // Calculate HMAC on the message we've received using the shared secret			
            var msgBuf = Buffer.from(payload, 'utf8');
            var msgHash = "HMAC " + crypto.createHmac('sha256', bufSecret).update(msgBuf).digest("base64");
            // console.log("Computed HMAC: " + msgHash);
            // console.log("Received HMAC: " + auth);

            response.writeHead(200);
            if (msgHash === auth) {
                var receivedMsg = JSON.parse(payload);

				// The text received to webhook
				var receivedText = receivedMsg.text;

				// The message sent by webhook
                var responseMsg = '';

                switch (true) {
                    case (receivedText.indexOf("adaptive-card") != -1):
                        // Creating adaptive card response
                        responseMsg = JSON.stringify({
                            "type": "message",
                            "attachments": [

                                {
                                    "contentType": "application/vnd.microsoft.card.adaptive",
                                    "contentUrl": null,
                                    "content": {
                                        "type": "AdaptiveCard",
                                        "version": "1.4",
                                        "body": [

                                            {
                                                "type": "TextBlock",
                                                "text": "Request sent by: " + receivedMsg.from.name

                                            },
                                            {
                                                "type": "Image",
                                                "url": "https://c.s-microsoft.com/en-us/CMSImages/DesktopContent-04_UPDATED.png?version=43c80870-99dd-7fb1-48c0-59aced085ab6"

                                            },
                                            {
                                                "type": "TextBlock",
                                                "text": "Sample image for Adaptive Card."

                                            }
                                        ]
                                    },
                                    "name": null,
                                    "thumbnailUrl": null

                                }
                            ]
                        });
                        break;

					case (receivedText.indexOf("hero-card") != -1):
                        // Creating hero card response
                        responseMsg = JSON.stringify({
                            "type": "message",
                            "attachments": [

                                {
                                    "contentType": "application/vnd.microsoft.card.hero",
                                    "content": {
                                        "title": "Seattle Center Monorail",
                                        "subtitle": "Seattle Center Monorail",
                                        "text": "The Seattle Center Monorail is an elevated train line between Seattle Center (near the Space Needle) and downtown Seattle. It was built for the 1962 World's Fair. Its original two trains, completed in 1961, are still in service.",
                                        "images": [

                                            {
                                                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Seattle_monorail01_2008-02-25.jpg/1024px-Seattle_monorail01_2008-02-25.jpg"

                                            }
                                        ],
                                        "buttons": [

                                            {
                                                "type": "openUrl",
                                                "title": "Official website",
                                                "value": "https://www.seattlemonorail.com"

                                            },
                                            {
                                                "type": "openUrl",
                                                "title": "Wikipeda page",
                                                "value": "https://en.wikipedia.org/wiki/Seattle_Center_Monorail"

                                            }
                                        ]
                                    }
                                }
                            ]
                        });
                        break;

					case (receivedText.indexOf("list-card") != -1):
                        // Creating list card response
                        responseMsg = JSON.stringify({
                            "type": "message",
                            "attachments": [

                                {
                                    "contentType": "application/vnd.microsoft.teams.card.list",
                                    "content": {
                                        "title": "Card title",
                                        "items": [

                                            {
                                                "type": "file",
                                                "id": "https://contoso.sharepoint.com/teams/new/Shared%20Documents/Report.xlsx",
                                                "title": "Report",
                                                "subtitle": "teams > new > design",
                                                "tap": {
                                                    "type": "imBack",
                                                    "value": "editOnline https://contoso.sharepoint.com/teams/new/Shared%20Documents/Report.xlsx"

                                                }
                                            },
                                            {
                                                "type": "resultItem",
                                                "icon": "https://cdn2.iconfinder.com/data/icons/social-icons-33/128/Trello-128.png",
                                                "title": "Trello title",
                                                "subtitle": "A Trello subtitle",
                                                "tap": {
                                                    "type": "openUrl",
                                                    "value": "http://trello.com"

                                                }
                                            },
                                            {
                                                "type": "section",
                                                "title": "Manager"

                                            },
                                            {
                                                "type": "person",
                                                "id": "JohnDoe@contoso.com",
                                                "title": "John Doe",
                                                "subtitle": "Manager",
                                                "tap": {
                                                    "type": "imBack",
                                                    "value": "whois JohnDoe@contoso.com"

                                                }
                                            }
                                        ],
                                        "buttons": [

                                            {
                                                "type": "imBack",
                                                "title": "Select",
                                                "value": "whois"

                                            }
                                        ]
                                    }
                                }
                            ]
                        });
                        break;

					case (receivedText.indexOf("o365-card") != -1):
                        // Creating O365 card response
                        responseMsg = JSON.stringify({
                            "type": "message",
                            "attachments": [

                                {
                                    "contentType": "application/vnd.microsoft.teams.card.o365connector",
                                    "content": {
                                        "@type": "MessageCard",
                                        "@context": "http://schema.org/extensions",
                                        "summary": "John Doe commented on Trello",
                                        "title": "Project Tango",
                                        "sections": [

                                            {
                                                "activityTitle": "John Doe commented",
                                                "activitySubtitle": "On Project Tango",
                                                "activityText": "\"Here are the designs\"",
                                                "activityImage": "http://connectorsdemo.azurewebsites.net/images/MSC12_Oscar_002.jpg"

                                            },
                                            {
                                                "title": "Details",
                                                "facts": [

                                                    {
                                                        "name": "Labels",
                                                        "value": "Designs, redlines"

                                                    },
                                                    {
                                                        "name": "Due date",
                                                        "value": "Dec 7, 2016"

                                                    },
                                                    {
                                                        "name": "Attachments",
                                                        "value": "[final.jpg](http://connectorsdemo.azurewebsites.net/images/WIN14_Jan_04.jpg)"

                                                    }
                                                ]
                                            },
                                            {
                                                "title": "Images",
                                                "images": [

                                                    {
                                                        "image": "http://connectorsdemo.azurewebsites.net/images/MicrosoftSurface_024_Cafe_OH-06315_VS_R1c.jpg"

                                                    },
                                                    {
                                                        "image": "http://connectorsdemo.azurewebsites.net/images/WIN12_Scene_01.jpg"

                                                    },
                                                    {
                                                        "image": "http://connectorsdemo.azurewebsites.net/images/WIN12_Anthony_02.jpg"

                                                    }
                                                ]
                                            }
                                        ],
                                        "potentialAction": [

                                            {
                                                "@context": "http://schema.org",
                                                "@type": "ViewAction",
                                                "name": "View in Trello",
                                                "target": [

                                                    "https://trello.com/c/1101/"
                                                ]
                                            }
                                        ]
                                    }
                                }
                            ]
                        });
                        break;
                    default:
                        // Sending plain text as response message	
                        responseMsg = '{ "type": "message", "text": "You typed: ' + receivedMsg.text + '" }';
                        break;
                }
            } else {
                var responseMsg = '{ "type": "message", "text": "Error: message sender cannot be authenticated." }';
            }
            response.write(responseMsg);
            response.end();
        } catch (err) {
            response.writeHead(400);
            return response.end("Error: " + err + "\n" + err.stack);
        }
    });

}).listen(PORT);

console.log('Listening on port %s', PORT);