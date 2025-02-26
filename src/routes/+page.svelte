<script>
    let {data} = $props();
</script>

<div class="container">
    <h1 class="header">Here you can see all the restaurants in Shkodra</h1>
    <a href="/api/restaurants" target="_blank" class="api-link">View restaurants API</a>

    <ul class="restaurant-list">
        {#each data.restaurants as res}
        <li class="restaurant-item"><a href="/api/restaurants/{res.id}" class="restaurant-link">{res.name}</a></li>
        {/each}
    </ul>
</div>

<style>


    /* Container */
    .container {
        max-width: 900px;
        margin: 0 auto;
        padding: 20px;
    }

    /* Header */
    .header {
        text-align: center;
        margin: 20px 0;
        font-size: 2.5rem;
        color: #333;
        font-weight: bold;
    }

    /* API View Button */
    .api-link {
        display: inline-block;
        background-color: #007bff;
        color: #fff;
        padding: 10px 15px;
        border-radius: 5px;
        margin-bottom: 20px;
        font-size: 1rem;
        text-decoration: none;
    }

    .api-link:hover {
        background-color: #0056b3;
    }

    /* Restaurant List */
    .restaurant-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .restaurant-item {
        background-color: #fff;
        margin-bottom: 10px;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .restaurant-link {
        font-size: 1.2rem;
        color: #333;
        display: block;
        text-decoration: none;
    }

    .restaurant-link:hover {
        color: #007bff;
        text-decoration: underline;
    }
</style>
