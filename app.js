const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require("cors");
const fs = require('fs');
const path = require('path');

const { getSuctionIntensity } = require('./SuctionIntensity');
const { getVibrationIntensity } = require('./VibrationIntensity');
const { getSuctionPattern } = require('./SuctionPattern');
const { getVibrationPattern } = require('./VibrationPattern');

const app = express();
const port = 4000;

app.use(cors());

mongoose.connect(
    'mongodb+srv://zachar:FCY7BqEMxHHLWa3K@cluster0.fba4z.mongodb.net/easyg?retryWrites=true&w=majority');



mongoose.connection.on("connected", () => {
    console.log("Connected to database");
});

mongoose.connection.on("error", (err) => {
    console.error("Database connection error:", err);
});

const easyGjsonSchema = new mongoose.Schema({
    mac_address: { type: String, required: true, unique: true },
    easygjson: { type: mongoose.Schema.Types.Mixed, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const EasyGjson = mongoose.model('EasyGjson', easyGjsonSchema);

app.use(bodyParser.json());

app.post('/setanswers', async (req, res) => {
    const { mac_address, answers } = req.body;

    if (!mac_address || !answers || !Array.isArray(answers)) {
        return res.status(400).json({ message: 'Invalid input format. "mac_address" and "answers" are required.' });
    }

    try {
        let hrauselPreferences = [0, 0];
        let heatLevel = 0;
        let intenseLvlStart = 0, intenseLvlMidway = 0, intenseLvlEnd = 0;
        let intimacyStart = 0, intimacyMidway = 0, intimacyEnd = 0;
        let diversityValue = 0;
        let lubeLevel = 0;
        const patternsStartOne = 1;
        const patternsStartTwo = 2;
        const patternsStartThree = 3;
        const patternsStartFour = 4;

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

        let processedDataArray = [];
        const hrauselValues = hrauselPreferences;

        for (let i = 0; i <= 119; i++) {
            let section = "start";
            if (i > 40 && i <= 80) {
                section = "midway";
            } else if (i > 80) {
                section = "end";
            }
        
            let vibrationPattern = getVibrationPattern(i, patternsStartOne, patternsStartTwo, patternsStartThree, patternsStartFour, hrauselValues, diversityValue);
            let vibrationIntensity = getVibrationIntensity(i, intenseLvlStart, intimacyStart, intenseLvlMidway, intimacyMidway, intimacyEnd, intenseLvlEnd, hrauselValues);
            let suctionPattern = getSuctionPattern(i, patternsStartOne, patternsStartTwo, patternsStartThree, patternsStartFour, hrauselValues, diversityValue);
            let suctionIntensity = getSuctionIntensity(i, intenseLvlStart, intimacyStart, intenseLvlMidway, intimacyMidway, intimacyEnd, intenseLvlEnd, hrauselValues);
        
            let vibrationPatternValue = (vibrationPattern && vibrationPattern.length > 0) ? Math.min(vibrationPattern[0], 10) : 0;
            let vibrationIntensityValue = (vibrationIntensity && vibrationIntensity.length > 0) ? Math.min(vibrationIntensity[0], 10) : 0;
            let suctionPatternValue = (suctionPattern && suctionPattern.length > 0) ? Math.min(suctionPattern[0], 10) : 0;
            let suctionIntensityValue = (suctionIntensity && suctionIntensity.length > 0) ? Math.min(suctionIntensity[0], 10) : 0;
        
            let externalLubricationLevel = Math.min(lubeLevel * hrauselPreferences[1], 10);
            let internalLubricationLevel = Math.min(lubeLevel * hrauselPreferences[0], 10);
        
            let internalDesiredTemperatureValue = heatLevel * hrauselPreferences[0]; // No limit here
            let externalDesiredTemperatureValue = heatLevel * hrauselPreferences[1]; // No limit here
        
            let dict = {
                i: i + 1,
                dict_in: {
                    section: section,
                    time: "5 sec",
                    externalDesiredTemperatureValue: externalDesiredTemperatureValue,
                    internalDesiredTemperatureValue: internalDesiredTemperatureValue,
                    vibrationPattern: vibrationPatternValue,
                    vibrationIntensity: vibrationIntensityValue,
                    suctionPattern: suctionPatternValue,
                    suctionIntensity: suctionIntensityValue,
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
        

        console.log('saving data:');
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

// Route to download JSON file
app.get('/download', async (req, res) => {
    const { mac_address } = req.query;

    if (!mac_address) {
        return res.status(400).json({ message: 'mac_address query parameter is required.' });
    }

    try {
        const easyGjsonData = await EasyGjson.findOne({ mac_address });

        if (!easyGjsonData) {
            return res.status(404).json({ message: 'No data found for the given MAC address' });
        }

        const filePath = path.join(__dirname, 'easygjson.json');
        fs.writeFileSync(filePath, JSON.stringify(easyGjsonData.easygjson, null, 2));

        res.download(filePath, 'easygjson.json', (err) => {
            if (err) {
                console.error('Error downloading the file:', err);
                res.status(500).send('Error downloading the file.');
            }

            // Optional: Clean up the temporary file after download
            fs.unlinkSync(filePath);
        });
    } catch (error) {
        console.error('Error fetching or downloading data:', error);
        res.status(500).json({ message: 'Error fetching or downloading data' });
    }
});


app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
});
