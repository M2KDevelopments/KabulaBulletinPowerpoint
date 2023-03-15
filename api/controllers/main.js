const PPTX = require('nodejs-pptx');
const path = require('path');
const accountSid = 'AC23505170ee2e94f86ce46ad9eedfe319';
const authToken = '1d96aacc88933217dc040e537c8a5e9b';
const client = require('twilio')(accountSid, authToken);
const axios = require('axios');
const instance = axios.create();
const fs = require('fs');
const { readdir } = require('fs/promises');
const pdf = require('pdf-parse');



function getFont(line) {
    const x = line.length;
    const m = -1.228571428571429;
    const c = 151.1428571428572;
    const y = (x * m) + c;
    const font = y;
    return parseInt(font);
}

function printSong(typeOfSong, pres, number, courtworship = false) {

    const hymn = require(`../assets/hymns/${number}.json`);
    const { title, verses, chorus } = hymn;
    const courtworshipfonts = [110, 110, 100, 100];

    pres.addSlide(slide => {

        //add title
        slide.addText(text => {
            text.value(typeOfSong)
                .x(0)
                .y(100)
                .cx(720)
                .cy(100)
                .autoFit(true)
                .fontFace('Calibri')
                .fontSize(105)
                // .textColor('CC0000')
                // .textWrap('none')
                .textAlign('left')
                .textVerticalAlign('center')
                // .line({ color: '0000FF', dashType: 'dash', width: 1.0 })
                .margin(0);
        });


        //add sub title
        slide.addText(text => {
            text.value(`#${title}`)
                .x(20)
                .y(230)
                .cx(680)
                .cy(100)
                .fontFace('Calibri')
                .fontSize(50)
                // .textColor('CC0000')
                // .textWrap('none')
                .textAlign('center')
                .textVerticalAlign('center')
                // .line({ color: '0000FF', dashType: 'dash', width: 1.0 })
                .margin(0);
        });
    });

    verses.forEach((verse, index) => {
        const lines = verse.split('\n');
        lines.forEach((line, linecount) => {
            pres.addSlide(slide => {
                //add verse number
                slide.addText(text => {
                    text.value(`Verse ${index + 1}`)
                        .x(10)
                        .y(0)
                        .cx(700)
                        .cy(30)
                        .autoFit(true)
                        .fontFace('Calibri')
                        .fontSize(20)
                        .textWrap('none')
                        .textAlign('left')
                        .textVerticalAlign('center')
                        .margin(0);
                });


                //add line
                slide.addText(text => {
                    const font = courtworship ? courtworshipfonts[linecount] : getFont(line);
                    text.value(line.replace(',', '\n'))
                        .x(0)
                        .y(10)
                        .cx(720)
                        .cy(400)
                        .autoFit(true)
                        .fontFace('Calibri')
                        .fontSize(font)
                        // .textWrap('none')
                        .textAlign('center')
                        .fontBold(true)
                        .textVerticalAlign('center')
                        .margin(0);
                });


            });
        });

        if (chorus !== "") {
            const chorus_lines = chorus.split('\n');
            chorus_lines.forEach(line => {
                pres.addSlide(slide => {
                    //add verse number
                    slide.addText(text => {
                        text.value(`Corus`)
                            .x(10)
                            .y(0)
                            .cx(700)
                            .cy(30)
                            .autoFit(true)
                            .fontFace('Calibri')
                            .fontSize(20)
                            .textWrap('none')
                            .textAlign('center')
                            .textVerticalAlign('center')
                            .margin(0);
                    });


                    //add verse text
                    const font = getFont(line);
                    slide.addText(text => {
                        text.value(line)
                            .x(0)
                            .y(10)
                            .cx(720)
                            .cy(400)
                            .autoFit(true)
                            .fontFace('Calibri')
                            .fontSize(font)
                            // .textWrap('none')
                            .textAlign('center')
                            .textVerticalAlign('center')
                            .fontBold(true)
                            .margin(0);
                    });
                });
            });
        }
    });
}

