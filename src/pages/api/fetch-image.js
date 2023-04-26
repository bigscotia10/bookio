import axios from 'axios';

export default async function handler(req, res) {
    const imageUrl = req.query.url;

    try {
        const responseImage = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const base64 = Buffer.from(responseImage.data, 'binary').toString('base64');
        const dataUrl = `data:${responseImage.headers['content-type'].toLowerCase()};base64,${base64}`;

        res.status(200).json({ dataUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch image' });
    }
}
