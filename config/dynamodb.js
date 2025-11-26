const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { fromNodeProviderChain } = require('@aws-sdk/credential-providers');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
require('dotenv').config();

// Create DynamoDB client. Credentials are intentionally omitted so the default
// provider chain (including EC2 instance metadata) is used.
const client = new DynamoDBClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: fromNodeProviderChain()
});

// Create DynamoDB Document client (simpler API)
const docClient = DynamoDBDocumentClient.from(client);

// Table names
const TABLES = {
    USERS: 'Users',
    EASYGJSON: 'EasyGjson',
    DEVICE_SETTINGS: 'DeviceSettings',
    COUNTER: 'Counters',
    DEVICE_PARAMETERS_VERSION: 'DeviceParametersVersion',
    SYSTEM_JSON: 'SystemJsonStore',
    // ML Tables
    ML_MODELS: 'MLModels',
    ML_TRAINING_DATA: 'MLTrainingData',
    ML_PREDICTIONS: 'MLPredictions',
    // AI Tables
    AI_CONVERSATIONS: 'AIConversations',
    AI_PROMPT_TEMPLATES: 'AIPromptTemplates',
    AI_USAGE_METRICS: 'AIUsageMetrics'
};

module.exports = {
    docClient,
    TABLES
};
