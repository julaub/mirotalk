'use strict';

async function getToken() {
    try {
        // Use dynamic import with await
        const { default: fetch } = await import('node-fetch');

        const API_KEY_SECRET = process.env.API_KEY_SECRET;
        if (!API_KEY_SECRET) {
            console.error('Error: API_KEY_SECRET environment variable is not set.');
            process.exit(1);
        }
        const MIROTALK_URL = 'https://p2p.mirotalk.com/api/v1/token';
        //const MIROTALK_URL = 'http://localhost:3000/api/v1/token';

        const response = await fetch(MIROTALK_URL, {
            method: 'POST',
            headers: {
                authorization: API_KEY_SECRET,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: 'username',
                password: 'password',
                presenter: true,
                expire: '1h',
            }),
        });
        const data = await response.json();
        if (data.error) {
            console.log('Error:', data.error);
        } else {
            console.log('token:', data.token);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

getToken();
