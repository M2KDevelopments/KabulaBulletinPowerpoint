
const router = require('express').Router();
const controller = require('../controllers/bible');

router.get('/', controller.getBiblePage);

// API - Get Whole Chapter
router.get('/:book/:chapter', controller.getChapter);

// API - Get Verse
router.get('/:book/:chapter/:verse', controller.getVerse);

// API - Get Verses from chapter
router.get('/:book/:chapter/:verseStart/:verseEnd', controller.getVerses);





module.exports = router;