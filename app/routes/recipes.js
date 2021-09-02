/************************************************************
 * Title:       recipes.js                                  *
 * Author:      Mike Nystoriak (nystoriakm@gmail.com)       *
 * Created:     08/30/2021                                  *
 * Description: Set of API routes that pertain to a recipe. *
 ************************************************************/

const express = require('express')

const Recipe = require('../models/Recipe')
const { extractRecipe } = require('../util/helper')

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

// create a recipe
router.post('/', async (req, res) => {
    const newRecipe = new Recipe(extractRecipe(req.body))
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