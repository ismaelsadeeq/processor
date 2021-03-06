var express                 = require("express"),
    app                     = express(),
    bodyParser              = require("body-parser"),
    knex                    = require("./db/knex"),
    emailValidator          = require("deep-email-validator"),
    NaijaStates             = require('naija-state-local-government');

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));

async function isEmailValid(email) {
    return emailValidator.validate(email)
}
let errors = []
let success = [];

// function changeFunc() {
//     var selectBox = document.getElementById("selectBox");
//     var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    
//     let lgas = NaijaStates.lgas(selectedValue).lgas;
//     return lgas;
// }




app.get("/", function(req, res){
    res.render("landing", {success, errors, NaijaStates});
    errors = success = [];s
});

app.post("/", (req, res) =>{
    errors = [];
    var user = req.body.user;
    async function isValid() {
        const {valid} = await isEmailValid(user.email);
        return valid;
    }
    
    if(!user.name || !user.company || !user.country ||
        !user.state || !user.lga || !user.email ||
        !user.number || !user.message || !user.capacity){
        errors.push({message: "please enter all fields"})
        res.redirect("/")
    }else if(isValid){
        errors.push({message: "please provide a valid email address"})
        res.redirect("/")

    }
    else{
        knex('user').where('email', user.email).first()
    .then((email) => {
        if(email){
            errors.push({message: "Email already exist"});
            res.redirect("/")
            errors = [];
        }else{
            knex('user')
            .insert(user)
            .then( () =>{
                success.push({message: "You have successfully submitted"})
                res.redirect("/")
            })
        }
    });

    }
    
    
    
})

app.listen(3004, () => {
    console.log("The processo-africa server has started");
});