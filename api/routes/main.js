
const router = require('express').Router();
const path = require('path');
const { upload } = require('../middlewares/multer');
const powerpoint = require('../controllers/main')

router.get('/', (req, res) => res.status(200).render(path.join(__dirname, "../views/index"), {}));

router.get('/powerpoint', (req, res) => res.status(200).sendFile(path.join(__dirname, 'songs.pptx')));

router.get('/download/everything', powerpoint.printEverything);

router.get('/hymns', powerpoint.hymns);

router.get('/hymns/:number',powerpoint.getHymnByNumber);

router.get('/choruses', powerpoint.choruses);

router.get('/chorus/all/names', powerpoint.getChorusNames);

router.get('/chorus/by/name', powerpoint.getChorusJson);

router.get('/chorus/:index', powerpoint.chorus);

router.post('/chorus/:index', powerpoint.chorus);

router.post('/download', powerpoint.download);

router.post('/whatsapp', powerpoint.whatsapp);

router.post('/bulletin', upload.single('bulletin'), powerpoint.bulletin);

module.exports = router;