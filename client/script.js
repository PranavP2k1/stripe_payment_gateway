const button = document.querySelector("button")
button.addEventListener("click", () => {
  fetch("http://localhost:3000/create-checkout-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [
        { id: 1, quantity: 3 },
        { id: 2, quantity: 1 },
      ],
    }),
  })
    .then(res => {
      if (res.ok) return res.json()
      return res.json().then(json => Promise.reject(json))
    })
    .then(({ url }) => {
      window.location = url
    })
    .catch(e => {
      console.error(e.error)
    })
})
/*
What the above code does is that it sends a POST request to the server when a button is clicked.
The POST request contains the item details like item id and quantity.From the item id,the server
can fetch the item price and name from the server-side database.The server then creates a URL for 
the item checkout page with the help of stripe API.This URL is then sent to the client.The code from 
line 19 catches the URL sent from the client and then goes to that URL using the code "window.location = url".
*/

