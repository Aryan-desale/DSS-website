'use strict';
import fetch from 'node-fetch';
import express from 'express';
import { clientID, clientSecret, port } from './config.json';

const app = express();

app.use(express.static('public'));

app.get('/', async ({ query }, response) => {
	const { code } = query;

	if (code) {
		try {
			const oauthResult = await fetch('https://discord.com/api/oauth2/token', {
				method  : 'POST',
				body    : new URLSearchParams({
					client_id     : clientID,
					client_secret : clientSecret,
					code,
					grant_type    : 'authorization_code',
					redirect_uri  : `http://localhost:${port}`,
					scope         : 'identify'
				}),
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded'
				}
			});

			const oauthData = await oauthResult.json();

			const userResult = await fetch('https://discord.com/api/users/@me', {
				headers : {
					authorization : `${oauthData.token_type} ${oauthData.access_token}`
				}
			});

			console.log(await userResult.json());
		} catch (error) {
			// NOTE: An unauthorized token will not throw an error;
			// it will return a 401 Unauthorized response in the try block above
			console.error(error);
		}
	}

	return response.sendFile('index.html', { root: '.' });
});

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));

// import express from 'express';
// const app = express();
// import fetch from 'node-fetch';

// app.use(express.static('public'));

// console.log('it worked');

// app.get('/', async (req, res) => {
// 	let access_token;
// 	let token_type;
// 	if (req.query.code) {
// 		const accessCode = req.query.code;
// 		const data = {
// 			client_id     : '800353549418102804',
// 			client_secret : 'MbuP9wr0083k_k2xGYge_xfOOQ17DODR',
// 			grant_type    : 'authorization_code',
// 			redirect_uri  : 'http://localhost:3000',
// 			code          : accessCode,
// 			scope         : 'identify'
// 		};

// 		const res = await fetch('https://discordapp.com/api/oauth2/token', {
// 			method  : 'POST',
// 			body    : new URLSearchParams(data),
// 			headers : {
// 				'Content-Type' : 'application/x-www-form-urlencoded'
// 			}
// 		});

// 		const info = await res.json();

// 		token_type = info.token_type;
// 		access_token = info.access_token;
// 	}

// 	if (token_type && access_token && req.query.state) {
// 		res
// 			.status(200)
// 			.redirect(
// 				`http://localhost:3000/?code=${req.query.code}&state=${req.query
// 					.state}&access_token=${access_token}&token_type=${token_type}`
// 			);
// 	} else {
// 		res.sendFile('index.html', { root: '.' });
// 		console.log('it worked 1');
// 	}
// });

// app.listen(3000);