function printResponsiveReading(pres, number) {

    const hymn = require(`../assets/hymns/${number}.json`);
    const { title, verses } = hymn;

    pres.addSlide(slide => {

        //add title
        slide.addText(text => {
            text.value('Responsive Reading')
                .x(0)
                .y(100)
                .cx(720)
                .cy(100)
                .autoFit(true)
                .fontFace('Calibri')
                .fontSize(105)
                // .textColor('CC0000')
                // .textWrap('none')
                .textAlign('center')
                .textVerticalAlign('center')
                // .line({ color: '0000FF', dashType: 'dash', width: 1.0 })
                .margin(0);
        });


        //add sub title
        slide.addText(text => {
            text.value(`#${title}`)
                .x(20)
                .y(260)
                .cx(680)
                .cy(100)
                .fontFace('Calibri')
                .fontSize(45)
                // .textColor('CC0000')
                // .textWrap('none')
                .textAlign('center')
                .textVerticalAlign('center')
                // .line({ color: '0000FF', dashType: 'dash', width: 1.0 })
                .margin(0);
        });

        verses.forEach((verse, index) => {
            const elderReading = index % 2 == 0;

            if (elderReading) {
                pres.addSlide(slide => {

                    //add title
                    slide.addText(text => {
                        text.value(title)
                            .x(10)
                            .y(0)
                            .cx(700)
                            .cy(30)
                            .autoFit(true)
                            .fontFace('Calibri')
                            .fontSize(20)
                            .textWrap('none')
                            .textAlign('left')
                            .textVerticalAlign('center')
                            .margin(0);
                    });

                    //add line
                    slide.addText(text => {
                        text.value(verse)
                            .x(0)
                            .y(10)
                            .cx(720)
                            .cy(400)
                            .autoFit(true)
                            .fontFace('Calibri')
                            .fontSize(45)
                            // .textWrap('none')
                            .textAlign('center')
                            // .fontBold(false)
                            // .fontItatic(true)
                            .textVerticalAlign('center')
                            .margin(0);
                    });

                });
            } else {
                const lines = verse.split('\n');
                lines.forEach((line, linecount) => {

                    //add title
                    slide.addText(text => {
                        text.value(title)
                            .x(10)
                            .y(0)
                            .cx(700)
                            .cy(30)
                            .autoFit(true)
                            .fontFace('Calibri')
                            .fontSize(20)
                            .textWrap('none')
                            .textAlign('left')
                            .textVerticalAlign('center')
                            .margin(0);
                    });

                    pres.addSlide(slide => {
                        //add line
                        slide.addText(text => {
                            const font = getFont(line)
                            const t = line.replace(',', '\n')

                            //remove new line at the end of string
                            const v = t.indexOf('\n') == t.length - 1 ? t.substring(0, t.length - 1) : t;
                            console.log(t.indexOf('\n'), v);

                            text.value(v)
                                .x(0)
                                .y(10)
                                .cx(720)
                                .cy(400)
                                .autoFit(true)
                                .fontFace('Calibri')
                                .fontSize(font)
                                // .textWrap('none')
                                .textAlign('center')
                                .fontBold(true)
                                .textVerticalAlign('center')
                                .margin(0);
                        });

                    });
                });
            }

        });
    });
}

exports.chorus = async (req, res) => {
    try {

        const index = req.params.index;
        const songs = await getSongs(path.join(__dirname, "../assets/choruses/"))
        const name = songs[index];
        const file = path.join(__dirname, "../assets/choruses/", name);

        fs.readFile(file, { encoding: 'utf-8' }, async function (err, data) {
            if (!err) {
                const json = JSON.parse(data);
                const { verses, verse, chorus } = json;

                let pptx = new PPTX.Composer();
                await pptx.compose(pres => {

                    pres.title(name)
                        .author('Martin Kululanga')
                        .company('Kabula Hill SDA')
                        .revision('1')
                        .subject('Chorus')
                        .layout('LAYOUT_16x9');

                    if (verse) {
                        verse.forEach((line, index) => {

                            pres.addSlide(slide => {
                                //add line
                                slide.addText(text => {
                                    const font = getFont(line)
                                    const t = line.replace(',', '\n')

                                    // Remove new line at the end of string
                                    const v = t.indexOf('\n') == t.length - 1 ? t.substring(0, t.length - 1) : t;

                                    text.value(v)
                                        .x(0)
                                        .y(10)
                                        .cx(720)
                                        .cy(400)
                                        .autoFit(true)
                                        .fontFace('Calibri')
                                        .fontSize(font)
                                        // .textWrap('none')
                                        .textAlign('center')
                                        .fontBold(true)
                                        .textVerticalAlign('center')
                                        .margin(0);
                                });

                            });
                        });
                    } else if (verses) {
                        verses.forEach((verse, index) => {
                            const lines = verse.split('\n');
                            lines.forEach((line, linecount) => {
                                pres.addSlide(slide => {
                                    //add verse number
                                    slide.addText(text => {
                                        text.value(`Verse ${index + 1}`)
                                            .x(10)
                                            .y(0)
                                            .cx(700)
                                            .cy(30)
                                            .autoFit(true)
                                            .fontFace('Calibri')
                                            .fontSize(20)
                                            .textWrap('none')
                                            .textAlign('left')
                                            .textVerticalAlign('center')
                                            .margin(0);
                                    });

                                    //add verse text
                                    const font = getFont(line);
                                    slide.addText(text => {
                                        text.value(line)
                                            .x(0)
                                            .y(10)
                                            .cx(720)
                                            .cy(400)
                                            .autoFit(true)
                                            .fontFace('Calibri')
                                            .fontSize(font)
                                            // .textWrap('none')
                                            .textAlign('center')
                                            .textVerticalAlign('center')
                                            .fontBold(true)
                                            .margin(0);
                                    });

                                });
                            });

                            if (chorus !== "") {
                                const chorus_lines = chorus.split('\n');
                                chorus_lines.forEach(line => {
                                    pres.addSlide(slide => {
                                        //add verse number
                                        slide.addText(text => {
                                            text.value(`Corus`)
                                                .x(10)
                                                .y(0)
                                                .cx(700)
                                                .cy(30)
                                                .autoFit(true)
                                                .fontFace('Calibri')
                                                .fontSize(20)
                                                .textWrap('none')
                                                .textAlign('center')
                                                .textVerticalAlign('center')
                                                .margin(0);
                                        });


                                        //add verse text
                                        const font = getFont(line);
                                        slide.addText(text => {
                                            text.value(line)
                                                .x(0)
                                                .y(10)
                                                .cx(720)
                                                .cy(400)
                                                .autoFit(true)
                                                .fontFace('Calibri')
                                                .fontSize(font)
                                                // .textWrap('none')
                                                .textAlign('center')
                                                .textVerticalAlign('center')
                                                .fontBold(true)
                                                .margin(0);
                                        });
                                    });
                                });
                            }
                        });
                    }


                });

                await pptx.save('./chorus.pptx');
                return res.status(200).sendFile(path.join(__dirname, '../../chorus.pptx'))
            } else {
                return res.status(500).json({ result: false, message: err.message });
            }
        });

    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ result: false, message: e.message });
    }
}

