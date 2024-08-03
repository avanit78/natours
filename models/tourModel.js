const mongoose = require('mongoose');
const validator = require('validator');
const slugify = require('slugify');
// const User = require('./userModel');

const tourSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'A tour must have a name'],
        unique:true,
        trim: true,
        maxlength: [40,'A tour must have less or equal then 40 characters'],
        minlength: [10,'A tour must have more or equal then 10 characters']
        // validate : [validator.isAlpha,'Tour name must only contain characters']
    },
    slug: String,
    duration:{
        type:Number,
        required:[true,'A tour must have a duration']
    },
    maxGroupSize:{
        type:Number,
        required:[true,'A tour must have a group size']
    },
    difficulty:{
        type:String,
        required:[true,'A tour must have a difficulty'],
        enum:{
            values:['easy','medium','difficult'],
            message:'Difficulty is either:easy,medium,difficult'
        }
    },
    ratingsAverage:{
        type:Number,
        default:4.5,
        min: [1,'A tour must have 1 or above rating average'],
        max: [5,'A tour must have 5 or below rating average'],
        set: val=> Math.round(val * 10) / 10 
    },
    ratingsQuantity:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        required:[true, 'A tour must have a price']
    },
    priceDiscount:{
        type: Number,
        validate:{
            validator:function(val){
                //this only points to current doc on New document creation
                return val < this.price;
            }
        }
    },
    summary:{
        type:String,
        trim: true,
    },
    description:{
        type:String,
        trim: true,
        required:[true, 'A tour must have a description']
    },
    imageCover:{
        type:String,
        required:[true, 'A tour must have a imageCover']
    },
    images:[String],
    createdAt:{
        type:Date,
        default:Date.now(),
        select: false
    },
    startDates:[Date],
    secretTour:{
        type: Boolean,
        default:false
    },
    startLocation:{
        type:{
            type:String,
            default:'Point',
            enum:['Point']
        },
        coordinates:[Number],
        address:String,
        description:String
    },
    locations:[
        {
            type:{  type:String,
                default:'Point',
                enum:['Point']
            },
            coordinates:[Number],
            address:String,
            description:String,
            day: Number
        }
    ],
    guides:[
        {
            type: mongoose.Schema.ObjectId,
            ref:'User'
        }
    ]
},{
    toJSON: {virtuals: true},
    toObject:{virtuals:true}
});

tourSchema.index({price:1,ratingsAverage:-1})
// tourSchema.index({slug:1})

tourSchema.index({startLocation: '2dsphere'});

tourSchema.virtual('duratinWeeks').get(function(){
    return this.duration / 7;
});

//virtual populate
tourSchema.virtual('reviews',{
    ref:'Review',
    foreignField:'tour',
    localField:'_id'
})

tourSchema.pre('save',function(next){
    this.slug = slugify(this.name, {lower:true});
    next();
})

// tourSchema.pre('save', async function(next){
//     const guidesPromise = this.guides.map(async id => await User.findById(id));
//     this.guides = await Promise.all(guidesPromise);
//     next();
// })

//QUERY MIDDLEWARE
tourSchema.pre(/^find/,function(next){
    this.populate({
        path:'guides',
        select:'-__v -passwordChangedAt'
    });
    next();
});

tourSchema.pre(/^find/,function(next){
    this.find({secretTour: {$ne: true}});
    this.start = Date.now();
    // console.log("Avanit")
    next();
});

// tourSchema.post(/^find/,function(docs,next){
//     console.log(`Query took ${Date.now() - this.start} milliseconds!`)
//     next();
// })

// tourSchema.pre('aggregate',function(next){
//     this.pipeline({secretTour: {$ne: true}});

//     next();
// })

const Tour = mongoose.model('Tour',tourSchema);
module.exports = Tour;

// const testTour = new Tour({
//     name:"The Park Camper",
//     rating:4.7,
//     price: 500
// });

// testTour.save().then(doc=>{
//     console.log(doc);
// }).catch(err=>{
//     console.log("Error",err)
// })