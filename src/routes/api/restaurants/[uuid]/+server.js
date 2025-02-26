import { createConnection } from '$lib/db/mysql';

import { BASIC_AUTH_USER, BASIC_AUTH_PASSWORD } from '$env/static/private';



async function authenticate(request) {
    const auth = request.headers.get('authorization');
    if (!auth || auth !== `Basic ${btoa(`${BASIC_AUTH_USER}:${BASIC_AUTH_PASSWORD}`)}`) {
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

//get
export async function GET({ params }) {
    const authResponse = await authenticate(request);
    if (authResponse) return authResponse;

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
    const authResponse = await authenticate(request);
    if (authResponse) return authResponse

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


export async function PUT({ params, request }) 
{
    const authResponse = await authenticate(request);
    if (authResponse) return authResponse;

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