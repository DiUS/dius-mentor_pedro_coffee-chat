'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const restService = express();
const Client = require('./client/Client').Client;

const client = Client();
const ERROR = 'Oh oh! An error just happened: ';
const source = 'coffee-webhook';

restService.use(bodyParser.json());

//webhook
restService.post('/webhook', function (req, res) {
    try {
        if (req.body) {
            var requestBody = req.body;

            // List Orders
            if (requestBody.result && requestBody.result.action=="order.list") {
                client.listOrders()
                .then((result) => {
                  var speech = '';
                  for(var i=0; i<result.orders.length; i++){
                    var order = result.orders[i];
                    var summary = '';
                    for(var j=0; j<order.coffeeSummaries.length; j++){
                      var coffee = order.coffeeSummaries[j];
                      j==0?summary=summary+coffee:summary=summary+','+coffee;
                    }
                    // Text format does not work in API.AI
                    speech=speech+' - '+order.name+(summary==''?summary:': '+summary)+'.   ';
                  }
                  return res.json({
                    speech: speech,
                    displayText: speech,
                    source: source
                  });
                })
                .catch(error => {
                  return res.json({
                    contextOut:[],
                    speech: ERROR+error.message,
                    displayText: ERROR+error.message,
                    source: 'apiai-webhook-sample'
                  });
                })
            }

            // Create Order
            if (requestBody.result && requestBody.result.action=="order.create") {
                var requestParameters = requestBody.result.parameters;
                if(requestParameters.name){
                  client.createOrder()
                  .then((order) => client.updateOrder(order.id,requestParameters.name))
                  .then((order) => {
                    console.log(order);
                    return res.json({
                      contextOut:[
                        {
                          name:'order',
                          parameters:{
                            id:order.id,
                            name:order.name
                          },
                          lifespan:10
                        }
                      ],
                      speech: requestBody.result.fulfillment.speech,
                      displayText: requestBody.result.fulfillment.speech,
                      source: source
                    });
                  })
                  .catch(error => {
                    return res.json({
                      contextOut:[],
                      speech: ERROR+error.message,
                      displayText: ERROR+error.message,
                      source: source
                    });
                  })
  	            }
            }

            // Cancel Order
            if (requestBody.result && requestBody.result.action=="order.cancel") {
                var orderId = requestBody.result.contexts[0].parameters.id;
                client.deleteOrder(orderId)
                .then((order) => {
                  console.log(order);
                  return res.json({
                    speech: requestBody.result.fulfillment.speech,
                    displayText: requestBody.result.fulfillment.speech,
                    source: source
                  });
                })
                .catch(error => {
                  return res.json({
                    contextOut:[],
                    speech: ERROR+error.message,
                    displayText: ERROR+error.message,
                    source: source
                  });
                })
            }

            // Create Coffee(s)
            if (requestBody.result && requestBody.result.action=="coffee.create") {
                var requestParameters = requestBody.result.parameters;
                var orderId = requestBody.result.contexts[0].parameters.id;
                var orderName = requestBody.result.contexts[0].parameters.name;
                if(requestParameters.coffee_style && requestParameters.coffee_size && orderId){
                  var quantity = requestParameters.quantity?requestParameters.quantity:1;
                  var done = 0;
                  for(var i=0;i<quantity;i++){
                     client.createDrink(orderId,{style:requestParameters.coffee_style, size:requestParameters.coffee_size})
                     .then((drink) => {
                       done++;
                       console.log(drink);
                       if(done == quantity){
                         var speech = quantity+' '+requestParameters.coffee_size
                          +' '+requestParameters.coffee_style+' added to order '+
                          orderName;
                         return res.json({
                           speech: speech,
                           displayText: speech,
                           source: source
                         });
                       }
                     })
                     .catch(error => {
                       return res.json({
                         speech: ERROR+error.message,
                         displayText: ERROR+error.message,
                         source: source
                       });
                     })
                  }
  	            }
            }

        }
    } catch (err) {
        console.error("Can't process request", err);
        return res.status(400).json({
            status: {
                code: 400,
                errorType: err.message
            }
        });
    }
});


restService.listen((process.env.PORT || 5000), function () {
    console.log("Server listening");
});
