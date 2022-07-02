const PPTX = require('nodejs-pptx');
const path = require('path');

function getFont(line) {
    const x = line.length;
    const m = -1.228571428571429;
    const c = 151.1428571428572;
    const y = (x * m) + c;
    const font = y;
    return parseInt(font);
}

function printSong(typeOfSong, pres, number, courtworship = false) {

    const hymn = require(`./res/${number}.json`);
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
                .textAlign('center')
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
        });
    });
}


exports.run = async (req, res) => {
    let pptx = new PPTX.Composer();
    const { openingHymn, closingHymn } = req.query;

    await pptx.compose(pres => {

        pres.title('KHC Sabbath Program')
            .author('Martin Kululanga')
            .company('Kabula Hill SDA')
            .revision('1')
            .subject('KHC Sabbath Program')
            .layout('LAYOUT_16x9');

        // printSong('Court Worship', pres, 694, true);
        printSong('Opening Hymn', pres, openingHymn);
        printSong('Closing Hymn', pres, closingHymn);

    });

    await pptx.save(`./hymnal-songs.pptx`);
    return res.status(200).sendFile(path.join(__dirname, 'hymnal-songs.pptx'));
}