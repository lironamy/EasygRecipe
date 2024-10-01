const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require("cors");

// Import your functions
const { getSuctionIntensity } = require('./SuctionIntensity');
const { getVibrationIntensity } = require('./VibrationIntensity');
const { getSuctionPattern } = require('./SuctionPattern');
const { getVibrationPattern } = require('./VibrationPattern');

const app = express();
const port = 4000;

// Allow Cross-Origin requests
app.use(cors());

// Connect to MongoDB
mongoose.connect(
    "mongodb+srv://lironamy:Ladygaga2@cluster0.sn5e7l9.mongodb.net/stepgeneretor?retryWrites=true&w=majority"
);


// On Connection
mongoose.connection.on("connected", () => {
    console.log("Connected to database");
});

mongoose.connection.on("error", (err) => {
    console.error("Database connection error:", err);
});

// Define schemas for storing answers and JSON
const answerSchema = new mongoose.Schema({
    question: { type: String, required: true },
    id: { type: Number, required: true },
    type: { type: String, required: true },
    answers: { type: Array, required: false },
    answer_id: mongoose.Schema.Types.Mixed,
    mac_address: { type: String, required: true }
});

const easyGjsonSchema = new mongoose.Schema({
    mac_address: { type: String, required: true, unique: true },
    easygjson: { type: mongoose.Schema.Types.Mixed, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Create models based on the schema
const Answer = mongoose.model('Answer', answerSchema);
const EasyGjson = mongoose.model('EasyGjson', easyGjsonSchema);

// Middleware to parse incoming JSON data
app.use(bodyParser.json());

// Define the setanswers POST route
app.post('/setanswers', async (req, res) => {
    const { mac_address, answers } = req.body;

    if (!mac_address || !answers || !Array.isArray(answers)) {
        return res.status(400).json({ message: 'Invalid input format. "mac_address" and "answers" are required.' });
    }

    try {
        // Extract hrausel preferences and other required inputs
        let hrauselPreferences = [0, 0];
        let heatLevel = 0;
        let intenseLvlStart = 0, intenseLvlMidway = 0, intenseLvlEnd = 0;
        let intimacyStart = 0, intimacyMidway = 0, intimacyEnd = 0;
        let diversityValue = 0;
        let lubeLevel = 0;

        // Extract hrausel preferences and other values from the answers
        for (const answer of answers) {
            if (answer.question.includes("What are your hrausel preferences?")) {
                hrauselPreferences = answer.answer_id;
            }
            if (answer.question.includes("Which heat level takes your pleasure up a notch?")) {
                heatLevel = answer.answer_id;
            }
            if (answer.question.includes("How intense do you like each part of the program to be?")) {
                for (const subAnswer of answer.answers) {
                    if (subAnswer.possible_answers === "Start") {
                        intenseLvlStart = subAnswer.answer_id;
                    }
                    if (subAnswer.possible_answers === "Midway") {
                        intenseLvlMidway = subAnswer.answer_id;
                    }
                    if (subAnswer.possible_answers === "End") {
                        intenseLvlEnd = subAnswer.answer_id;
                    }
                }
            }
            if (answer.question.includes("How would you articulate your ideal intimacy?")) {
                for (const subAnswer of answer.answers) {
                    if (subAnswer.possible_answers === "Start") {
                        intimacyStart = subAnswer.answer_id;
                    }
                    if (subAnswer.possible_answers === "Midway") {
                        intimacyMidway = subAnswer.answer_id;
                    }
                    if (subAnswer.possible_answers === "End") {
                        intimacyEnd = subAnswer.answer_id;
                    }
                }
            }
            if (answer.question.includes("How much do you love diversity in your sexual experiences?")) {
                diversityValue = answer.answer_id;
            }
            if (answer.question.includes("How much lube would make your journey to pleasure smoother?")) {
                lubeLevel = answer.answer_id;
            }
        }

        // Process answers to create an array of dicts from index 1 to 120
        let processedDataArray = [];

        for (let index = 1; index <= 120; index++) {
            // Determine the section based on index
            let section = "start";
            if (index > 40 && index <= 80) {
                section = "midway";
            } else if (index > 80) {
                section = "end";
            }

            // Calculate values using the imported functions
            const vibrationPattern = getVibrationPattern(index, 1, 2, 3, 4, hrauselPreferences, diversityValue)[0];
            const vibrationIntensity = getVibrationIntensity(index, intenseLvlStart, intimacyStart, intenseLvlMidway, intimacyMidway, intimacyEnd, intenseLvlEnd, hrauselPreferences)[0];
            const suctionPattern = getSuctionPattern(index, 1, 2, 3, 4, hrauselPreferences, diversityValue)[0];
            const suctionIntensity = getSuctionIntensity(index, intenseLvlStart, intimacyStart, intenseLvlMidway, intimacyMidway, intimacyEnd, intenseLvlEnd, hrauselPreferences)[0];

            // Calculate lubrication levels using lube level and hrausel preferences
            const externalLubricationLevel = lubeLevel * hrauselPreferences[1];
            const internalLubricationLevel = lubeLevel * hrauselPreferences[0];

            // Calculate the temperature values
            const internalDesiredTemperatureValue = heatLevel * hrauselPreferences[0];
            const externalDesiredTemperatureValue = heatLevel * hrauselPreferences[1];

            // Create the data object
            let dict = {
                index: index,
                dict_in: {
                    section: section,
                    externalDesiredTemperatureValue: externalDesiredTemperatureValue,
                    internalDesiredTemperatureValue: internalDesiredTemperatureValue,
                    vibrationPattern: vibrationPattern,
                    vibrationIntensity: vibrationIntensity,
                    suctionPattern: suctionPattern,
                    suctionIntensity: suctionIntensity,
                    externalLubricationLevel: externalLubricationLevel,
                    internalLubricationLevel: internalLubricationLevel,
                    hrauselPreferences: {
                        internal: hrauselPreferences[0],
                        external: hrauselPreferences[1]
                    }
                }
            };

            processedDataArray.push(dict);
        }

        // Save the processed data in MongoDB
        const updatedGjson = await EasyGjson.findOneAndUpdate(
            { mac_address },
            { $set: { easygjson: processedDataArray, updated_at: Date.now() } },
            { new: true, upsert: true }
        );

        res.status(200).json({ message: 'Answers received and JSON saved successfully', mac_address, data: updatedGjson });
    } catch (error) {
        console.error('Error processing or saving answers:', error);
        res.status(500).json({ message: 'Error processing or saving answers', error });
    }
});

// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
});
