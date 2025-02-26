

//get all restaurants
import { createConnection } from '$lib/db/mysql.js';

export async function GET({ params }) {
    const { uuid } = params;
    const connection = await createConnection();
    const [rows] =  await connection.execute('SELECT * FROM Restaurants');
    
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    });
  }


  //post a restaurant

  import { createConnection } from '$lib/db/mysql.js';

  export async function POST({ request }) {
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