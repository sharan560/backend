const express = require('express');
const server = express();

// Middleware to parse JSON
server.use(express.json());

// Array to store items
const items = [
    
        { "id": 1, "name": "item1" },
        { "id": 2, "name": "item2" }
    
];
 
// GET root route
server.get('/', (req, res) => {
    res.end("server is running");
});

// GET /about route
server.get('/about', (req, res) => {
    res.end("server11 is running");
});

// POST route to add a new item
server.post('/', (req, res) => {
    if (!req.body.name) {
        return res.status(400).json({ error: "Name is required" });
    }
    const newItem = { id: items.length + 1, name: req.body.name };
    items.push(newItem);
    res.status(200).json(newItem);
});


//server update

server.put('/:id', (req, res) => {
    const itemId = parseInt(req.params.id); // Parse the ID from the URL
    const itemIndex = items.findIndex((item) => item.id === itemId); // Find the index of the item with the given ID

    if (itemIndex !== -1) {

        if (!req.body.name) {
            return res.status(400).json({ error: "Name is required to update the item." });
        }

        items[itemIndex].name = req.body.name;
        res.status(200).json(items[itemIndex]); // Return the updated item
    } else {
        res.status(404).json({ error: `Item with ID ${itemId} not found.` });
    }
});

server.listen(3000, () => {
    console.log("Server is running on port 3000");
});
