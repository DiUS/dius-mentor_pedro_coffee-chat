# Chatbot & Webhook for Coffee Shop

Simple webhook implementation to link the [API.AI](https://api.ai/) agent with our [Coffee Shop Ordering API](https://github.com/DiUS/dius-mentor_boris_coffee-api/).

More info about Api.ai webhooks could be found here:
[Api.ai Webhook](https://docs.api.ai/docs/webhook)

## API.AI Agent
First, you should introduce yourself to API.AI key concepts as *Entities*, *Intents*, *Contexts*, *Actions* && *Webhook* are needed to understand how the agent works [Take a look!](https://docs.api.ai/docs/key-concepts).

Sign up into API.AI, create a new agent and from the console [import](https://docs.api.ai/docs/concept-agents#export-and-import) our agent: [CoffeeOrders.zip](https://github.com/pdiegodios/apiai-webhook-sample/tree/master/agent). This will set configured intents and entities into your new agent.

### Play with him
From the console, try to speak or chat with your new chatbot. Under the **Training** seciton you can accurate your chatbot's replys.
A nice API.AI feature is *Small Talk*. Customize it and play with your agent in order to make your agent more chilled out and easy going.

### Intents & Actions
* **Add Order**: To start your interaction, you will need a new order. A name is mandatory in order to create the order. *Action: **order.create***.
* **Cancel Order**: Last order created will be deleted. *Action: **order.cancel***.
* **List Orders**: Show All Orders. *Action: **order.list***.
* **Add Coffee**: Add coffees to created order. *coffee_size* and *coffee_style* are mandatory, *quantity* is optional. *Action: **coffee.create***.

**What are the actions for?**
A restriction in API.AI is that only one webhook can be added to work with the agent. So, the way to filter the operations in your webhook side is by your actions. Yes, it is quite poor but is the way it is right now. Take a look to the webhook [code](https://github.com/pdiegodios/apiai-webhook-sample/blob/master/index.js) to check how to filter by action.

**Contexts or How do we keep a trace of our order?**
After creating an order, we need the id of the order created for the following requests to add coffees to that order. So, the solution for that is the Context. Contexts are optionally attached to intents and they can be modified via webhook.

## Webhook
In our API.AI console, accessing to Fulfillment tab we can set our webhook. Then, in every intent we want to conect with our webhook, we need to check fulfillment using webhook. The current webhook is a very simple index.js file requesting data using Client.js.

Webhooks are needed in order to provide communication between our agent and 3rd party APIs.
Take a look to the [format response](https://docs.api.ai/docs/webhook#section-format-of-response-from-the-service) if you want to build your own responses.

## Setting up & Deploying it
1. Clone, install and run [Coffee Shop Ordering API](https://github.com/DiUS/dius-mentor_boris_coffee-api/) following the README.
2. Create a new agent in API.AI.
3. Clone this repository & Install dependencies
  `> npm install`
4. From your API.AI console, import [agent/CoffeeOrders.zip](https://github.com/pdiegodios/apiai-webhook-sample/blob/master/agent/CoffeeOrders.zip) in your recently created agent.
5. Set your evironment value for `coffeeWebhookUrl` to point to Coffee Shop Ordering API.
6. You can deploy it on a Cloud App Platform or run locally your index.js  
  `> node index.js`
7. Server is listening. Now, expose your localhost port (5000 by default) if you decided to run locally. I used [ngrok](https://ngrok.com/) for doing this.
8. Go to your API.AI Console> Fulfillment> check enabled && set URL: exposed_url/webhook
9. Ensure that your intents are using fulfillment.
10. Speak with your bot using the console or try one-click integration.
