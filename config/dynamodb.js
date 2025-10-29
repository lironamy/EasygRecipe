const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
require('dotenv').config();

// Create DynamoDB client
const client = new DynamoDBClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// Create DynamoDB Document client (simpler API)
const docClient = DynamoDBDocumentClient.from(client);

// Table names
const TABLES = {
    USERS: 'Users',
    EASYGJSON: 'EasyGjson',
    DEVICE_SETTINGS: 'DeviceSettings',
    COUNTER: 'Counters',
    DEVICE_PARAMETERS_VERSION: 'DeviceParametersVersion'
};

module.exports = {
    docClient,
    TABLES
};
