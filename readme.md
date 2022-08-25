This is simple node.js app that allows users to subscribe to a device defined in netbox.<br>
Start this app and then create a webhook in netbox to send a post request to <app-ip>:3333/send

Data is saved to data.json in format of {email: [slug1, slug2, ...]}.<br> 
This is not a secure app and should be accessible from the local network only

