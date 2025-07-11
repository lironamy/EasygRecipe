const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require("cors");
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const https = require('https');
const http = require('http');
const Counter = require('./models/counter');
const DeviceParameters = require('./models/DeviceParameters');
const DeviceParametersVersion = require('./models/DeviceParametersVersion');
const { getSuctionIntensity } = require('./SuctionIntensity');
const { getVibrationIntensity } = require('./VibrationIntensity');
const { getSuctionPattern } = require('./SuctionPattern');
const { getVibrationPattern } = require('./VibrationPattern');
const AWS = require('aws-sdk');
require('dotenv').config();

const app = express();
const port = 4000;
const httpsPort = 4001; // HTTPS port

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://arkit:Ladygaga2@cluster0.fba4z.mongodb.net/easyg?retryWrites=true&w=majority&appName=Cluster0');
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
    nickname: { type: String, required: true, lowercase: true }
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

const deviceSettingsSchema = new mongoose.Schema({
    mac_address: { type: String, required: true, unique: true },
    onboarding_pass: { type: Boolean, default: false },
    prog_choose: { type: String, enum: ['wellness', 'pleasure'], default: 'pleasure' },
    pleasure_q: { type: Boolean, default: false },
    wellness_q: { type: Boolean, default: false },
    demomode: { type: Boolean, default: false },
    useDebugMode: { type: Boolean, default: false },
    remoteLogsEnabled: { type: Boolean, default: false },
    demoAccounts: { type: [String], default: [] },
    wififlow: { type: Boolean, default: false },  // New flag
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});


const DeviceSettings = mongoose.model('DeviceSettings', deviceSettingsSchema);

