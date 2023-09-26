require("dotenv").config()

const express = require("express")
const app = express()
const cors = require("cors")
app.use(express.json()) //To read all the json data send to us from the client side.
app.use(
  cors({
    origin: "http://localhost:5500",
  })
)

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY) /*
To get the stripe private key,create a stripe account,select test mode and access the
private key for the test mode.Enable the test mode(If we are testing our payment gateway),then go to developers 
section and in the developers section got to the API keys page and take the secret key.The secret key is 
our STRIPE_PRIVATE_KEY.Never commit the STRIPE_PRIVATE_KEY to github.
*/


const storeItems = new Map([
  [1, { priceInCents: 10000, name: "Learn React Today" }],
  [2, { priceInCents: 20000, name: "Learn CSS Today" }],
])  /* This is the item data,these data must be on server side 
and not on client side.
*/


app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({ 
      
      /*
      The stripe.checkout.sessions.create() function takes in an object
      that contain details like item price,item name,payment methods etc.
      and then returns a session object that represents the checkout session of the 
      given item.The item checkout page URL can be found in the session.url object.
      */
      
      payment_method_types: ["card"],
      /*
      The "payment_method_types" key decides the type of payments.
      It can be cards ,bank transfers ,wallets etc.
      */
      
      mode: "payment",
      /*
      "mode" decides the mode of payment like one-time payment,
      subscriptions etc.
      */
      
      line_items: req.body.items.map(item => {
        const storeItem = storeItems.get(item.id)
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: storeItem.name,
            },
            unit_amount: storeItem.priceInCents,
            /*
            The "unit_amount" is the price of the particulat product.Be careful
            while mentioning the price.Here it takes the price in cents.Check out the unit_amount 
            value in case of "inr".
            */
          },
          quantity: item.quantity,
        }
      }),
      /*
      The "line_items" is the array of items that we want to purchase.
      This needs to include the name,prices of the items.here the line_items
      key is taking in "req.body.items" as the value.The "req.body.items" is an
      array of item ids and their quantities that we send from the client side.
      What the req.body.items.map() function does is that it takes ecah item in the
      array and then converts each item into a form expected by the stripe servers.
      */
      
      success_url: `${process.env.CLIENT_URL}/success.html`,
      cancel_url: `${process.env.CLIENT_URL}/cancel.html`,
      /*
      The success_url and cancel_url decides where the client would be 
      navigated to after the checkout is successfull or after the 
      checkout has cancelled.
      */
      
    })
    res.json({ url: session.url })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.listen(3000)
