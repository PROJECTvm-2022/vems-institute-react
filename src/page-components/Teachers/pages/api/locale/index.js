import fs from 'fs';

export default function handler(req, res) {
    // setTimeout(() => {
    const { key = '', lang = 'en' } = req.query;
    const filePath = `${process.cwd()}/src/locale/${key}/${lang}.json`;
    if (!fs.existsSync(filePath)) return res.status(404).send({ messages: 'File not found' });
    const data = JSON.parse(fs.readFileSync(filePath));
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(data);
    // }, 4000);
}
