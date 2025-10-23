#  Express.js RESTful Products API

##  How to Run
1. Clone the repo and open it in VS Code
2. Run:
   ```bash
   npm install


3.Create .env file with:

PORT=3000
API_KEY=my_secret_key


4.Start the server:

node server.js


Visit http://localhost:3000

 Authentication

5.Include API key in headers:

x-api-key: my_secret_key

 6.Endpoints

GET /api/products

GET /api/products/:id

POST /api/products (requires API key)

PUT /api/products/:id (requires API key)

DELETE /api/products/:id (requires API key)

GET /api/products/stats/category


---

### ▶Step 7: Run the Server

In your terminal (inside the folder):
```bash
node server.js


You should see:

 Server is running at http://localhost:3000