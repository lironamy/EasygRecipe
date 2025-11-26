const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const https = require('https');
const http = require('http');
const { getSuctionIntensity } = require('./SuctionIntensity');
const { getVibrationIntensity } = require('./VibrationIntensity');
const { getSuctionPattern } = require('./SuctionPattern');
const { getVibrationPattern } = require('./VibrationPattern');
const AWS = require('aws-sdk');
require('dotenv').config();

// DynamoDB imports
const { docClient, TABLES } = require('./config/dynamodb');
const {
    createUser,
    findUserByEmail,
    deleteUserByEmail,
    updateUserLastLogin,
    upsertEasyGjson,
    findEasyGjson,
    upsertDeviceSettings,
    findDeviceSettings,
    findOneDeviceSettings,
    upsertDeviceParametersVersion,
    findDeviceParametersVersion,
    updateDeviceParametersVersion,
    addPendingDevices,
    addUpdatedDevice,
    findVersionByPendingMac,
    upsertSystemJson,
    getSystemJson
} = require('./utils/dynamoHelpers');

const app = express();
const port = 4000;
const httpsPort = 4001; // HTTPS port

app.use(cors());
app.use(bodyParser.json());

console.log("DynamoDB client initialized - ready to use");

// Configure AWS to rely on instance metadata / IAM role for credentials
AWS.config.update({
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
        const existingUser = await findUserByEmail(email);

        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await createUser(email, hashedPassword, nickname);

        res.status(201).json({ user_id: newUser.user_id, nickname: newUser.nickname });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ 
            message: 'Error during signup', 
            error: error.message || 'Unknown error occurred' 
        });
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
        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(404).json({ user_id: null, nickname: null, status: 'user_not_exists' });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ user_id: user.user_id, nickname: user.nickname, status: 'pass_incorrect' });
        }

        // Update last login timestamp
        await updateUserLastLogin(email);

        // Successful login
        res.status(200).json({ user_id: user.user_id, nickname: user.nickname, status: 'user_exists' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Error during login', error });
    }
});

app.delete('/delete-user', async (req, res) => {
    const { email, mac_address } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    if (!mac_address) {
        return res.status(400).json({ message: 'MAC address is required.' });
    }

    try {
        // Normalize email
        const normalizedEmail = email.toLowerCase();

        // Find user by email
        const user = await findUserByEmail(normalizedEmail);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Delete all S3 records for the MAC address
        console.log(`Deleting S3 folder for MAC address: ${mac_address}`);
        
        // List all objects in the MAC address folder
        const listParams = {
            Bucket: 'easygbeyondyourbody',
            Prefix: `${mac_address}/`
        };

        const listedObjects = await s3.listObjectsV2(listParams).promise();

        if (listedObjects.Contents.length === 0) {
            console.log(`No S3 objects found for MAC address: ${mac_address}`);
        } else {
            console.log(`Found ${listedObjects.Contents.length} S3 objects to delete for MAC address: ${mac_address}`);
            
            // Prepare delete parameters
            const deleteParams = {
                Bucket: 'easygbeyondyourbody',
                Delete: {
                    Objects: listedObjects.Contents.map(({ Key }) => ({ Key }))
                }
            };

            // Delete all objects in the folder
            const deleteResult = await s3.deleteObjects(deleteParams).promise();
            console.log(`Successfully deleted ${deleteResult.Deleted.length} S3 objects for MAC address: ${mac_address}`);
            
            // Check if there are any errors in the deletion
            if (deleteResult.Errors && deleteResult.Errors.length > 0) {
                console.error('Some objects failed to delete:', deleteResult.Errors);
                throw new Error(`Failed to delete ${deleteResult.Errors.length} S3 objects`);
            }
        }

        // Delete user from database
        await deleteUserByEmail(normalizedEmail);

        res.status(200).json({ message: 'User and associated S3 data deleted successfully.' });
    } catch (error) {
        console.error('Error deleting user:', error);
        
        // Check if it's an AWS credentials error
        if (error.code === 'InvalidAccessKeyId' || error.code === 'SignatureDoesNotMatch' || error.code === 'InvalidUserID.NotFound') {
            return res.status(500).json({ 
                message: 'AWS credentials error - cannot delete S3 data', 
                error: 'Invalid AWS credentials. Please check your AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.',
                details: error.message
            });
        }
        
        // Check if it's an S3-specific error
        if (error.code && error.code.startsWith('NoSuch')) {
            return res.status(500).json({ 
                message: 'S3 error during deletion', 
                error: 'Failed to access S3 bucket or objects',
                details: error.message
            });
        }
        
        res.status(500).json({ message: 'Error deleting user', error: error.message });
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

// Configuration for ML and AI JSON storage endpoints
const SYSTEM_JSON_CONFIG = {
    ml: [
        { path: 'profile', storageKey: 'ML_PROFILE' },
        { path: 'dataset', storageKey: 'ML_DATASET' },
        { path: 'training', storageKey: 'ML_TRAINING' },
        { path: 'inference', storageKey: 'ML_INFERENCE' }
    ],
    ai: [
        { path: 'profile', storageKey: 'AI_PROFILE' },
        { path: 'dataset', storageKey: 'AI_DATASET' },
        { path: 'training', storageKey: 'AI_TRAINING' },
        { path: 'inference', storageKey: 'AI_INFERENCE' }
    ]
};

function registerJsonEndpoints(systemKey, configArray) {
    configArray.forEach(({ path, storageKey }) => {
        const routePath = `/${systemKey}/${path}`;

        app.post(routePath, async (req, res) => {
            const payload = req.body;

            if (payload === undefined || payload === null) {
                return res.status(400).json({
                    message: 'Request body must include a JSON payload.'
                });
            }

            try {
                await upsertSystemJson(storageKey, payload);
                res.status(200).json(payload);
            } catch (error) {
                console.error(`Error saving payload for ${routePath}:`, error);
                res.status(500).json({
                    message: 'Failed to save JSON payload.',
                    error: error.message
                });
            }
        });

        app.get(routePath, async (_req, res) => {
            try {
                const payload = await getSystemJson(storageKey);

                if (payload === null || typeof payload === 'undefined') {
                    return res.status(404).json({
                        message: 'No JSON stored for this endpoint.'
                    });
                }

                res.status(200).json(payload);
            } catch (error) {
                console.error(`Error retrieving payload for ${routePath}:`, error);
                res.status(500).json({
                    message: 'Failed to retrieve JSON payload.',
                    error: error.message
                });
            }
        });
    });
}

registerJsonEndpoints('ml', SYSTEM_JSON_CONFIG.ml);
registerJsonEndpoints('ai', SYSTEM_JSON_CONFIG.ai);

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
        const updatedGjson = await upsertEasyGjson(mac_address, processedDataArray);

        res.status(200).json({ message: 'Answers received and JSON saved successfully', mac_address, data: updatedGjson });
    } catch (error) {
        console.error('Error processing or saving answers:', error);
        res.status(500).json({ message: 'Error processing or saving answers', error });
    }
});


