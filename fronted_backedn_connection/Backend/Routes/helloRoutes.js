const route = require("express").Router()

route.get("/hello", (req, res) => {
  res.json(
    { 
    message: "Hello from Backend!" 
    }
);
});
module.exports = route;
