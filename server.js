
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
    let data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
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

    fs.writeFileSync('data.json', s);
    res.redirect('/')
})

app.post('/del', (req,res) => {
    let data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
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

    fs.writeFileSync('data.json', s);

    res.redirect('/')

})

app.post('/show', (req,res) => {
    let data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
    console.log(req.body)
    let d_map = new Map(Object.entries(data));
    let mail = req.body.email;
    let slug = req.body.slug;

    let curr = d_map.get(mail);

    if (curr == undefined) {
        res.send("no such user!");
        return;
    }

    res.json(JSON.stringify(curr))
})

app.post('/send', (req,res) => {
    let data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
    let d_map = new Map(Object.entries(data));

    let m_list = []
    console.log(req.body)
    const device = req.body.data.slug
    console.log(device)
    for (const [k,v] of Object.entries(data)) {
        if (v.includes(device)) {m_list.push(k)}
    }

    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: '',
            pass: ''
        }
    });

    let mailOptions = {
        from: '', // sender address
        to: m_list, // list of receivers
        subject: "change", // Subject line
        text: "", // plain text body
        
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
            res.send('hej');
    });

})



app.listen(3333)