exports.download = async (req, res) => {


    let pptx = new PPTX.Composer();
    const { openingHymn, closingHymn, responsiveReading } = req.body;

    await pptx.compose(pres => {

        pres.title('KHC Sabbath Program')
            .author('Martin Kululanga')
            .company('Kabula Hill SDA')
            .revision('1')
            .subject('KHC Sabbath Program')
            .layout('LAYOUT_16x9');

        // printSong('Court Worship', pres, 694, true);
        printResponsiveReading(pres, responsiveReading);
        printSong('Opening Hymn', pres, openingHymn);
        printSong('Closing Hymn', pres, closingHymn);

    });

    await pptx.save(`./hymnal-songs.pptx`);
    return res.status(200).sendFile(path.join(__dirname, '../../hymnal-songs.pptx'));
}

exports.whatsapp = async (req, res) => {
    try {
        const url = req.body['MediaUrl0'];
        const { ProfileName, From } = req.body;
        const twilioNumber = 'whatsapp:+14155238886';


        if (!url) {
            const { ProfileName, From } = req.body;
            const body = `Please the bulletin pdf file. ${ProfileName}`;
            const myNumber = From; //'whatsapp:+265999969205'
            client.messages
                .create({ body: body, from: twilioNumber, to: myNumber })
                .then(message => console.log(message.sid))
                .done();
            console.log('No PDF');
            return res.status(200).json({ result: true, message: "OK" });
        }

        const response = await instance.get(url, { responseType: 'arraybuffer' })
        const buffer64 = Buffer.from(response.data, 'binary').toString('base64')
        fs.writeFile("bulletin.pdf", buffer64, 'base64', async function (err) {
            console.log(err);
            if (err) {

                const body = `Sorry, ${ProfileName}, could not generate powerpoint. Error (${err.message})`;
                const myNumber = From; //'whatsapp:+265999969205'
                client.messages
                    .create({ body: body, from: twilioNumber, to: myNumber })
                    .then(message => console.log(message.sid))
                    .done();
                console.log('No PDF');
                return res.status(200).json({ result: true, message: "OK" });
            }

            console.log('Download PDF');

            const dataBuffer = fs.readFileSync('bulletin.pdf');

            const data = await pdf(dataBuffer);
            const index = data.text.indexOf('First Divine Service');
            const text = data.text.substring(index);
            const lines = text.replace(/Deaconry on Duty.*/gmi, '').split('\n');
            const responsiveHeader = lines.find(line => line.match(/Responsive Reading/gmi) ? true : false);
            const responsiveReading = responsiveHeader ? responsiveHeader.replace(/[^0-9]/gmi, '') : 0;
            const openingHymn = lines.find(line => line.match(/Opening hymn/gmi) ? true : false).replace(/[^0-9]/gmi, '');
            const closingHymn = lines.find(line => line.match(/Closing hymn/gmi) ? true : false).replace(/[^0-9]/gmi, '');

            const pptx = new PPTX.Composer();
            await pptx.compose(pres => {

                pres.title('KHC Sabbath Program')
                    .author('Martin Kululanga')
                    .company('Kabula Hill SDA')
                    .revision('1')
                    .subject('KHC Sabbath Program')
                    .layout('LAYOUT_16x9');

                if (responsiveReading > 0) printResponsiveReading(pres, responsiveReading);
                printSong('Opening Hymn', pres, openingHymn);
                printSong('Closing Hymn', pres, closingHymn);

            });

            //save powerpoints
            await pptx.save(`./songs.pptx`);


            //send whatsapp message
            const mediaUrl = ['https://kabulappt.herokuapp.com/powerpoint'];
            const body = `*Generated successfully*, ${ProfileName}, Here are the songs, for the service.`;
            const myNumber = From; //'whatsapp:+265999969205'
            client.messages
                .create({ body: body, from: twilioNumber, to: myNumber, mediaUrl })
                .then(message => console.log(message.sid))
                .done();

            //finish response
            return res.status(200).json({ result: true, message: "OK" });
        });

    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ result: false, message: e.message });
    }
}

