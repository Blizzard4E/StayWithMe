// import jwt_decode from 'jwt-decode';

// export async function load({ cookies }) {
// 	// const visited = cookies.get('visited');

// 	// cookies.set('visited', 'true', { path: '/' });
    
//     // let jsonFetch = fetch('https://jsonplaceholder.typicode.com/todos/1')
//     // let jsonData = (await jsonFetch).json()
// 	// return {
//     //     jsonData: await jsonData,
// 	// 	visited
// 	// };

// 	let response = await fetch('http://localhost:3000/users/autoLogin');
// 	let jsonData = await response.json()

// 	let user;

// 	if(jsonData.status == 200) {
// 		const accessToken = cookies.get("accessToken");
// 		return {
// 			status: 200,
// 			accessToken: accessToken
// 		}
// 	}
	
// }