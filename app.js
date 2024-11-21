const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require("cors");
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const Counter = require('./models/counter');
const { getSuctionIntensity } = require('./SuctionIntensity');
const { getVibrationIntensity } = require('./VibrationIntensity');
const { getSuctionPattern } = require('./SuctionPattern');
const { getVibrationPattern } = require('./VibrationPattern');

const app = express();
const port = 4000;
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://zachar:FCY7BqEMxHHLWa3K@cluster0.fba4z.mongodb.net/easyg?retryWrites=true&w=majority');
mongoose.connection.on("connected", () => {
    console.log("Connected to database");
});

mongoose.connection.on("error", (err) => {
    console.error("Database connection error:", err);
});

const userSchema = new mongoose.Schema({
    user_id: { type: Number, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    nickname: { type: String, required: true, unique: true, lowercase: true },
});


userSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const counter = await Counter.findOneAndUpdate(
                { model: 'User' },
                { $inc: { count: 1 } },
                { new: true, upsert: true } // Create a new counter document if it doesn't exist
            );
            this.user_id = counter.count;
        } catch (error) {
            return next(error);
        }
    }
    next();
});

const User = mongoose.model('User', userSchema);

const easyGjsonSchema = new mongoose.Schema({
    mac_address: { type: String, required: true, unique: true },
    easygjson: { type: mongoose.Schema.Types.Mixed, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const EasyGjson = mongoose.model('EasyGjson', easyGjsonSchema);


app.post('/signup', async (req, res) => {
    let { email, password, nickname } = req.body;

    if (!email || !password || !nickname) {
        return res.status(400).json({ message: 'Email, password, and nickname are required.' });
    }

    // Validate email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format.' });
    }

    // Validate password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            message: 'Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.',
        });
    }

    // Validate nickname
    const nicknameRegex = /^[a-zA-Z0-9_]{1,30}$/;
    if (!nicknameRegex.test(nickname)) {
        return res.status(400).json({
            message: 'Nickname must be 30 or fewer characters and can only contain letters, numbers, and underscores.',
        });
    }

    try {
        // Normalize email and nickname
        email = email.toLowerCase();
        nickname = nickname.toLowerCase();

        // Check if email or nickname already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { nickname }],
        });

        if (existingUser) {
            const conflictField = existingUser.email === email ? 'email' : 'nickname';
            return res.status(409).json({ message: `${conflictField} already exists.` });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({ email, password: hashedPassword, nickname });
        await newUser.save();

        res.status(201).json({ user_id: newUser.user_id, nickname: newUser.nickname });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Error during signup', error });
    }
});



app.post('/login', async (req, res) => {
    let { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // Normalize email
        email = email.toLowerCase();

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ user_id: null, nickname: null, status: 'user_not_exists' });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ user_id: user.user_id, nickname: user.nickname, status: 'pass_incorrect' });
        }

        // Successful login
        res.status(200).json({ user_id: user.user_id, nickname: user.nickname, status: 'user_exists' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Error during login', error });
    }
});



app.delete('/delete-user', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    try {
        // Normalize email
        const normalizedEmail = email.toLowerCase();

        // Find user by email
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Delete user
        await User.deleteOne({ email: normalizedEmail });

        res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user', error });
    }
});







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
                '1': i + 1,
                '2': externalDesiredTemperatureValue,
                '3': internalDesiredTemperatureValue,
                '4': vibrationPatternValue,
                '5': vibrationIntensityValue,
                '6': suctionPatternValue,
                '7': suctionIntensityValue,
                '8': externalLubricationLevel,
                '9': internalLubricationLevel,
                '10': 5
                
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

        // Return the JSON data with an ordered structure
        const orderedData = easyGjsonData.easygjson.map(item => {
            return {
                '1': item['1'],
                '2': item['2'],
                '3': item['3'],
                '4': item['4'],
                '5': item['5'],
                '6': item['6'],
                '7': item['7'],
                '8': item['8'],
                '9': item['9']
            };
        });

        res.status(200).json({ mac_address, data: orderedData });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Error fetching data' });
    }
});



app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
});
