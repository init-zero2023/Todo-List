// jshint esverion6
const express = require('express');
const bodyParser = require('body-parser');
const port = 3000;

const app = express();
let items = [];
let workList = [];
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/', (req, res) => {
    let today = new Date();

    options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    let kindOfDay = today.toLocaleDateString("en-US", options);

    res.render("index", { listTitle: kindOfDay, newListItem: items });
});

app.get('/work', (req, res) => {
    res.render("index", { listTitle: "Work", newListItem: workList });
});

app.post('/', (req, res) => {
    const item = req.body.newItem;
    if (req.body.list === "Work") {
        workList.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }

    // res.render("index", {});
});

app.post('/work', (req, res) => {
    let item = req.body.newItem;
    workList.push(item);
    res.redirect("/work");
})

app.listen(3000 || process.env.PORT, () => {
    console.log(`Server is listening to port ${3000}`);
});