// Configure AWS
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

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

    // Validate nickname length (only max 30 characters)
    if (nickname.length > 32) {
        return res.status(400).json({ message: 'Nickname must be 32 or fewer characters.' });
    }

    try {
        // Normalize email and nickname
        email = email.toLowerCase();
        nickname = nickname.toLowerCase();

        // Check if email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists.' });
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




function mapSuctionIntensity(pattern, intensity) {
    // Only apply mapping for wave (3) or mountain (4) patterns
    if (pattern === 2 || pattern === 3 || pattern === 4) {
        if (intensity >= 1 && intensity <= 3) {
            return 1;
        } else if (intensity >= 4 && intensity <= 6) {
            return 2;
        } else if (intensity >= 7 && intensity <= 10) {
            return 3;
        }
    }
    return intensity;
}


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
        let stimulationPreference = null;
        const patternsStartOne = 1;
        const patternsStartTwo = 2;
        const patternsStartThree = 3;
        const patternsStartFour = 4;

        for (const answer of answers) {
            if (answer.question.includes("6")) {
                hrauselPreferences = answer.answer_id;
            }
            if (answer.question.includes("7")) {
                stimulationPreference = answer.answers;
            }
            if (answer.question.includes("4")) {
                heatLevel = answer.answer_id;
            }
            if (answer.question.includes("1")) {
                for (const subAnswer of answer.answers) {
                    if (subAnswer.possible_answers === "Foreplay") {
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
            if (answer.question.includes("2")) {
                for (const subAnswer of answer.answers) {
                    if (subAnswer.possible_answers === "Foreplay") {
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
            if (answer.question.includes("3")) {
                diversityValue = answer.answer_id;
            }
            if (answer.question.includes("5")) {
                lubeLevel = answer.answer_id;
            }
        }

        let processedDataArray = [];
        let currentHrauselValues = [...hrauselPreferences];

        for (let i = 0; i <= 119; i++) {
            let section = i <= 40 ? "start" : i <= 80 ? "midway" : "end";

            
            
            // Update hrauselValues based on stimulation preference if needed
            if (hrauselPreferences[0] === 1 && hrauselPreferences[1] === 1 && stimulationPreference) {
                if (stimulationPreference === "Start Vaginal then Clitoral") {
                    currentHrauselValues = i < 40 ? [1, 0] : [1, 1];
                } else if (stimulationPreference === "Start Clitoral then Vaginal") {
                    currentHrauselValues = i < 40 ? [0, 1] : [1, 1];
                } else if (stimulationPreference === "Combined all the way") {
                    currentHrauselValues = [1, 1];
                }
            }

            let vibrationPattern = getVibrationPattern(i, patternsStartOne, patternsStartTwo, patternsStartThree, patternsStartFour, currentHrauselValues, diversityValue);
            let vibrationIntensity = getVibrationIntensity(i, intenseLvlStart, intimacyStart, intenseLvlMidway, intimacyMidway, intimacyEnd, intenseLvlEnd, currentHrauselValues);
            let suctionPattern = getSuctionPattern(i, patternsStartOne, patternsStartTwo, patternsStartThree, patternsStartFour, currentHrauselValues, diversityValue);
            let suctionIntensity = getSuctionIntensity(i, intenseLvlStart, intimacyStart, intenseLvlMidway, intimacyMidway, intimacyEnd, intenseLvlEnd, currentHrauselValues);
    
            let vibrationPatternValue = (vibrationPattern && vibrationPattern.length > 0) ? Math.min(vibrationPattern[0], 10) : 0;
            let vibrationIntensityValue = (vibrationIntensity && vibrationIntensity.length > 0) ? Math.min(vibrationIntensity[0], 10) : 0;
            let suctionPatternValue = (suctionPattern && suctionPattern.length > 0) ? Math.min(suctionPattern[0], 10) : 0;
            
            // Apply the mapping for suction intensity
            let rawSuctionIntensityValue = (suctionIntensity && suctionIntensity.length > 0) ? suctionIntensity[0] : 0;
            let mappedSuctionIntensityValue = mapSuctionIntensity(suctionPatternValue, rawSuctionIntensityValue);
            let suctionIntensityValue = Math.min(mappedSuctionIntensityValue, suctionPatternValue === 3 || suctionPatternValue === 4 ? 3 : 10);
    
            let externalLubricationLevel = Math.min(lubeLevel * currentHrauselValues[1], 10);
            let internalLubricationLevel = Math.min(lubeLevel * currentHrauselValues[0], 10);
            let internalDesiredTemperatureValue = heatLevel * currentHrauselValues[0];
            let externalDesiredTemperatureValue = heatLevel * currentHrauselValues[1];
            
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

        // Get temperature and lubrication settings (first block)
        const firstBlock = easyGjsonData.easygjson[0];
        const tempsLubrication = {
            '3': firstBlock['3'],  // Internal Temperature
            '8': firstBlock['8'],  // External Lubrication
            '9': firstBlock['9'],  // Internal Lubrication
        };

        // Find the first pattern data with "1": 1
        const firstPatternIndex = easyGjsonData.easygjson.findIndex(item => item['1'] === 1);
        
        // Get vibration and suction patterns starting from the first pattern ("1": 1)
        const patternsData = firstPatternIndex !== -1 
            ? easyGjsonData.easygjson.slice(firstPatternIndex) 
            : easyGjsonData.easygjson.slice(1);
            
        // Only keep the necessary fields for each pattern
        const formattedPatterns = patternsData.map(item => {
            return {
                '4': item['4'],    // Vibration pattern
                '5': item['5'],    // Vibration intensity
                '6': item['6'],    // Suction pattern
                '7': item['7'],    // Suction intensity
            };
        });

        // Combined response in the new recipe format
        const combinedData = [tempsLubrication, ...formattedPatterns];

        res.status(200).json({ mac_address, data: combinedData });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Error fetching data' });
    }
});



app.get('/TempsLubrication', async (req, res) => {
    const { mac_address } = req.query;

    if (!mac_address) {
        return res.status(400).json({ message: 'mac_address query parameter is required.' });
    }

    try {
        const easyGjsonData = await EasyGjson.findOne({ mac_address });

        if (!easyGjsonData) {
            return res.status(404).json({ message: 'No data found for the given MAC address' });
        }

        // Return only the first block (first element) from easygjson data
        const firstBlock = easyGjsonData.easygjson[0];

        // Return the first block with an ordered structure (2, 3, 8, 9 fields)
        const orderedData = {
            '2': firstBlock['2'],  // External Temperature
            '3': firstBlock['3'],  // Internal Temperature
            '8': firstBlock['8'],  // External Lubrication
            '9': firstBlock['9'],  // Internal Lubrication
        };

        res.status(200).json({ mac_address, data: orderedData });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Error fetching data' });
    }
});


app.post('/onboardingsprocess', async (req, res) => {
    const { onboarding_pass, mac_address } = req.body;

    if (onboarding_pass === undefined || !mac_address) {
        return res.status(400).json({ message: 'onboarding_pass and mac_address are required.' });
    }

    try {
        const updatedSettings = await DeviceSettings.findOneAndUpdate(
            { mac_address },
            { 
                $set: { 
                    onboarding_pass, 
                    updated_at: Date.now() 
                } 
            },
            { new: true, upsert: true }
        );

        res.status(200).json({
            message: 'Onboarding status updated successfully',
            data: {
                mac_address,
                onboarding_pass: updatedSettings.onboarding_pass
            }
        });
    } catch (error) {
        console.error('Error updating onboarding status:', error);
        res.status(500).json({ message: 'Error updating onboarding status', error });
    }
});

// Endpoint for program choice
app.post('/progchoose', async (req, res) => {
    const { ProgChoose, mac_address } = req.body;

    if (!ProgChoose || !mac_address) {
        return res.status(400).json({ message: 'ProgChoose and mac_address are required.' });
    }

    // Normalize input
    const normalizedProgChoice = ProgChoose.toLowerCase();
    
    // Validate program choice
    if (!['wellness', 'pleasure'].includes(normalizedProgChoice)) {
        return res.status(400).json({ message: 'ProgChoose must be either "wellness" or "pleasure".' });
    }

    try {
        const updatedSettings = await DeviceSettings.findOneAndUpdate(
            { mac_address },
            { 
                $set: { 
                    prog_choose: normalizedProgChoice, 
                    updated_at: Date.now() 
                } 
            },
            { new: true, upsert: true }
        );

        res.status(200).json({
            message: 'Program choice updated successfully',
            data: {
                mac_address,
                prog_choose: updatedSettings.prog_choose
            }
        });
    } catch (error) {
        console.error('Error updating program choice:', error);
        res.status(500).json({ message: 'Error updating program choice', error });
    }
});

// Endpoint to get onboarding status
app.get('/get/onboardingsprocess', async (req, res) => {
    const { mac_address } = req.query;

    if (!mac_address) {
        return res.status(400).json({ message: 'mac_address query parameter is required.' });
    }

    try {
        const deviceSettings = await DeviceSettings.findOne({ mac_address });

        if (!deviceSettings) {
            return res.status(404).json({ 
                message: 'No data found for the given MAC address',
                data: { onboarding_pass: false }  // Default value if no record exists
            });
        }

        res.status(200).json({
            message: 'Onboarding status retrieved successfully',
            data: { onboarding_pass: deviceSettings.onboarding_pass }
        });
    } catch (error) {
        console.error('Error fetching onboarding status:', error);
        res.status(500).json({ message: 'Error fetching onboarding status', error });
    }
});

// Endpoint to get program type
app.get('/get/progtype', async (req, res) => {
    const { mac_address } = req.query;

    if (!mac_address) {
        return res.status(400).json({ message: 'mac_address query parameter is required.' });
    }

    try {
        const deviceSettings = await DeviceSettings.findOne({ mac_address });

        if (!deviceSettings) {
            return res.status(404).json({ 
                message: 'No data found for the given MAC address',
                data: { ProgChoose: 'pleasure' }  // Default value if no record exists
            });
        }

        res.status(200).json({
            message: 'Program type retrieved successfully',
            data: { ProgChoose: deviceSettings.prog_choose }
        });
    } catch (error) {
        console.error('Error fetching program type:', error);
        res.status(500).json({ message: 'Error fetching program type', error });
    }
});

app.post('/debugmode', async (req, res) => {
    const { mac_address, demomode } = req.body;

    if (demomode === undefined || !mac_address) {
        return res.status(400).json({ message: 'demomode and mac_address are required.' });
    }

    try {
        const updatedSettings = await DeviceSettings.findOneAndUpdate(
            { mac_address },
            { 
                $set: { 
                    demomode, 
                    updated_at: Date.now() 
                } 
            },
            { new: true, upsert: true }
        );

        res.status(200).json({
            message: 'Demo mode updated successfully',
            data: {
                mac_address,
                demomode: updatedSettings.demomode
            }
        });
    } catch (error) {
        console.error('Error updating demomode:', error);
        res.status(500).json({ message: 'Error updating demomode', error });
    }
});

app.post('/debugmode/use', async (req, res) => {
    const { mac_address, useDebugMode } = req.body;

    if (useDebugMode === undefined || !mac_address) {
        return res.status(400).json({ message: 'useDebugMode and mac_address are required.' });
    }

    try {
        const updatedSettings = await DeviceSettings.findOneAndUpdate(
            { mac_address },
            { 
                $set: { 
                    useDebugMode, 
                    updated_at: Date.now() 
                } 
            },
            { new: true, upsert: true }
        );

        res.status(200).json({
            message: 'Use debug mode updated successfully',
            data: {
                mac_address,
                useDebugMode: updatedSettings.useDebugMode
            }
        });
    } catch (error) {
        console.error('Error updating useDebugMode:', error);
        res.status(500).json({ message: 'Error updating useDebugMode', error });
    }
});

app.post('/debugmode/remoteLogs', async (req, res) => {
    const { mac_address, remoteLogsEnabled } = req.body;

    if (remoteLogsEnabled === undefined || !mac_address) {
        return res.status(400).json({ message: 'remoteLogsEnabled and mac_address are required.' });
    }

    try {
        const updatedSettings = await DeviceSettings.findOneAndUpdate(
            { mac_address },
            { 
                $set: { 
                    remoteLogsEnabled, 
                    updated_at: Date.now() 
                } 
            },
            { new: true, upsert: true }
        );

        res.status(200).json({
            message: 'Remote logs enabled updated successfully',
            data: {
                mac_address,
                remoteLogsEnabled: updatedSettings.remoteLogsEnabled
            }
        });
    } catch (error) {
        console.error('Error updating remoteLogsEnabled:', error);
        res.status(500).json({ message: 'Error updating remoteLogsEnabled', error });
    }
});


app.get('/get/demomode', async (req, res) => {
    const { mac_address } = req.query;

    if (!mac_address) {
        return res.status(400).json({ message: 'mac_address query parameter is required.' });
    }

    try {
        const deviceSettings = await DeviceSettings.findOne({ mac_address });

        if (!deviceSettings) {
            return res.status(404).json({ 
                message: 'No data found for the given MAC address',
                data: { demomode: false }  // Default value if no record exists
            });
        }

        res.status(200).json({
            message: 'Demo mode status retrieved successfully',
            data: { demomode: deviceSettings.demomode }
        });
    } catch (error) {
        console.error('Error fetching demomode status:', error);
        res.status(500).json({ message: 'Error fetching demomode status', error });
    }
});


app.get('/get/useDebugMode', async (req, res) => {
    const { mac_address } = req.query;

    if (!mac_address) {
        return res.status(400).json({ message: 'mac_address query parameter is required.' });
    }

    try {
        const deviceSettings = await DeviceSettings.findOne({ mac_address });

        if (!deviceSettings) {
            return res.status(404).json({ 
                message: 'No data found for the given MAC address',
                data: { useDebugMode: false }
            });
        }

        res.status(200).json({
            message: 'Use debug mode status retrieved successfully',
            data: { useDebugMode: deviceSettings.useDebugMode }
        });
    } catch (error) {
        console.error('Error fetching useDebugMode status:', error);
        res.status(500).json({ message: 'Error fetching useDebugMode status', error });
    }
});

app.get('/get/remoteLogsEnabled', async (req, res) => {
    const { mac_address } = req.query;

    if (!mac_address) {
        return res.status(400).json({ message: 'mac_address query parameter is required.' });
    }

    try {
        const deviceSettings = await DeviceSettings.findOne({ mac_address });

        if (!deviceSettings) {
            return res.status(404).json({ 
                message: 'No data found for the given MAC address',
                data: { remoteLogsEnabled: false }
            });
        }

        res.status(200).json({
            message: 'Remote logs enabled status retrieved successfully',
            data: { remoteLogsEnabled: deviceSettings.remoteLogsEnabled }
        });
    } catch (error) {
        console.error('Error fetching remoteLogsEnabled status:', error);
        res.status(500).json({ message: 'Error fetching remoteLogsEnabled status', error });
    }
});

app.post('/update/debugSettings', async (req, res) => {
    const { demomode, useDebugMode, remoteLogsEnabled, demoAccounts } = req.body;

    let updateFields = { updated_at: Date.now() };
    if (typeof demomode !== 'undefined') updateFields.demomode = demomode;
    if (typeof useDebugMode !== 'undefined') updateFields.useDebugMode = useDebugMode;
    if (typeof remoteLogsEnabled !== 'undefined') updateFields.remoteLogsEnabled = remoteLogsEnabled;
    if (typeof demoAccounts !== 'undefined') {
        // Validate that demoAccounts is an array of valid email addresses
        if (!Array.isArray(demoAccounts)) {
            return res.status(400).json({ message: 'demoAccounts must be an array' });
        }
        
        // Optional: Validate email format for each account
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const invalidEmails = demoAccounts.filter(email => !emailRegex.test(email));
        
        if (invalidEmails.length > 0) {
            return res.status(400).json({ 
                message: 'Invalid email format in demoAccounts', 
                invalidEmails 
            });
        }
        
        updateFields.demoAccounts = demoAccounts;
    }

    if (Object.keys(updateFields).length === 1) { // Only updated_at is present
        return res.status(400).json({ 
            message: 'At least one setting (demomode, useDebugMode, remoteLogsEnabled, demoAccounts) must be provided for update.' 
        });
    }

    try {
        const updatedSettings = await DeviceSettings.findOneAndUpdate(
            {},                          
            { $set: updateFields },      
            { new: true, upsert: true }  
        );
    
        res.status(200).json({
            message: 'Debug settings updated successfully',
            data: {
                demomode: updatedSettings.demomode,
                useDebugMode: updatedSettings.useDebugMode,
                remoteLogsEnabled: updatedSettings.remoteLogsEnabled,
                demoAccounts: updatedSettings.demoAccounts
            }
        });
    } catch (error) {
        console.error('Error updating debug settings:', error);
        res.status(500).json({ message: 'Error updating debug settings', error });
    }
});



app.get('/get/debugSettings', async (req, res) => {
    try {
        const deviceSettings = await DeviceSettings.findOne();

        // If no settings found, return defaults
        const response = {
            demomode: deviceSettings ? deviceSettings.demomode : false,
            useDebugMode: deviceSettings ? deviceSettings.useDebugMode : false,
            remoteLogsEnabled: deviceSettings ? deviceSettings.remoteLogsEnabled : false,
            demoAccounts: deviceSettings ? deviceSettings.demoAccounts : []
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching debug settings:', error);
        res.status(500).json({ message: 'Error fetching debug settings', error });
    }
});

app.post('/update/questionnaire-status', async (req, res) => {
    const { mac_address, pleasure_q, wellness_q } = req.body;

    if (!mac_address) {
        return res.status(400).json({ message: 'mac_address is required.' });
    }

    let updateFields = { updated_at: Date.now() };
    
    if (pleasure_q !== undefined) {
        updateFields.pleasure_q = pleasure_q;
    }
    
    if (wellness_q !== undefined) {
        updateFields.wellness_q = wellness_q;
    }

    if (pleasure_q === undefined && wellness_q === undefined) {
        return res.status(400).json({ 
            message: 'At least one of pleasure_q or wellness_q must be provided.' 
        });
    }

    try {
        const updatedSettings = await DeviceSettings.findOneAndUpdate(
            { mac_address },
            { $set: updateFields },
            { new: true, upsert: true }
        );

        res.status(200).json({
            message: 'Questionnaire status updated successfully',
            data: {
                mac_address,
                pleasure_q: updatedSettings.pleasure_q,
                wellness_q: updatedSettings.wellness_q
            }
        });
    } catch (error) {
        console.error('Error updating questionnaire status:', error);
        res.status(500).json({ message: 'Error updating questionnaire status', error });
    }
});

app.get('/get/questionnaire-status', async (req, res) => {
    const { mac_address } = req.query;

    if (!mac_address) {
        return res.status(400).json({ message: 'mac_address query parameter is required.' });
    }

    try {
        const deviceSettings = await DeviceSettings.findOne({ mac_address });

        if (!deviceSettings) {
            return res.status(404).json({ 
                message: 'No data found for the given MAC address',
                data: { 
                    pleasure_q: false,
                    wellness_q: false 
                }
            });
        }

        res.status(200).json({
            message: 'Questionnaire status retrieved successfully',
            data: { 
                pleasure_q: deviceSettings.pleasure_q,
                wellness_q: deviceSettings.wellness_q 
            }
        });
    } catch (error) {
        console.error('Error fetching questionnaire status:', error);
        res.status(500).json({ message: 'Error fetching questionnaire status', error });
    }
});

app.post('/update/pleasure-questionnaire', async (req, res) => {
    const { mac_address, status } = req.body;

    if (!mac_address || status === undefined) {
        return res.status(400).json({ message: 'mac_address and status are required.' });
    }

    try {
        const updatedSettings = await DeviceSettings.findOneAndUpdate(
            { mac_address },
            { 
                $set: { 
                    pleasure_q: status,
                    updated_at: Date.now() 
                } 
            },
            { new: true, upsert: true }
        );

        res.status(200).json({
            message: 'Pleasure questionnaire status updated successfully',
            data: {
                mac_address,
                pleasure_q: updatedSettings.pleasure_q
            }
        });
    } catch (error) {
        console.error('Error updating pleasure questionnaire status:', error);
        res.status(500).json({ message: 'Error updating pleasure questionnaire status', error });
    }
});

app.post('/update/wellness-questionnaire', async (req, res) => {
    const { mac_address, status } = req.body;

    if (!mac_address || status === undefined) {
        return res.status(400).json({ message: 'mac_address and status are required.' });
    }

    try {
        const updatedSettings = await DeviceSettings.findOneAndUpdate(
            { mac_address },
            { 
                $set: { 
                    wellness_q: status,
                    updated_at: Date.now() 
                } 
            },
            { new: true, upsert: true }
        );

        res.status(200).json({
            message: 'Wellness questionnaire status updated successfully',
            data: {
                mac_address,
                wellness_q: updatedSettings.wellness_q
            }
        });
    } catch (error) {
        console.error('Error updating wellness questionnaire status:', error);
        res.status(500).json({ message: 'Error updating wellness questionnaire status', error });
    }
});


app.post('/update/wififlow_status', async (req, res) => {
    const { mac_address, wififlow } = req.body;

    if (wififlow === undefined || !mac_address) {
        return res.status(400).json({ message: 'mac_address and wififlow are required.' });
    }

    try {
        const updatedSettings = await DeviceSettings.findOneAndUpdate(
            { mac_address },
            { 
                $set: { 
                    wififlow, 
                    updated_at: Date.now() 
                } 
            },
            { new: true, upsert: true }
        );

        res.status(200).json({
            message: 'WiFiFlow status updated successfully',
            data: {
                mac_address,
                wififlow: updatedSettings.wififlow
            }
        });
    } catch (error) {
        console.error('Error updating wififlow status:', error);
        res.status(500).json({ message: 'Error updating wififlow status', error });
    }
});



app.get('/get/wififlow-status', async (req, res) => {
    const { mac_address } = req.query;

    if (!mac_address) {
        return res.status(400).json({ message: 'mac_address query parameter is required.' });
    }

    try {
        const deviceSettings = await DeviceSettings.findOne({ mac_address });

        if (!deviceSettings) {
            return res.status(404).json({ 
                message: 'No data found for the given MAC address',
                data: { wififlow: false }  // Default to false if no record exists
            });
        }

        res.status(200).json({
            message: 'WiFiFlow status retrieved successfully',
            data: { wififlow: deviceSettings.wififlow }
        });
    } catch (error) {
        console.error('Error fetching wififlow status:', error);
        res.status(500).json({ message: 'Error fetching wififlow status', error });
    }
});


app.get('/get/device-survey-status', async (req, res) => {
    const { mac_address } = req.query;

    if (!mac_address) {
        return res.status(400).json({ message: 'mac_address query parameter is required.' });
    }

    try {
        const deviceSettings = await DeviceSettings.findOne({ mac_address });

        if (!deviceSettings) {
            return res.status(404).json({ 
                message: 'No data found for the given MAC address',
                data: { 
                    onboarding_pass: false,
                    pleasure_q: false,
                    wellness_q: false,
                    wififlow: false
                }
            });
        }

        res.status(200).json({
            message: 'Device survey status retrieved successfully',
            data: {
                onboarding_pass: deviceSettings.onboarding_pass || false,
                ProgChoose: deviceSettings.prog_choose ?? null,  // Returns null if not set
                pleasure_q: deviceSettings.pleasure_q || false,
                wellness_q: deviceSettings.wellness_q || false,
                wififlow: deviceSettings.wififlow || false
            }
        });
    } catch (error) {
        console.error('Error fetching device survey status:', error);
        res.status(500).json({ message: 'Error fetching device survey status', error });
    }
});

app.get('/get-favorites', async (req, res) => {
    const { mac_address } = req.query;

    if (!mac_address) {
        return res.status(400).json({ message: 'MAC address is required.' });
    }

    try {
        // Keep the original MAC address format with colons
        const folderPath = `${mac_address}/Favorites/`;

        console.log('Searching in S3 with path:', folderPath);

        const params = {
            Bucket: 'easygbeyondyourbody',
            Prefix: folderPath
        };

        console.log('S3 params:', params);

        const data = await s3.listObjectsV2(params).promise();
        
        console.log('S3 response:', JSON.stringify(data, null, 2));

        // Filter for JSON files and extract just the filenames
        const jsonFiles = data.Contents
            .filter(item => item.Key.endsWith('.json'))
            .map(item => {
                const fullPath = item.Key;
                let filename = fullPath.split('/').pop(); // Get just the filename
                // Remove '@' from the beginning if it exists
                if (filename.startsWith('@')) {
                    filename = filename.substring(1);
                }
                return filename;
            });

        console.log('Found JSON files:', jsonFiles);

        res.status(200).json({
            message: 'Favorites retrieved successfully',
            data: jsonFiles
        });
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ 
            message: 'Error fetching favorites', 
            error: error.message 
        });
    }
});

app.get('/get-favorite-file', async (req, res) => {
    const { mac_address, filename } = req.query;

    if (!mac_address || !filename) {
        return res.status(400).json({ 
            message: 'MAC address and filename are required.' 
        });
    }

    try {
        // Construct the full path to the file
        const filePath = `${mac_address}/Favorites/${filename}`;

        console.log('Fetching file from S3 with path:', filePath);

        const params = {
            Bucket: 'easygbeyondyourbody',
            Key: filePath
        };

        const data = await s3.getObject(params).promise();
        
        // Parse the JSON content
        const jsonContent = JSON.parse(data.Body.toString('utf-8'));

        res.status(200).json({
            message: 'File retrieved successfully',
            data: jsonContent
        });
    } catch (error) {
        console.error('Error fetching file:', error);
        if (error.code === 'NoSuchKey') {
            res.status(404).json({ 
                message: 'File not found',
                error: 'The requested file does not exist in the Favorites folder'
            });
        } else {
            res.status(500).json({ 
                message: 'Error fetching file', 
                error: error.message 
            });
        }
    }
});

// delete favorite file
app.delete('/delete-favorite-file', async (req, res) => {
    const { mac_address, filename } = req.body;

    if (!mac_address || !filename) {
        return res.status(400).json({ 
            message: 'MAC address and filename are required.' 
        });
    }

    try {
        // Construct the full path to the file
        const filePath = `${mac_address}/Favorites/${filename}`;

        console.log('Deleting file from S3 with path:', filePath);

        const params = {
            Bucket: 'easygbeyondyourbody',
            Key: filePath
        };

        await s3.deleteObject(params).promise();

        res.status(200).json({
            message: 'Favorite file deleted successfully',
            deleted_file: filename
        });
    } catch (error) {
        console.error('Error deleting favorite file:', error);
        if (error.code === 'NoSuchKey') {
            res.status(404).json({ 
                message: 'File not found',
                error: 'The requested file does not exist in the Favorites folder'
            });
        } else {
            res.status(500).json({ 
                message: 'Error deleting favorite file', 
                error: error.message 
            });
        }
    }
});

    

// Device Parameters API Endpoints

// API 1: Get device parameters by version (admin endpoint)
app.get('/api/device-parameters/:version', async (req, res) => {
    try {
        const { version } = req.params;
        const parameters = await DeviceParametersVersion.findOne({ version });
        
        if (!parameters) {
            return res.status(404).json({ message: 'Device parameters version not found' });
        }
        
        res.json(parameters.parameters);
    } catch (error) {
        console.error('Error fetching device parameters version:', error);
        res.status(500).json({ message: 'Error fetching device parameters version', error: error.message });
    }
});

// API 1.1: Get device parameters by MAC address (device endpoint)
app.get('/api/device-parameters/device/:mac_address', async (req, res) => {
    try {
        const { mac_address } = req.params;

        // Find the latest version that has this MAC address in pending_devices
        const versionDoc = await DeviceParametersVersion.findOne({
            pending_devices: mac_address
        }).sort({ version: -1 }); // Sort by version in descending order to get the latest

        if (!versionDoc) {
            return res.status(404).json({ 
                message: 'No pending updates found for this device',
                has_update: false
            });
        }

        // Check if device has already received this version
        const alreadyUpdated = versionDoc.updated_devices.some(device => device.mac_address === mac_address);
        if (alreadyUpdated) {
            return res.status(404).json({ 
                message: 'Device has already received this version',
                has_update: false
            });
        }

        // Add to updated list without removing from pending list
        versionDoc.updated_devices.push({
            mac_address,
            updated_at: new Date()
        });
        await versionDoc.save();

        res.json({
            version: versionDoc.version,
            parameters: versionDoc.parameters,
            has_update: true
        });
    } catch (error) {
        console.error('Error fetching device parameters:', error);
        res.status(500).json({ message: 'Error fetching device parameters', error: error.message });
    }
});

// API 2: Update multiple devices with new version
app.post('/api/device-parameters/:version/update-devices', async (req, res) => {
    try {
        const { version } = req.params;
        const { mac_addresses } = req.body;

        if (!mac_addresses || !Array.isArray(mac_addresses)) {
            return res.status(400).json({ message: 'Array of MAC addresses is required' });
        }

        const versionDoc = await DeviceParametersVersion.findOne({ version });
        if (!versionDoc) {
            return res.status(404).json({ message: 'Device parameters version not found' });
        }

        // Add new MAC addresses to pending_devices if they're not already in updated_devices
        const existingUpdatedMacs = new Set(versionDoc.updated_devices.map(d => d.mac_address));
        const newPendingMacs = mac_addresses.filter(mac => !existingUpdatedMacs.has(mac));
        
        versionDoc.pending_devices = [...new Set([...versionDoc.pending_devices, ...newPendingMacs])];
        await versionDoc.save();

        res.json({
            message: 'Devices added to update queue',
            pending_devices: newPendingMacs
        });
    } catch (error) {
        console.error('Error updating devices:', error);
        res.status(500).json({ message: 'Error updating devices', error: error.message });
    }
});

// API 3: Get pending devices for a version
app.get('/api/device-parameters/:version/pending', async (req, res) => {
    try {
        const { version } = req.params;
        const versionDoc = await DeviceParametersVersion.findOne({ version });
        
        if (!versionDoc) {
            return res.status(404).json({ message: 'Device parameters version not found' });
        }

        res.json({
            version,
            pending_devices: versionDoc.pending_devices
        });
    } catch (error) {
        console.error('Error fetching pending devices:', error);
        res.status(500).json({ message: 'Error fetching pending devices', error: error.message });
    }
});

// API 4: Get updated devices for a version
app.get('/api/device-parameters/:version/updated', async (req, res) => {
    try {
        const { version } = req.params;
        const versionDoc = await DeviceParametersVersion.findOne({ version });
        
        if (!versionDoc) {
            return res.status(404).json({ message: 'Device parameters version not found' });
        }

        // Get list of updated MAC addresses
        const updatedMacs = new Set(versionDoc.updated_devices.map(device => device.mac_address));
        
        // Filter pending devices to exclude those that have been updated
        const stillPendingDevices = versionDoc.pending_devices.filter(mac => !updatedMacs.has(mac));

        // Return the list of updated devices with their update timestamps
        const updatedDevices = versionDoc.updated_devices.map(device => ({
            mac_address: device.mac_address,
            updated_at: device.updated_at
        }));

        res.json({
            version,
            total_updated: updatedDevices.length,
            updated_devices: updatedDevices,
            pending_count: stillPendingDevices.length,
            pending_devices: stillPendingDevices
        });
    } catch (error) {
        console.error('Error fetching updated devices:', error);
        res.status(500).json({ message: 'Error fetching updated devices', error: error.message });
    }
});

// Create new version
app.post('/api/device-parameters/:version', async (req, res) => {
    try {
        const { version } = req.params;
        const { parameters } = req.body;

        if (!parameters) {
            return res.status(400).json({ message: 'Parameters are required' });
        }

        // Validate required fields
        const requiredFields = [
            'drop_button_short_press_time',
            'drop_button_long_press_time',
            'heater_ntc_value',
            'heating_boost_times',
            'battery_shutdown_voltage',
            'inactivity_shutdown_time',
            'battery_full_charge_voltage',
            'initial_pump_priming_time',
            'initial_pump_addition_time',
            'capacity_pump_times',
            'over_current_voltage',
            'over_current_time'
        ];

        for (const field of requiredFields) {
            if (parameters[field] === undefined) {
                return res.status(400).json({ message: `Missing required field: ${field}` });
            }
        }

        const versionDoc = await DeviceParametersVersion.findOneAndUpdate(
            { version },
            { 
                $set: { 
                    parameters,
                    updated_at: new Date()
                }
            },
            { new: true, upsert: true }
        );

        res.json(versionDoc);
    } catch (error) {
        console.error('Error creating version:', error);
        res.status(500).json({ message: 'Error creating version', error: error.message });
    }
});

// Server startup with HTTPS support
// Create HTTP server (for development/fallback)
const httpServer = http.createServer(app);

// Create HTTPS server (for production)
let httpsServer = null;

// Check if SSL certificates exist
const sslOptions = {
  key: fs.existsSync('./ssl/private.key') ? fs.readFileSync('./ssl/private.key') : null,
  cert: fs.existsSync('./ssl/certificate.crt') ? fs.readFileSync('./ssl/certificate.crt') : null
};

if (sslOptions.key && sslOptions.cert) {
  httpsServer = https.createServer(sslOptions, app);
  httpsServer.listen(httpsPort, '0.0.0.0', () => {
    console.log(`HTTPS Server running on https://0.0.0.0:${httpsPort}`);
  });
} else {
  console.log('SSL certificates not found. HTTPS server not started.');
  console.log('To enable HTTPS, place your SSL certificates in the ssl/ directory:');
  console.log('- ssl/private.key (private key file)');
  console.log('- ssl/certificate.crt (certificate file)');
}

// Start HTTP server
httpServer.listen(port, '0.0.0.0', () => {
  console.log(`HTTP Server running on http://0.0.0.0:${port}`);
  if (httpsServer) {
    console.log(`HTTPS Server running on https://0.0.0.0:${httpsPort}`);
  }
}); 
