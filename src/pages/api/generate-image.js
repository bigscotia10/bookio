import axios from 'axios';

export default async function handler(req, res) {
    const { prompt } = req.body;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/images/generations',
            {
                model: 'image-alpha-001',
                prompt: prompt,
                n: 1,
                size: '512x512',
                response_format: 'url',
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
                },
            }
        );

        const imageUrl = response.data.choices[0].data.url;
        const responseImage = await axios.get(imageUrl, {
            responseType: 'arraybuffer',
        });
        const base64 = Buffer.from(responseImage.data, 'binary').toString(
            'base64'
        );
        const dataUrl = `data:${responseImage.headers[
            'content-type'
        ].toLowerCase()};base64,${base64}`;

        res.status(200).json({ dataUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate image' });
    }
}
