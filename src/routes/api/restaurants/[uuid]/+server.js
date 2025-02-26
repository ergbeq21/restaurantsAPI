
import { createConnection } from '$lib/db/mysql.js';

//get
export async function GET({ params }) {
    const { uuid } = params;
	const connection = await createConnection();
    const [rows] =  await connection.execute('SELECT * FROM Restaurants WHERE id = ?', [uuid]);

	const restaurant = rows[0];
    return new Response(JSON.stringify(restaurant), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    });
  }

  //delete

  export async function DELETE({ params }) {
    const { uuid } = params;
    const connection = await createConnection();
 
    try {
        const [result] = await connection.execute(
            'DELETE FROM Restaurants WHERE id = ?;',
            [uuid]
        );
 
        if (result.affectedRows === 0) {
            return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
        }
 
        return new Response(null, { status: 204 });
 
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}


//put


export async function PUT({ params, request }) {
    const { uuid } = params;
    const data = await request.json();

    const connection = await createConnection();

    try {
    
        const [result] = await connection.execute(
            `UPDATE Restaurants 
             SET 
                name = COALESCE(?, name), 
                address = COALESCE(?, address), 
                phone = COALESCE(?, phone)
             WHERE id = ?;`,
            [
                data.name ?? null,
                data.address ?? null,
                data.phone ?? null,
                uuid
            ]
        );

        if (result.affectedRows === 0) {
            return new Response(JSON.stringify({ error: 'not found or no changes made' }), { status: 404 });
        }

        if (connection && connection.execute) {
            const [updatedRestaurants] = await connection.execute(
                'SELECT * FROM Restaurants WHERE id = ?;',
                [uuid]
            );

            return new Response(JSON.stringify(updatedRestaurants[0]), {
                status: 200,
                headers: { 'content-type': 'application/json' }
            });
        } else {
            throw new Error("Database connection was closed before executing the SELECT query.");
        }
    } catch (error) {
        console.error("Database error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    } finally {
        if (connection) {
            await connection.end(); 
        }
    }
}