import { createConnection } from '$lib/db/mysql';
 
export async function load (locals){
 
    const connection = await createConnection();
    const [rows] =  await connection.execute('SELECT * FROM Restaurants;');
 
return {
    restaurants : rows
}
 
}