exports.choruses = async (req, res) => {
    try {
        const filename = path.join(__dirname, "../assets/choruses/");
        const songs = await getSongs(filename)

        const html = `
            <html>
                <title>Choruses</title>
                <body>
                    <section style="display:grid; width:100vw; height:100vh; grid-template-columns:repeat(6, 300px); grid-template-rows: 200px 250px; grid-auto-rows:150px">
                        ${songs.map((song, index) =>
            `<form action="/chorus/${index}" method="POST" style="padding:10px; border-radius:10px; color:grey; font-size:14pt; border-style:solid; border-width:1px">
                            <h4>${index + 1} ${song.replace(/\.txt|\.json/gmi, '')}</h4>
                            <br/>
                            <button type="submit" style="color:white; cursor:pointer; background:blue; padding:10px;border:none; border-radius:10px">
                                Downlaad PowerPoint
                            </button>
                        </form>
                        `
        ).join("\n")}
                    </section>
                </body>
            </html>
        `
        return res.status(200).send(html);
    } catch (e) {
        console.log(e.message)
    }
}

exports.getChorusNames = async (req, res) => {
    try {
        const filename = path.join(__dirname, "../assets/choruses/");
        const songs = await getSongs(filename);
        return res.status(200).send(songs.map(song => song.replace(/\.json|\.txt/gmi, '')));
    } catch (e) {
        console.log(e.message)
    }
}


exports.bulletin = async (req, res) => {
    try {
        const filename = req.storedfilename;
        const filepath = path.join(__dirname, `../public/${filename}`);
        const buffer = fs.readFileSync(filepath);
        const data = await pdf(buffer);

        // Scripture and Responsive Reading
        let response_reading = "";
        let scripture_reading = "";

        if (data.text.match(/(Responsive|Scripture).*Reading.*\n/gmi, '') && data.text.match(/(Responsive|Scripture).*Reading.*\n/gmi, '')[0]) {
            const text = data.text.match(/(Responsive|Scripture).*Reading.*\n/gmi, '')[0];
            if (text.match(/Responsive/)) {
                if (text.match(/\d+/)) response_reading = parseInt(text.match(/\d+/)[0]);
            } else {
                scripture_reading = text.replace(/(Responsive|Scripture).*Reading|:|\n/gmi, '').trim();
            }

        }

        if (data.text.match(/Key Text.*\n/gmi, '')) scripture_reading = data.text.match(/Key Text.*\n/gmi, '')[0].replace(/:|Key Text/gmi, '').trim();

        // Opening Hymn
        const opening_hymn = parseInt(data.text.match(/Opening hymnal.*\n/gmi, '')[0].match(/\d+/)[0]);
        const closing_hymn = parseInt(data.text.match(/Closing hymnal.*\n/gmi, '')[0].match(/\d+/)[0]);
        const children_sermon = data.text.match(/Children Sermon.*\n/gmi, '')[0].replace(/:|Children Sermon/gmi, '').trim();
        const music = data.text.match(/Musical Meditation.*\n/gmi, '')[0].replace(/:|Musical Meditation/gmi, '').trim();
        const preacher = data.text.match(/Preacher.*\n/gmi, '')[0].replace(/:|Preacher/gmi, '').trim();
        const sermon_title = data.text.match(/Sermon Title.*\n/gmi, '')[0].replace(/:|Sermon Title/gmi, '').trim();

        // Delete Files
        fs.unlinkSync(filepath);

        return res.status(200).json({ response_reading, scripture_reading, opening_hymn, closing_hymn, children_sermon, music, preacher, sermon_title });

    } catch (e) {
        console.log(e.message)
        return res.status(500).json({ result: false, message: e.message });
    }

}


const getSongs = async source => (await readdir(source, { withFileTypes: true })).filter(dirent => !dirent.isDirectory()).map(dirent => dirent.name)