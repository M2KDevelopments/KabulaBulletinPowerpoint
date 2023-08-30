exports.getChapter = async (req, res) => {
    try {
        let { lang } = req.query;
        if (!lang) lang = 'kjv';

        const { book, chapter } = req.params;


        if (!book || isNaN(book)) return res.status(404).json({ result: false, message: "Book paramater invalid" });
        if (!chapter || isNaN(chapter)) return res.status(404).json({ result: false, message: "chapter paramater invalid" });

        const verses = require(`../assets/bibles/${lang}/${book}/${chapter}`);
        return res.status(200).json(verses);

    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ result: false, message: e.message });
    }
}

exports.getVerse = async (req, res) => {
    try {
        let { lang } = req.query;
        if (!lang) lang = 'kjv';

        const { book, chapter, verse } = req.params;


        if (!book || isNaN(book)) return res.status(404).json({ result: false, message: "Book paramater invalid" });
        if (!chapter || isNaN(chapter)) return res.status(404).json({ result: false, message: "chapter paramater invalid" });
        if (!verse || isNaN(verse)) return res.status(404).json({ result: false, message: "verse paramater invalid" });

        const verses = require(`../assets/bibles/${lang}/${book}/${chapter}`);
        return res.status(200).json(verses[parseInt(verse) - 1].trim());

    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ result: false, message: e.message });
    }
}

exports.getVerses = async (req, res) => {
    try {
        let { lang } = req.query;
        if (!lang) lang = 'kjv';

        const { book, chapter, verseStart, verseEnd } = req.params;


        if (!book || isNaN(book)) return res.status(404).json({ result: false, message: "Book paramater invalid" });
        if (!chapter || isNaN(chapter)) return res.status(404).json({ result: false, message: "Chapter paramater invalid" });
        if (!verseStart || isNaN(verseStart)) return res.status(404).json({ result: false, message: "Verse Start paramater invalid" });
        if (!verseEnd || isNaN(verseEnd)) return res.status(404).json({ result: false, message: "Verse End paramater invalid" });

        const verses = require(`../assets/bibles/${lang}/${book}/${chapter}`);
        return res.status(200).json(verses.slice(parseInt(verseStart) - 1, verseEnd));

    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ result: false, message: e.message });
    }
}