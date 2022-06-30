//environment variables - https://www.npmjs.com/package/dotenv
require('dotenv').config();

const http = require('http');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const officegen = require('officegen')
const fs = require('fs')
const path = require('path');
const PPTX = require('nodejs-pptx');

//Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', async (req, res) => {
    let pptx = new PPTX.Composer();

    await pptx.compose(pres => {
        pres.addSlide(slide => {
            slide.addText(text => {
                text.value('Hello World');
            });
        });
    });

    await pptx.save(`./hello-world.pptx`);
    return res.status(200).json({ re: true });
});


app.get('/download', async (req, res) => {
    try {

        // Create an empty PowerPoint object:
        let pptx = officegen('pptx')
        pptx.setDocTitle('Kabula Hill Bulletin')

        // Let's add a title slide:

        let slide = pptx.makeTitleSlide('Officegen', 'Example to a PowerPoint document');
        pptx.makeTitleSlide('Officegen', 'Example to a PowerPoint document')
        pptx.makeTitleSlide('Officegen', 'Example to a PowerPoint document')

        // Pie chart slide example:

        // slide = pptx.makeNewSlide({ userLayout: 'title' });
        slide.addText('Full line', 0, 40, '100%', 20);
        slide.name = 'Pie Chart slide'
        slide.back = 'ffff00'

        // slide.addChart(
        //     {
        //         title: 'My production',
        //         renderType: 'pie',
        //         data:
        //             [
        //                 {
        //                     name: 'Oil',
        //                     labels: ['Czech Republic', 'Ireland', 'Germany', 'Australia', 'Austria', 'UK', 'Belgium'],
        //                     values: [301, 201, 165, 139, 128, 99, 60],
        //                     colors: ['ff0000', '00ff00', '0000ff', 'ffff00', 'ff00ff', '00ffff', '000000']
        //                 }
        //             ]
        //     }
        // )

        // Let's generate the PowerPoint document directly into the response stream:
        res.writeHead(200, {
            'Content-Type':
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'Content-disposition': 'attachment filename=out.pptx'
        });

        let out = fs.createWriteStream('example.pptx');


        // This one catch only the officegen errors:
        pptx.on('error', function (err) {
            res.end(err)
        })

        // Catch response errors:
        out.on('error', function (err) {
            res.end(err)
        })

        // End event after sending the PowerPoint data:
        out.on('finish', function () {
            res.end()
        })

        // This async method is working like a pipe - it'll generate the pptx data and pass it directly into the output stream:
        pptx.generate(out)

    } catch (e) {
        console.log(e);
        return res.status(500).json({ result: false });
    }
});

const port = process.env.PORT || 4000;

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on ${port}`));