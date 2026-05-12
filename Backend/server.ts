import app from "./src/app.js";

console.log(" before listen");

app.listen(3000, () => {
    console.log(" server running");
});