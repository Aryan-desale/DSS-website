let params = new URLSearchParams(window.location.search);
let info = document.getElementById('info');

if (params.has('code')) {
	let code = params.get('code');

	fetch('https://discord.com/api/oauth2/token', {
		method  : 'POST',
		headers : {
			'Content-Type' : 'application/x-www-form-urlencoded'
		},
		body    : new URLSearchParams({
			client_id     : '800353549418102804',
			client_secret : 'MbuP9wr0083k_k2xGYge_xfOOQ17DODR',
			grant_type    : 'authorization_code',
			code          : code,
			redirect_uri  : 'http://127.0.0.1:5501/public/'
		})
	})
		.then((res) => res.json())
		.then(function(res) {
			let ref = `${res.refresh_token}`;

			aa(ref);

			function aa(ref) {
				fetch('https://discord.com/api/oauth2/token/revoke', {
					method  : 'POST',
					headers : {
						'Content-Type' : 'application/x-www-form-urlencoded'
					},
					body    : new URLSearchParams({
						client_id     : '800353549418102804',
						client_secret : 'MbuP9wr0083k_k2xGYge_xfOOQ17DODR',
						grant_type    : 'refresh_token',
						refresh_token : ref
					})
				})
					.then((res) => res.json())
					.then(
						fetch('https://discord.com/api/users/@me', {
							headers : {
								authorization : `${res.token_type} ${res.access_token}`
							}
						})
							.then((res) => res.json())
							.then(function(res) {
								let username = `${res.username}`;
								info.innerHTML = username;
							})
					);
			}
		});
}
