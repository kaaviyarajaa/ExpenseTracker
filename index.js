/**
 * Expense Tracker
 * features and end points
 * Adding a new expense :/add-expense ->post
 * Display existing expense:/get expense ->get
 * editing exting entrirs:edit ->patch/put
 * deleting expenses:delete expense ->delete
 * budget reporting
 * login and sign up page
 * validating user
 * 
 * defining schema
 * categories
 * amount
 * date
 * 
 * package for db connectiviry,schema,queries
 */

const bodyParser = require('body-parser')
const mongoose=require('mongoose')
const express =require('express')
const cors=require('cors')
const {Expense}=require('./schema.js')
const app = express()
app.use(bodyParser.json())
app.use(cors())

 async function connectDb(){
    try{
    await mongoose.connect('mongodb+srv://kaviya:kaviya@cluster0.cwjl4ad.mongodb.net/expensetracker?retryWrites=true&w=majority&appName=Cluster0')
    console.log('DB connection estabilise:)')
    const port=process.env.PORT || 8000
app.listen(port,function(){
    console.log(`Listening on port  ${port}...`)
})
 }
catch(error){
    console.log(error)
    console.log('could not connect to the port')
}
 }

 connectDb()
 app.post('/add-expense',async function(request,response){
   /**  console.log(request.body)
    response.json({
        "status" : "created"
    })*/
    try{await Expense.create({ //to enetr the value inside db
        "amount" : request.body.amount,
        "category":request.body.category,
        "date":request.body.date
    })
    response.status(201).json({
        "status" : "updated",
        "new entry": "created new entry"
    })}
    catch(error){
        response.status(500).json({
            "status" : "not updated",
            "new entry": "not created new entry"
        }) 
    }   
 })

 app.get('/get-expenses',async function(request,response){
   try{
    const expenses= await Expense.find()
    response.status(200).json(expenses)
}
   catch(error){
    response.status(500).json({
        "status":"failure",
        "message" : "could not fetch entries",
        "error" : error
    })
    
   }
 })
//using params: localhost:8000/delete-expense/65e6a1fa5c812d65e424672a
app.delete('/delete-expense/:id',async function(request,response){
     
      try{
        const expenses= await Expense.findById(request.params.id)
        console.log(expenses)
        if(expenses){
         await Expense.findByIdAndDelete(request.params.id)
         response.status(200).json({
             "status":"success",
             "message":"deleted"
         })
        }
        else{
         response.status(404).json({
             "status":"failure",
             "message":"not deleted"
         })
        }
      }
      catch(error){
        response.status(500).json({
            "status":"error",
        })
      }
    })
app.patch('/edit-expense/:id',async function(request,response){
    try{
        const expenseentry=await Expense.findById(request.params.id)
    if(expenseentry){
        await expenseentry.updateOne({
            "amount":request.body.amount,
            "category":request.body.category,
            "date":request.body.date
        })
        response.status(200).json({
            "status":"Success",
            "message":"edited"
        })
    }
    else{
        response.status(404).json({
            "status":"failure",
            "message":"not edited"
        })
    }
    }
    catch(error){
        response.status(500).json({
            "status":"error"
        })
    }
})