app.get('/download', async (req, res) => {
    const { mac_address } = req.query;

    if (!mac_address) {
        return res.status(400).json({ message: 'mac_address query parameter is required.' });
    }

    try {
        const easyGjsonData = await findEasyGjson(mac_address);

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
        const easyGjsonData = await findEasyGjson(mac_address);

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
        const updatedSettings = await upsertDeviceSettings(mac_address, { onboarding_pass });

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
        const updatedSettings = await upsertDeviceSettings(mac_address, { prog_choose: normalizedProgChoice });

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

app.get('/get/onboardingsprocess', async (req, res) => {
    const { mac_address } = req.query;

    if (!mac_address) {
        return res.status(400).json({ message: 'mac_address query parameter is required.' });
    }

    try {
        const deviceSettings = await findDeviceSettings(mac_address);

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

app.get('/get/progtype', async (req, res) => {
    const { mac_address } = req.query;

    if (!mac_address) {
        return res.status(400).json({ message: 'mac_address query parameter is required.' });
    }

    try {
        const deviceSettings = await findDeviceSettings(mac_address);

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
        const updatedSettings = await upsertDeviceSettings(mac_address, { demomode });

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
        const updatedSettings = await upsertDeviceSettings(mac_address, { useDebugMode });

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
        const updatedSettings = await upsertDeviceSettings(mac_address, { remoteLogsEnabled });

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
        const deviceSettings = await findDeviceSettings(mac_address);

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
        const deviceSettings = await findDeviceSettings(mac_address);

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
        const deviceSettings = await findDeviceSettings(mac_address);

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
        // Remove updated_at from updateFields for the helper function
        const { updated_at, ...fieldsToUpdate } = updateFields;

        // Get first device or create with a default mac_address
        let deviceSettings = await findOneDeviceSettings();
        const mac_address = deviceSettings ? deviceSettings.mac_address : 'global_settings';

        const updatedSettings = await upsertDeviceSettings(mac_address, fieldsToUpdate);

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
        const deviceSettings = await findOneDeviceSettings();

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
        const { updated_at, ...fieldsToUpdate } = updateFields;
        const updatedSettings = await upsertDeviceSettings(mac_address, fieldsToUpdate);

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
        const deviceSettings = await findDeviceSettings(mac_address);

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
        const updatedSettings = await upsertDeviceSettings(mac_address, { pleasure_q: status });

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
        const updatedSettings = await upsertDeviceSettings(mac_address, { wellness_q: status });

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
        const updatedSettings = await upsertDeviceSettings(mac_address, { wififlow });

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
        const deviceSettings = await findDeviceSettings(mac_address);

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
        const deviceSettings = await findDeviceSettings(mac_address);

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
                // Remove '.json' from the end if it exists
                if (filename.endsWith('.json')) {
                    filename = filename.slice(0, -5);
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
        // Normalize the filename by removing any existing prefixes/extensions
        let baseFilename = filename;
        if (baseFilename.startsWith('@')) {
            baseFilename = baseFilename.substring(1);
        }
        if (baseFilename.endsWith('.json')) {
            baseFilename = baseFilename.slice(0, -5);
        }

        // Try different filename formats in order of preference
        const possibleFilenames = [
            `@${baseFilename}.json`,  // With @ prefix (expected format)
            `${baseFilename}.json`,   // Without @ prefix (fallback)
        ];

        let data;
        let actualFilePath;
        let foundFile = false;

        for (const tryFilename of possibleFilenames) {
            const filePath = `${mac_address}/Favorites/${tryFilename}`;
            console.log('Trying to fetch file from S3 with path:', filePath);

            const params = {
                Bucket: 'easygbeyondyourbody',
                Key: filePath
            };

            try {
                data = await s3.getObject(params).promise();
                actualFilePath = filePath;
                foundFile = true;
                console.log('Successfully found file at:', filePath);
                break;
            } catch (error) {
                if (error.code === 'NoSuchKey') {
                    console.log('File not found at:', filePath);
                    continue; // Try next filename format
                } else {
                    throw error; // Re-throw unexpected errors
                }
            }
        }

        if (!foundFile) {
            throw new Error('NoSuchKey'); // Will be caught by outer catch block
        }
        
        // Get the raw content as string
        const rawContent = data.Body.toString('utf-8');
        console.log('Raw file content:', rawContent);
        console.log('Raw content length:', rawContent.length);
        console.log('First 100 characters:', rawContent.substring(0, 100));

        // Parse the JSON content - handle different JSON formats
        let jsonContent;
        try {
            // First, try to parse the entire content as a single JSON
            jsonContent = JSON.parse(rawContent);
            console.log('Successfully parsed as single JSON');
        } catch (parseError) {
            console.log('Failed to parse as single JSON, trying line-by-line parsing');
            
            // If that fails, try line-by-line parsing
            try {
                // Split content by lines and filter out empty lines
                const lines = rawContent.split('\n').filter(line => line.trim() !== '');
                
                jsonContent = [];
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim();
                    
                    // Skip lines that are just numbers or non-JSON content
                    if (line && (line.startsWith('[') || line.startsWith('{'))) {
                        try {
                            const parsedLine = JSON.parse(line);
                            if (Array.isArray(parsedLine)) {
                                jsonContent.push(...parsedLine);
                            } else {
                                jsonContent.push(parsedLine);
                            }
                        } catch (lineError) {
                            console.error(`Error parsing line ${i + 1}:`, lineError.message);
                            console.error(`Line content:`, line);
                            // Continue parsing other lines, don't fail completely
                        }
                    }
                }
            } catch (finalParseError) {
                console.error('JSON Parse Error:', finalParseError.message);
                console.error('Content that failed to parse:', rawContent.substring(0, 500));
                return res.status(400).json({
                    message: 'Invalid JSON format in file',
                    error: finalParseError.message,
                    rawContent: rawContent.substring(0, 200) // Show first 200 chars for debugging
                });
            }
        }

        // Flatten the structure to match pleasure.json format
        let flattenedData = [];
        
        if (Array.isArray(jsonContent)) {
            // Handle nested array structure - flatten all sub-arrays
            for (const item of jsonContent) {
                if (Array.isArray(item)) {
                    // This is a sub-array, add all its elements
                    flattenedData.push(...item);
                } else {
                    // This is a single object, add it directly
                    flattenedData.push(item);
                }
            }
        } else {
            // Single object case
            flattenedData = [jsonContent];
        }

        // Separate metadata and pattern blocks
        let metadataBlock = null;
        let patternBlocks = [];

        for (const block of flattenedData) {
            if (block && typeof block === 'object') {
                // Check if this is a metadata block (has keys 3, 8, 9 but NOT 4, 5, 6, 7)
                const hasMetadataKeys = block.hasOwnProperty('3') || block.hasOwnProperty('8') || block.hasOwnProperty('9');
                const hasPatternKeys = block.hasOwnProperty('4') || block.hasOwnProperty('5') || 
                                     block.hasOwnProperty('6') || block.hasOwnProperty('7');
                
                if (hasMetadataKeys && !hasPatternKeys) {
                    // This is purely a metadata block
                    if (!metadataBlock) {
                        metadataBlock = {
                            '3': block['3'] || 0,
                            '8': block['8'] || 0,
                            '9': block['9'] || 0
                        };
                    }
                } else if (hasPatternKeys) {
                    // This is a pattern block (may also have metadata keys, but pattern takes precedence)
                    patternBlocks.push({
                        '4': block['4'] || 0,
                        '5': block['5'] || 0,
                        '6': block['6'] || 0,
                        '7': block['7'] || 0
                    });
                }
            }
        }

        // If no metadata block found, create a default one
        if (!metadataBlock) {
            metadataBlock = {
                '3': 0,
                '8': 0,
                '9': 0
            };
        }

        // Combine metadata and pattern blocks in the correct format
        const formattedData = [metadataBlock, ...patternBlocks];

        res.status(200).json({
            message: 'File retrieved successfully',
            data: formattedData
        });
    } catch (error) {
        console.error('Error fetching file:', error);
        if (error.code === 'NoSuchKey' || error.message === 'NoSuchKey') {
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

app.delete('/delete-favorite-file', async (req, res) => {
    const { mac_address, filename } = req.body;

    if (!mac_address || !filename) {
        return res.status(400).json({ 
            message: 'MAC address and filename are required.' 
        });
    }

    try {
        // Ensure filename starts with "@" and ends with ".json"
        let normalizedFilename = filename.startsWith('@') ? filename : `@${filename}`;
        if (!normalizedFilename.endsWith('.json')) {
            normalizedFilename = `${normalizedFilename}.json`;
        }
        const filePath = `${mac_address}/Favorites/${normalizedFilename}`;

        console.log('Checking if file exists in S3 with path:', filePath);

        const params = {
            Bucket: 'easygbeyondyourbody',
            Key: filePath
        };

        // Check if file exists
        try {
            await s3.headObject(params).promise();
        } catch (error) {
            if (error.code === 'NotFound' || error.code === 'NoSuchKey') {
                return res.status(404).json({
                    message: 'File not found',
                    error: 'The requested file does not exist in the Favorites folder'
                });
            }
            throw error; // Re-throw other errors
        }

        // If we get here, the file exists - now delete it
        await s3.deleteObject(params).promise();
        console.log('File deleted successfully:', filePath);

        res.status(200).json({
            message: 'Favorite file deleted successfully',
            deleted_file: normalizedFilename
        });
    } catch (error) {
        console.error('Error deleting favorite file:', error);
        res.status(500).json({ 
            message: 'Error deleting favorite file', 
            error: error.message 
        });
    }
});

app.post('/change-favorite-file-name', async (req, res) => {
    const { mac_address, old_filename, new_filename } = req.body;

    if (!mac_address || !old_filename || !new_filename) {
        return res.status(400).json({ 
            message: 'MAC address, old filename, and new filename are required.' 
        });
    }

    try {
        // Normalize old and new filenames to ensure they start with '@' and end with '.json'
        let normalizedOldFilename = old_filename.startsWith('@') ? old_filename : `@${old_filename}`;
        if (!normalizedOldFilename.endsWith('.json')) {
            normalizedOldFilename = `${normalizedOldFilename}.json`;
        }
        let normalizedNewFilename = new_filename.startsWith('@') ? new_filename : `@${new_filename}`;
        if (!normalizedNewFilename.endsWith('.json')) {
            normalizedNewFilename = `${normalizedNewFilename}.json`;
        }
        const oldFilePath = `${mac_address}/Favorites/${normalizedOldFilename}`;
        const newFilePath = `${mac_address}/Favorites/${normalizedNewFilename}`;

        console.log('Checking if old file exists in S3 with path:', oldFilePath);

        let fileContent = null;

        // Check if the old file exists
        try {
            const getParams = {
                Bucket: 'easygbeyondyourbody',
                Key: oldFilePath
            };
            fileContent = await s3.getObject(getParams).promise();
            console.log('Old file found');
        } catch (error) {
            if (error.code === 'NoSuchKey' || error.code === 'NotFound') {
                return res.status(404).json({
                    message: 'Old file not found',
                    error: 'The file you want to rename does not exist in the Favorites folder'
                });
            }
            throw error;
        }

        // Check if new filename already exists
        try {
            const checkNewParams = {
                Bucket: 'easygbeyondyourbody',
                Key: newFilePath
            };
            await s3.headObject(checkNewParams).promise();
            return res.status(409).json({
                message: 'File already exists',
                error: 'A file with the new filename already exists'
            });
        } catch (error) {
            if (error.code !== 'NotFound' && error.code !== 'NoSuchKey') {
                throw error;
            }
            // File doesn't exist, which is what we want
        }

        // Copy the file to the new location
        const copyParams = {
            Bucket: 'easygbeyondyourbody',
            CopySource: `easygbeyondyourbody/${oldFilePath}`,
            Key: newFilePath
        };
        await s3.copyObject(copyParams).promise();
        console.log('File copied to new location:', newFilePath);

        // Delete the old file
        const deleteParams = {
            Bucket: 'easygbeyondyourbody',
            Key: oldFilePath
        };
        await s3.deleteObject(deleteParams).promise();
        console.log('Old file deleted:', oldFilePath);

        res.status(200).json({
            message: 'Favorite file renamed successfully',
            old_filename: normalizedOldFilename,
            new_filename: normalizedNewFilename
        });
    } catch (error) {
        console.error('Error renaming favorite file:', error);
        res.status(500).json({ 
            message: 'Error renaming favorite file', 
            error: error.message 
        });
    }
});

app.post('/save-ai-recipe', async (req, res) => {
    const { mac_address, filename, recipe_data } = req.body;

    if (!mac_address || !filename || !recipe_data) {
        return res.status(400).json({ 
            message: 'MAC address, filename, and recipe_data are required.' 
        });
    }

    try {
        // Ensure filename ends with .json
        let finalFilename = filename.endsWith('.json') ? filename : `${filename}.json`;
        
        // Construct the full path to the file in AI folder
        const filePath = `${mac_address}/AI/${finalFilename}`;

        console.log('Saving AI recipe to S3 with path:', filePath);

        const now = new Date().toISOString();
        const params = {
            Bucket: 'easygbeyondyourbody',
            Key: filePath,
            Body: JSON.stringify(recipe_data, null, 2),
            ContentType: 'application/json',
            Metadata: {
                'created_at': now,
                'updated_at': now
            }
        };

        await s3.upload(params).promise();
        console.log('AI recipe saved successfully:', filePath);

        res.status(200).json({
            message: 'AI recipe saved successfully',
            filename: finalFilename,
            path: filePath
        });
    } catch (error) {
        console.error('Error saving AI recipe:', error);
        res.status(500).json({ 
            message: 'Error saving AI recipe', 
            error: error.message 
        });
    }
});

app.get('/get-ai-recipes', async (req, res) => {
    const { mac_address } = req.query;

    if (!mac_address) {
        return res.status(400).json({ message: 'MAC address is required.' });
    }

    try {
        const folderPath = `${mac_address}/AI/`;

        console.log('Searching for AI recipes in S3 with path:', folderPath);

        const params = {
            Bucket: 'easygbeyondyourbody',
            Prefix: folderPath
        };

        const data = await s3.listObjectsV2(params).promise();

        // Filter for JSON files and extract just the filenames
        const jsonFiles = data.Contents
            .filter(item => item.Key.endsWith('.json'))
            .map(item => {
                const fullPath = item.Key;
                let filename = fullPath.split('/').pop(); // Get just the filename
                // Remove '.json' from the end
                if (filename.endsWith('.json')) {
                    filename = filename.slice(0, -5);
                }
                return filename;
            });

        console.log('Found AI recipe files:', jsonFiles);

        res.status(200).json({
            message: 'AI recipes retrieved successfully',
            data: jsonFiles
        });
    } catch (error) {
        console.error('Error fetching AI recipes:', error);
        res.status(500).json({ 
            message: 'Error fetching AI recipes', 
            error: error.message 
        });
    }
});

app.get('/get-ai-recipe-file', async (req, res) => {
    const { mac_address, filename } = req.query;

    if (!mac_address || !filename) {
        return res.status(400).json({ 
            message: 'MAC address and filename are required.' 
        });
    }

    try {
        // Normalize the filename
        let baseFilename = filename;
        if (baseFilename.endsWith('.json')) {
            baseFilename = baseFilename.slice(0, -5);
        }

        const finalFilename = `${baseFilename}.json`;
        const filePath = `${mac_address}/AI/${finalFilename}`;

        console.log('Fetching AI recipe from S3 with path:', filePath);

        const params = {
            Bucket: 'easygbeyondyourbody',
            Key: filePath
        };

        const data = await s3.getObject(params).promise();
        
        // Get the raw content as string
        const rawContent = data.Body.toString('utf-8');
        console.log('AI recipe raw content length:', rawContent.length);

        // Parse the JSON content
        let jsonContent;
        try {
            jsonContent = JSON.parse(rawContent);
            console.log('Successfully parsed AI recipe as JSON');
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError.message);
            return res.status(400).json({
                message: 'Invalid JSON format in file',
                error: parseError.message
            });
        }

        // Process the content similar to favorites
        let flattenedData = [];
        
        if (Array.isArray(jsonContent)) {
            for (const item of jsonContent) {
                if (Array.isArray(item)) {
                    flattenedData.push(...item);
                } else {
                    flattenedData.push(item);
                }
            }
        } else {
            flattenedData = [jsonContent];
        }

        // Separate metadata and pattern blocks
        let metadataBlock = null;
        let patternBlocks = [];

        for (const block of flattenedData) {
            if (block && typeof block === 'object') {
                const hasMetadataKeys = block.hasOwnProperty('3') || block.hasOwnProperty('8') || block.hasOwnProperty('9');
                const hasPatternKeys = block.hasOwnProperty('4') || block.hasOwnProperty('5') || 
                                     block.hasOwnProperty('6') || block.hasOwnProperty('7');
                
                if (hasMetadataKeys && !hasPatternKeys) {
                    if (!metadataBlock) {
                        metadataBlock = {
                            '3': block['3'] || 0,
                            '8': block['8'] || 0,
                            '9': block['9'] || 0
                        };
                    }
                } else if (hasPatternKeys) {
                    patternBlocks.push({
                        '4': block['4'] || 0,
                        '5': block['5'] || 0,
                        '6': block['6'] || 0,
                        '7': block['7'] || 0
                    });
                }
            }
        }

        // If no metadata block found, create a default one
        if (!metadataBlock) {
            metadataBlock = {
                '3': 0,
                '8': 0,
                '9': 0
            };
        }

        // Combine metadata and pattern blocks in the correct format
        const formattedData = [metadataBlock, ...patternBlocks];

        res.status(200).json({
            message: 'AI recipe retrieved successfully',
            data: formattedData
        });
    } catch (error) {
        console.error('Error fetching AI recipe:', error);
        if (error.code === 'NoSuchKey') {
            res.status(404).json({ 
                message: 'AI recipe not found',
                error: 'The requested file does not exist in the AI folder'
            });
        } else {
            res.status(500).json({ 
                message: 'Error fetching AI recipe', 
                error: error.message 
            });
        }
    }
});

app.delete('/delete-ai-recipe', async (req, res) => {
    const { mac_address, filename } = req.body;

    if (!mac_address || !filename) {
        return res.status(400).json({ 
            message: 'MAC address and filename are required.' 
        });
    }

    try {
        // Ensure filename ends with .json
        let finalFilename = filename.endsWith('.json') ? filename : `${filename}.json`;
        const filePath = `${mac_address}/AI/${finalFilename}`;

        console.log('Checking if AI recipe exists in S3 with path:', filePath);

        const params = {
            Bucket: 'easygbeyondyourbody',
            Key: filePath
        };

        // Check if file exists
        try {
            await s3.headObject(params).promise();
        } catch (error) {
            if (error.code === 'NotFound' || error.code === 'NoSuchKey') {
                return res.status(404).json({
                    message: 'AI recipe not found',
                    error: 'The requested file does not exist in the AI folder'
                });
            }
            throw error;
        }

        // Delete the file
        await s3.deleteObject(params).promise();
        console.log('AI recipe deleted successfully:', filePath);

        res.status(200).json({
            message: 'AI recipe deleted successfully',
            deleted_file: finalFilename
        });
    } catch (error) {
        console.error('Error deleting AI recipe:', error);
        res.status(500).json({ 
            message: 'Error deleting AI recipe', 
            error: error.message 
        });
    }
});

app.post('/save-ml-recipe', async (req, res) => {
    const { mac_address, filename, recipe_data } = req.body;

    if (!mac_address || !filename || !recipe_data) {
        return res.status(400).json({ 
            message: 'MAC address, filename, and recipe_data are required.' 
        });
    }

    try {
        // Ensure filename ends with .json
        let finalFilename = filename.endsWith('.json') ? filename : `${filename}.json`;
        
        // Construct the full path to the file in ML folder
        const filePath = `${mac_address}/ML/${finalFilename}`;

        console.log('Saving ML recipe to S3 with path:', filePath);

        const now = new Date().toISOString();
        const params = {
            Bucket: 'easygbeyondyourbody',
            Key: filePath,
            Body: JSON.stringify(recipe_data, null, 2),
            ContentType: 'application/json',
            Metadata: {
                'created_at': now,
                'updated_at': now
            }
        };

        await s3.upload(params).promise();
        console.log('ML recipe saved successfully:', filePath);

        res.status(200).json({
            message: 'ML recipe saved successfully',
            filename: finalFilename,
            path: filePath
        });
    } catch (error) {
        console.error('Error saving ML recipe:', error);
        res.status(500).json({ 
            message: 'Error saving ML recipe', 
            error: error.message 
        });
    }
});

app.get('/get-ml-recipes', async (req, res) => {
    const { mac_address } = req.query;

    if (!mac_address) {
        return res.status(400).json({ message: 'MAC address is required.' });
    }

    try {
        const folderPath = `${mac_address}/ML/`;

        console.log('Searching for ML recipes in S3 with path:', folderPath);

        const params = {
            Bucket: 'easygbeyondyourbody',
            Prefix: folderPath
        };

        const data = await s3.listObjectsV2(params).promise();

        // Filter for JSON files and extract just the filenames
        const jsonFiles = data.Contents
            .filter(item => item.Key.endsWith('.json'))
            .map(item => {
                const fullPath = item.Key;
                let filename = fullPath.split('/').pop(); // Get just the filename
                // Remove '.json' from the end
                if (filename.endsWith('.json')) {
                    filename = filename.slice(0, -5);
                }
                return filename;
            });

        console.log('Found ML recipe files:', jsonFiles);

        res.status(200).json({
            message: 'ML recipes retrieved successfully',
            data: jsonFiles
        });
    } catch (error) {
        console.error('Error fetching ML recipes:', error);
        res.status(500).json({ 
            message: 'Error fetching ML recipes', 
            error: error.message 
        });
    }
});

app.get('/get-ml-recipe-file', async (req, res) => {
    const { mac_address, filename } = req.query;

    if (!mac_address || !filename) {
        return res.status(400).json({ 
            message: 'MAC address and filename are required.' 
        });
    }

    try {
        // Normalize the filename
        let baseFilename = filename;
        if (baseFilename.endsWith('.json')) {
            baseFilename = baseFilename.slice(0, -5);
        }

        const finalFilename = `${baseFilename}.json`;
        const filePath = `${mac_address}/ML/${finalFilename}`;

        console.log('Fetching ML recipe from S3 with path:', filePath);

        const params = {
            Bucket: 'easygbeyondyourbody',
            Key: filePath
        };

        const data = await s3.getObject(params).promise();
        
        // Get the raw content as string
        const rawContent = data.Body.toString('utf-8');
        console.log('ML recipe raw content length:', rawContent.length);

        // Parse the JSON content
        let jsonContent;
        try {
            jsonContent = JSON.parse(rawContent);
            console.log('Successfully parsed ML recipe as JSON');
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError.message);
            return res.status(400).json({
                message: 'Invalid JSON format in file',
                error: parseError.message
            });
        }

        // Process the content similar to favorites
        let flattenedData = [];
        
        if (Array.isArray(jsonContent)) {
            for (const item of jsonContent) {
                if (Array.isArray(item)) {
                    flattenedData.push(...item);
                } else {
                    flattenedData.push(item);
                }
            }
        } else {
            flattenedData = [jsonContent];
        }

        // Separate metadata and pattern blocks
        let metadataBlock = null;
        let patternBlocks = [];

        for (const block of flattenedData) {
            if (block && typeof block === 'object') {
                const hasMetadataKeys = block.hasOwnProperty('3') || block.hasOwnProperty('8') || block.hasOwnProperty('9');
                const hasPatternKeys = block.hasOwnProperty('4') || block.hasOwnProperty('5') || 
                                     block.hasOwnProperty('6') || block.hasOwnProperty('7');
                
                if (hasMetadataKeys && !hasPatternKeys) {
                    if (!metadataBlock) {
                        metadataBlock = {
                            '3': block['3'] || 0,
                            '8': block['8'] || 0,
                            '9': block['9'] || 0
                        };
                    }
                } else if (hasPatternKeys) {
                    patternBlocks.push({
                        '4': block['4'] || 0,
                        '5': block['5'] || 0,
                        '6': block['6'] || 0,
                        '7': block['7'] || 0
                    });
                }
            }
        }

        // If no metadata block found, create a default one
        if (!metadataBlock) {
            metadataBlock = {
                '3': 0,
                '8': 0,
                '9': 0
            };
        }

        // Combine metadata and pattern blocks in the correct format
        const formattedData = [metadataBlock, ...patternBlocks];

        res.status(200).json({
            message: 'ML recipe retrieved successfully',
            data: formattedData
        });
    } catch (error) {
        console.error('Error fetching ML recipe:', error);
        if (error.code === 'NoSuchKey') {
            res.status(404).json({ 
                message: 'ML recipe not found',
                error: 'The requested file does not exist in the ML folder'
            });
        } else {
            res.status(500).json({ 
                message: 'Error fetching ML recipe', 
                error: error.message 
            });
        }
    }
});

app.delete('/delete-ml-recipe', async (req, res) => {
    const { mac_address, filename } = req.body;

    if (!mac_address || !filename) {
        return res.status(400).json({ 
            message: 'MAC address and filename are required.' 
        });
    }

    try {
        // Ensure filename ends with .json
        let finalFilename = filename.endsWith('.json') ? filename : `${filename}.json`;
        const filePath = `${mac_address}/ML/${finalFilename}`;

        console.log('Checking if ML recipe exists in S3 with path:', filePath);

        const params = {
            Bucket: 'easygbeyondyourbody',
            Key: filePath
        };

        // Check if file exists
        try {
            await s3.headObject(params).promise();
        } catch (error) {
            if (error.code === 'NotFound' || error.code === 'NoSuchKey') {
                return res.status(404).json({
                    message: 'ML recipe not found',
                    error: 'The requested file does not exist in the ML folder'
                });
            }
            throw error;
        }

        // Delete the file
        await s3.deleteObject(params).promise();
        console.log('ML recipe deleted successfully:', filePath);

        res.status(200).json({
            message: 'ML recipe deleted successfully',
            deleted_file: finalFilename
        });
    } catch (error) {
        console.error('Error deleting ML recipe:', error);
        res.status(500).json({ 
            message: 'Error deleting ML recipe', 
            error: error.message 
        });
    }
});

app.get('/api/device-parameters/:version', async (req, res) => {
    try {
        const { version } = req.params;
        const parameters = await findDeviceParametersVersion(version);

        if (!parameters) {
            return res.status(404).json({ message: 'Device parameters version not found' });
        }

        res.json(parameters.parameters);
    } catch (error) {
        console.error('Error fetching device parameters version:', error);
        res.status(500).json({ message: 'Error fetching device parameters version', error: error.message });
    }
});

app.get('/api/device-parameters/device/:mac_address', async (req, res) => {
    try {
        const { mac_address } = req.params;

        // Find the latest version that has this MAC address in pending_devices
        const versionDoc = await findVersionByPendingMac(mac_address);

        if (!versionDoc) {
            return res.status(404).json({
                message: 'No pending updates found for this device',
                has_update: false
            });
        }

        // Check if device has already received this version
        const alreadyUpdated = (versionDoc.updated_devices || []).some(device => device.mac_address === mac_address);
        if (alreadyUpdated) {
            return res.status(404).json({
                message: 'Device has already received this version',
                has_update: false
            });
        }

        // Add to updated list without removing from pending list
        const updatedVersion = await addUpdatedDevice(versionDoc.version, mac_address);

        res.json({
            version: updatedVersion.version,
            parameters: updatedVersion.parameters,
            has_update: true
        });
    } catch (error) {
        console.error('Error fetching device parameters:', error);
        res.status(500).json({ message: 'Error fetching device parameters', error: error.message });
    }
});

app.post('/api/device-parameters/:version/update-devices', async (req, res) => {
    try {
        const { version } = req.params;
        const { mac_addresses } = req.body;

        if (!mac_addresses || !Array.isArray(mac_addresses)) {
            return res.status(400).json({ message: 'Array of MAC addresses is required' });
        }

        const versionDoc = await findDeviceParametersVersion(version);
        if (!versionDoc) {
            return res.status(404).json({ message: 'Device parameters version not found' });
        }

        // Add new MAC addresses to pending_devices
        const updatedVersion = await addPendingDevices(version, mac_addresses);

        // Get the newly added devices
        const existingUpdatedMacs = new Set((versionDoc.updated_devices || []).map(d => d.mac_address));
        const newPendingMacs = mac_addresses.filter(mac => !existingUpdatedMacs.has(mac));

        res.json({
            message: 'Devices added to update queue',
            pending_devices: newPendingMacs
        });
    } catch (error) {
        console.error('Error updating devices:', error);
        res.status(500).json({ message: 'Error updating devices', error: error.message });
    }
});

app.get('/api/device-parameters/:version/pending', async (req, res) => {
    try {
        const { version } = req.params;
        const versionDoc = await findDeviceParametersVersion(version);

        if (!versionDoc) {
            return res.status(404).json({ message: 'Device parameters version not found' });
        }

        res.json({
            version,
            pending_devices: versionDoc.pending_devices || []
        });
    } catch (error) {
        console.error('Error fetching pending devices:', error);
        res.status(500).json({ message: 'Error fetching pending devices', error: error.message });
    }
});

app.get('/api/device-parameters/:version/updated', async (req, res) => {
    try {
        const { version } = req.params;
        const versionDoc = await findDeviceParametersVersion(version);

        if (!versionDoc) {
            return res.status(404).json({ message: 'Device parameters version not found' });
        }

        // Get list of updated MAC addresses
        const updatedMacs = new Set((versionDoc.updated_devices || []).map(device => device.mac_address));

        // Filter pending devices to exclude those that have been updated
        const stillPendingDevices = (versionDoc.pending_devices || []).filter(mac => !updatedMacs.has(mac));

        // Return the list of updated devices with their update timestamps
        const updatedDevices = (versionDoc.updated_devices || []).map(device => ({
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

        // Check if version exists
        const existingVersion = await findDeviceParametersVersion(version);

        let versionDoc;
        if (existingVersion) {
            // Update existing version
            versionDoc = await updateDeviceParametersVersion(version, { parameters });
        } else {
            // Create new version
            versionDoc = await upsertDeviceParametersVersion(version, parameters);
        }

        res.json(versionDoc);
    } catch (error) {
        console.error('Error creating version:', error);
        res.status(500).json({ message: 'Error creating version', error: error.message });
    }
});

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