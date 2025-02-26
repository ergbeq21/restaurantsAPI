//get all restaurant
import { createConnection } from '$lib/db/mysql';

export async function GET({ params }) {
    const { uuid } = params;
    const connection = await createConnection();
    const [rows] =  await connection.execute('SELECT * FROM Restaurants');
    
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    });
  }

  async function authenticate(request) {
    const auth = request.headers.get('authorization');
    if (!auth) {
        return new Response(null, {
            status: 401,
            headers: { 'www-authenticate': 'Basic realm="Restaurants API"' }
        });
    }
 
    const base64Credentials = auth.split(' ')[1];
    const credentials = atob(base64Credentials);
    const [username, password] = credentials.split(':');
 
    if (username !== BASIC_AUTH_USER || password !== BASIC_AUTH_PASSWORD) {
        return new Response(JSON.stringify({ message: 'Access denied' }), {
            status: 401,
            headers: { 'www-authenticate': 'Basic realm="Restaurants API"' }
        });
    }
 
    return null;
}

  //post a restaurant
  export async function POST({ request }) {

    const authResponse = await authenticate(request);
    if (authResponse) return authResponse;
    
      const data = await request.json();

      const connection = await createConnection();
      const [result] = await connection.execute(
          'INSERT INTO Restaurants (name, address, phone) VALUES (?, ?, ?)',
          [data.name, data.address, data.phone]
      );
  
      const newRestaurantId = result.insertId;
      const [rows] = await connection.execute('SELECT * FROM Restaurants WHERE id = ?', [newRestaurantId]);
  
      await connection.end();
  
      return new Response(JSON.stringify(rows[0]), {
          status: 201,
          headers: { 'content-type': 'application/json' }
      });
  }