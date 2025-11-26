const { DynamoDBClient, CreateTableCommand, DescribeTableCommand } = require('@aws-sdk/client-dynamodb');
const { fromNodeProviderChain } = require('@aws-sdk/credential-providers');
require('dotenv').config();

const client = new DynamoDBClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: fromNodeProviderChain()
});

// Table definitions for ML and AI
const tables = [
    {
        TableName: 'MLModels',
        KeySchema: [
            { AttributeName: 'model_id', KeyType: 'HASH' }
        ],
        AttributeDefinitions: [
            { AttributeName: 'model_id', AttributeType: 'S' }
        ],
        BillingMode: 'PAY_PER_REQUEST'
    },
    {
        TableName: 'MLTrainingData',
        KeySchema: [
            { AttributeName: 'dataset_id', KeyType: 'HASH' },
            { AttributeName: 'record_id', KeyType: 'RANGE' }
        ],
        AttributeDefinitions: [
            { AttributeName: 'dataset_id', AttributeType: 'S' },
            { AttributeName: 'record_id', AttributeType: 'S' }
        ],
        BillingMode: 'PAY_PER_REQUEST'
    },
    {
        TableName: 'MLPredictions',
        KeySchema: [
            { AttributeName: 'prediction_id', KeyType: 'HASH' }
        ],
        AttributeDefinitions: [
            { AttributeName: 'prediction_id', AttributeType: 'S' },
            { AttributeName: 'mac_address', AttributeType: 'S' },
            { AttributeName: 'created_at', AttributeType: 'S' }
        ],
        GlobalSecondaryIndexes: [
            {
                IndexName: 'mac_address-created_at-index',
                KeySchema: [
                    { AttributeName: 'mac_address', KeyType: 'HASH' },
                    { AttributeName: 'created_at', KeyType: 'RANGE' }
                ],
                Projection: { ProjectionType: 'ALL' }
            }
        ],
        BillingMode: 'PAY_PER_REQUEST'
    },
    {
        TableName: 'AIConversations',
        KeySchema: [
            { AttributeName: 'conversation_id', KeyType: 'HASH' }
        ],
        AttributeDefinitions: [
            { AttributeName: 'conversation_id', AttributeType: 'S' },
            { AttributeName: 'user_email', AttributeType: 'S' },
            { AttributeName: 'created_at', AttributeType: 'S' }
        ],
        GlobalSecondaryIndexes: [
            {
                IndexName: 'user_email-created_at-index',
                KeySchema: [
                    { AttributeName: 'user_email', KeyType: 'HASH' },
                    { AttributeName: 'created_at', KeyType: 'RANGE' }
                ],
                Projection: { ProjectionType: 'ALL' }
            }
        ],
        BillingMode: 'PAY_PER_REQUEST'
    },
    {
        TableName: 'AIPromptTemplates',
        KeySchema: [
            { AttributeName: 'template_id', KeyType: 'HASH' }
        ],
        AttributeDefinitions: [
            { AttributeName: 'template_id', AttributeType: 'S' }
        ],
        BillingMode: 'PAY_PER_REQUEST'
    },
    {
        TableName: 'AIUsageMetrics',
        KeySchema: [
            { AttributeName: 'metric_id', KeyType: 'HASH' }
        ],
        AttributeDefinitions: [
            { AttributeName: 'metric_id', AttributeType: 'S' },
            { AttributeName: 'date', AttributeType: 'S' },
            { AttributeName: 'user_email', AttributeType: 'S' }
        ],
        GlobalSecondaryIndexes: [
            {
                IndexName: 'date-index',
                KeySchema: [
                    { AttributeName: 'date', KeyType: 'HASH' }
                ],
                Projection: { ProjectionType: 'ALL' }
            },
            {
                IndexName: 'user_email-date-index',
                KeySchema: [
                    { AttributeName: 'user_email', KeyType: 'HASH' },
                    { AttributeName: 'date', KeyType: 'RANGE' }
                ],
                Projection: { ProjectionType: 'ALL' }
            }
        ],
        BillingMode: 'PAY_PER_REQUEST'
    }
];

async function tableExists(tableName) {
    try {
        await client.send(new DescribeTableCommand({ TableName: tableName }));
        return true;
    } catch (error) {
        if (error.name === 'ResourceNotFoundException') {
            return false;
        }
        throw error;
    }
}

async function createTable(tableDefinition) {
    const tableName = tableDefinition.TableName;

    console.log(`Checking if table '${tableName}' exists...`);

    if (await tableExists(tableName)) {
        console.log(`Table '${tableName}' already exists. Skipping.`);
        return;
    }

    console.log(`Creating table '${tableName}'...`);

    try {
        await client.send(new CreateTableCommand(tableDefinition));
        console.log(`Table '${tableName}' created successfully!`);
    } catch (error) {
        console.error(`Error creating table '${tableName}':`, error.message);
        throw error;
    }
}

async function main() {
    console.log('='.repeat(50));
    console.log('Creating ML and AI DynamoDB Tables');
    console.log('='.repeat(50));
    console.log(`Region: ${process.env.AWS_REGION || 'us-east-1'}`);
    console.log('');

    for (const table of tables) {
        await createTable(table);
        console.log('');
    }

    console.log('='.repeat(50));
    console.log('All tables processed!');
    console.log('='.repeat(50));

    console.log('\nTable Summary:');
    console.log('- MLModels: Store ML model metadata and configurations');
    console.log('- MLTrainingData: Store training datasets');
    console.log('- MLPredictions: Store model predictions (indexed by mac_address)');
    console.log('- AIConversations: Store AI chat conversations (indexed by user_email)');
    console.log('- AIPromptTemplates: Store reusable prompt templates');
    console.log('- AIUsageMetrics: Track AI usage statistics');
}

main().catch(console.error);
