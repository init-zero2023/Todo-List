// jshint esverion6
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');
const port = 3000;

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true });

const itemSchema = {
    task: String,
};

const listSchema = {
    name: String,
    item: [itemSchema],
};

const List = mongoose.model("List", listSchema);

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    task: "Write Diary",
});

const item2 = new Item({
    task: "Hit the + button to add a new item.",
});

const defaultitems = [item1, item2];

app.get('/', (req, res) => {


    Item.find({}, (err, result) => {
        if (err) {
            console.log(err.message);
        } else {
            // console.log(result);
            if (result.length == 0) {
                Item.insertMany(defaultitems, (err) => {
                    if (err) { console.log(err.message); } else console.log("Successfully Added");
                });
                res.redirect('/');
            } else {
                res.render("index", { listTitle: "Today", newListItem: result });
            }
        }
    });
});

app.get("/:customListName", (req, res) => {
    // console.log(req.params.customListName);
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({ "name": customListName }, (err, result) => {
        if (!err) {
            if (!result) {
                console.log("Adding New item to list");
                const list = new List({
                    name: customListName,
                    item: defaultitems,
                });

                console.log("list:", list);
                console.log("defaultitems", defaultitems);
                list.save();
                res.redirect("/" + customListName);

            } else {
                res.render("index", { listTitle: result.name, newListItem: result.item });
                console.log(result.item);
            }
        }
    })

});

app.post('/', (req, res) => {
    const listName = req.body.list;
    const itemName = req.body.newItem;
    const task = new Item({
        task: itemName,
    });
    if (listName == "Today") {
        task.save();
        res.redirect('/');
    } else {
        List.findOne({ name: listName }, (err, result) => {
            result.item.push(task);
            result.save();
            res.redirect("/" + listName);
        });
    }
    // res.render("index", {});
});


app.post('/delete', (req, res) => {

    const checkdId = req.body.checkbox;
    const listName = req.body.listName;
    if (listName === "Today") {
        Item.findByIdAndDelete(req.body.checkbox, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Deleted Successfully");
            }
        });
        res.redirect('/');
    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { item: { _id: checkdId } } }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/' + listName);
            }
        })
    }
    // console.log(req.body.checkbox);
});

app.listen(3000 || process.env.PORT, () => {
    console.log(`Server is listening to port ${3000}`);
});