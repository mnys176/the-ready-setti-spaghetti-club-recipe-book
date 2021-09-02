/************************************************************
 * Title:       recipes.js                                  *
 * Author:      Mike Nystoriak (nystoriakm@gmail.com)       *
 * Created:     08/30/2021                                  *
 * Description: Set of API routes that pertain to a recipe. *
 ************************************************************/

const express = require('express')
const Recipe = require('../models/Recipe')
const Quantifiable = require('../util/quantify')

const router = express.Router()

// get all recipes
router.get('/', async (req, res) => {
    try {
        const results = await Recipe.find()
        return res.status(200).json(results)
    } catch (err) {
        const message = 'Something went wrong...'
        return res.status(500).json({ status: 500, message })
    }
})

// get recipe by ID
router.get('/:id', async (req, res) => {
    try {
        const results = await Recipe.findById(req.params.id)
        return res.status(200).json(results)
    } catch (err) {
        const message = `No recipes returned with ID of "${req.params.id}".`
        const reason = 'Not found.'
        return res.status(404).json({ status: 404, message })
    }
})

/**
 * Parses a quantifiable object from the frontend to
 * the backend.
 * 
 * @author Mike Nystoriak <nystoriakm@gmail.com>
 *
 * @param {object} input Frontend quantifiable.
 * 
 * @returns {object} Backend quantifiable.
 */
const mapQuantifiable = input => {
    if (input) {
        const quantifiable = Quantifiable.build(input.quantity, input.unit)
        return {
            readable: quantifiable.readable,
            numeric: quantifiable.normalized,
            unit: quantifiable.units
        }
    }
}

// create a recipe
router.post('/', async (req, res) => {
    const recipeBuilder = { ...req.body }

    // build preparation time if it exists
    recipeBuilder.prepTime = mapQuantifiable(req.body.prepTime)

    // build ingredients if they exist
    if (req.body.ingredients) {
        recipeBuilder.ingredients = req.body.ingredients.map(i => {
            return {
                name: i.name,
                amount: mapQuantifiable(i.amount)
            }
        })
    }
    const newRecipe = new Recipe(recipeBuilder)

    try {
        await newRecipe.save()
        const message = `The recipe with ObjectID of "${newRecipe._id}" was successfully created.`
        return res.status(201).json({ status: 201, message })
    } catch (err) {
        const message = `The recipe with ObjectID of "${newRecipe._id}" could not be created.`
        const reason = err.message
        return res.status(400).json({ status: 400, message, reason })
    }
})

module.exports = router