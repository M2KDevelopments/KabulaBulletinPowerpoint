const fs = require('fs').promises;
const path = require('path');
const tesseract = require("tesseract.js");


exports.get = async (req, res) => {
    try {

        const p = path.join(__dirname, '../assets/vop');
        const folder = await fs.readdir(p);
        return res.status(200).json(folder.map(name => require(`../assets/vop/${name}`)));
    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ result: false, message: e.message })
    }
}


exports.getGuide = async (req, res) => {
    try {
        const { number } = req.params;
        const { view } = req.query;
        const json = require(`../assets/vop/guide${number}.json`)
        return view ? res.status(200).send(json.pages.join("\n\n\n")) : res.status(200).json(json);
    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ result: false, message: e.message })
    }
}


// https://www.youtube.com/watch?v=yckwR5mdd6M
exports.post = async (req, res) => {
    try {
        const { start, end } = req.body;
        const options = { logger: e => console.log(e) }


        for (let i = start; i <= end; i++) {
            console.log('Guide', i);

            const guide = {
                title: "",
                number: i,
                pages: []
            }

            for (let j = 1; j <= 6; j++) {
                console.log('Page', j, 'out of', '6');
                const file = path.join(__dirname, `../public/Discover ${i} - Page ${j}.jpg`)
                const out = await tesseract.recognize(file, 'eng', options);
                guide.pages.push(out.data.text);
            }

            await fs.writeFile(path.join(__dirname, `../assets/vop/guide${i}.json`), JSON.stringify(guide));
        }

        return res.status(200).json({ result: true })
    } catch (e) {
        console.log(e.message);
        return res.status(400).json({ result: false, message: e.message });
    }
}

exports.convert = async (req, res) => {
    try {
        const { start, end } = req.body;
        for (let i = start; i <= end; i++) {
            const json = require(`../assets/vop/guide${i}.json`)
            const sections = extractSections(json.pages.join("\n\n"))
            const guide = {
                title: json.title,
                number: json.number,
                sections
            }
            await fs.writeFile(path.join(__dirname, `../assets/vop2/guide${i}.json`), JSON.stringify(guide));
            console.log(i, 'out', end);
        }
        return res.status(200).json({ request: true });
    } catch (e) {
        console.log(e.message);
        return res.status(400).json({ result: false, message: e.message });
    }
}


// Code from Chat GPT 
function extractSections(str) {
    const pattern = /(\d+)\.\s([A-Z][^\d]+)([\s\S]*?)(?=\n\d+\.\s[A-Z]|$)/g;
    const matches = str.matchAll(pattern);

    const sections = [];
    for (const match of matches) {
        const number = parseInt(match[1]);
        const title = match[2].trim();
        const text = match[3].trim();

        const section = {
            title,
            number,
            text,
        };

        sections.push(section);
    }

    return sections;
}