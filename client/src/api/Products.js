const API = 'http://localhost:5000/api' //stores backend URL

export async function fetchAllProducts(){//function fetches all products from the backend 
  const res = await fetch(`${API}/products`)//send a get request to backend , awaits untill server responds 
  if (!res.ok) throw new Error('Failed to fetch products')//throws error if res not ok 
  const data = await res.json()//backend res json , returns data as javascript 
  return data.data ?? []
}

export async function createProduct(body) {//takes body as input 

  const res = await fetch(`${API}/products`, {//send to backend as new product 
    method: 'POST',//create new data
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),//convert javascript object into json string 
  })

  const data = await res.json()//server would read response 
  if (!res.ok) throw new Error(data.message ?? 'Failed to create product')//shows error if attempt fails  
  return data.data//returns created product
}

export async function adjustStock(productId, action, amount) {//takes different attributes 

  const res = await fetch(`${API}/logs`, {//Calls backend logs 
    method: 'POST',//creates new logs if changes occur
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product: productId, action, amount }),//converts js to json in the backend 
  })

  const data = await res.json()//server read new log entry
  if (!res.ok) throw new Error(data.message ?? 'Failed to adjust stock')//show is error occurs 
  return data.data//returns created data 
}