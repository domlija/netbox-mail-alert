
let express = require('express');
let app = express();

const fs = require('fs');
let nodeMailer = require('nodemailer');

let bodyParser = require('body-parser');
const { Console } = require('console');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static('public'))

app.get('/', (req,res) => {
    res.sendFile('public/index.html')
})

app.post('/add', (req,res) => {
    fs.readFile('data.json', 'utf-8', (err, data) => {
    data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
    console.log(req.body)
    let d_map = new Map(Object.entries(data));
    let mail = req.body.email;
    let slug = req.body.slug;

    let curr = d_map.get(mail);

    if (curr == undefined) {
        d_map.set(mail, []);
        curr = d_map.get(mail)
    }

    if (!curr.includes(slug)) {
        curr.push(slug)
    }

    let s = JSON.stringify(Object.fromEntries(d_map));

    fs.writeFile('data.json', s ,(err) => {
        console.log(err)
    });
    res.redirect('/')
    })
    
})

app.post('/del', (req,res) => {
    fs.readFile('data.json', 'utf-8', (err, data) => {
    data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
    console.log(req.body)
    let d_map = new Map(Object.entries(data));
    let mail = req.body.email;
    let slug = req.body.slug;

    let curr = d_map.get(mail);

    if (curr == undefined) {
        res.redirect('/');
        return;
    }

    if (curr.includes(slug)){
        curr.splice(curr.indexOf(slug),1);
        if(curr.length == 0) {
            d_map.delete(mail)
        }
    }

    let s = JSON.stringify(Object.fromEntries(d_map));

    fs.writeFile('data.json', s, (err) => {
        console.log("up")
    });

    res.redirect('/')
    })
    

})

app.post('/show', (req,res) => {
    
    fs.readFile('data.json', 'utf-8', (err, data) => {
        
        data = JSON.parse(data);
        console.log(req.body)
        let d_map = new Map(Object.entries(data));
        let mail = req.body.email;
        let slug = req.body.slug;

        let curr = d_map.get(mail);

        if (curr == undefined) {
            res.send(JSON.stringify(["no such user!"]));
            return;
        }
        console.log(curr)
        res.json(JSON.stringify(curr))
    })
    
})

app.post('/send', (req,res) => {
    fs.readFile('data.json', 'utf-8', (err, data) => {
    data = JSON.parse(data);
    let d_map = new Map(Object.entries(data));

    let m_list = []
    console.log(req.body)
    const device = req.body.data.name
    console.log(device)
    for (const [k,v] of Object.entries(data)) {
        if (v.includes(device)) {m_list.push(k)}
    }

    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'random@gmail.com',
            pass: 'app_pass'
        }
    });

    let mailOptions = {
        from: '"user" <random@gmail.com>', // sender address
        to: m_list, // list of receivers
        subject: "my subject", // Subject line
        text: "my message)", // plain text body
        //html: '<b>NodeJS Email Tutorial</b>' // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
            res.send('hej');
    });
    })
    


})




app.listen(3333)
