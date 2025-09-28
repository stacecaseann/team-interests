const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  amountString: { type: String, required: true },
  measurementDescription: { type: String, required: false, lowercase: true },
  measurement: { type: String, required: true },
  ingredient: { type: String, required: true },
  ingredientDescription: { type: String, required: false },
});

const instructionSchema = new mongoose.Schema({
  stepNumber: { type: Number }, //this will be auto incremented
  instruction: { type: String, required: true },
});

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  serves: { type: Number, required: true, min: 1 },
  description: { type: String, required: false },
  ingredients: [ingredientSchema],
  instructions: [instructionSchema],
  createdAt: {
    immutable: true,
    type: Date,
    default: () => Date.now(),
  },
  updatedAt: {
    immutable: true,
    type: Date,
    default: () => Date.now(),
  },  
});

//sample functions
recipeSchema.methods.printDescription = function () {
  console.log(`${this.name}: ${this.description}`);
};

recipeSchema.statics.findByName = function (name) {
  return this.where({ name: new RegExp(name, 'i') }); //case insensitive
};

recipeSchema.virtual('recipeDescription').get(function () {
  return `${this.name}: ${this.description}`;
});

recipeSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

recipeSchema.post('save', function (doc, next) {
  console.log('Recipe created/updated:', doc.printDescription());
  next();
});

module.exports = mongoose.model('Recipe', recipeSchema, 'recipes'); //specify collection name as 3rd param
