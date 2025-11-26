const { DynamoDBClient, CreateTableCommand, DescribeTableCommand } = require('@aws-sdk/client-dynamodb');
const { fromNodeProviderChain } = require('@aws-sdk/credential-providers');
require('dotenv').config();

const client = new DynamoDBClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: fromNodeProviderChain()
});

// All table definitions
const tables = [
    // Existing tables
    {
        TableName: 'Users',
        KeySchema: [
            { AttributeName: 'email', KeyType: 'HASH' }
        ],
        AttributeDefinitions: [
            { AttributeName: 'email', AttributeType: 'S' }
        ],
        BillingMode: 'PAY_PER_REQUEST'
    },
    {
        TableName: 'EasyGjson',
        KeySchema: [
            { AttributeName: 'mac_address', KeyType: 'HASH' }
        ],
        AttributeDefinitions: [
            { AttributeName: 'mac_address', AttributeType: 'S' }
        ],
        BillingMode: 'PAY_PER_REQUEST'
    },
    {
        TableName: 'DeviceSettings',
        KeySchema: [
            { AttributeName: 'mac_address', KeyType: 'HASH' }
        ],
        AttributeDefinitions: [
            { AttributeName: 'mac_address', AttributeType: 'S' }
        ],
        BillingMode: 'PAY_PER_REQUEST'
    },
    {
        TableName: 'Counters',
        KeySchema: [
            { AttributeName: 'tableName', KeyType: 'HASH' }
        ],
        AttributeDefinitions: [
            { AttributeName: 'tableName', AttributeType: 'S' }
        ],
        BillingMode: 'PAY_PER_REQUEST'
    },
    {
        TableName: 'DeviceParametersVersion',
        KeySchema: [
            { AttributeName: 'version', KeyType: 'HASH' }
        ],
        AttributeDefinitions: [
            { AttributeName: 'version', AttributeType: 'S' }
        ],
        BillingMode: 'PAY_PER_REQUEST'
    },
    {
        TableName: 'SystemJsonStore',
        KeySchema: [
            { AttributeName: 'config_id', KeyType: 'HASH' }
        ],
        AttributeDefinitions: [
            { AttributeName: 'config_id', AttributeType: 'S' }
        ],
        BillingMode: 'PAY_PER_REQUEST'
    },
    // ML Tables
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
    // AI Tables
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
        console.log(`  ✓ Table '${tableName}' already exists. Skipping.`);
        return { tableName, status: 'exists' };
    }

    console.log(`  Creating table '${tableName}'...`);

    try {
        await client.send(new CreateTableCommand(tableDefinition));
        console.log(`  ✓ Table '${tableName}' created successfully!`);
        return { tableName, status: 'created' };
    } catch (error) {
        console.error(`  ✗ Error creating table '${tableName}':`, error.message);
        return { tableName, status: 'error', error: error.message };
    }
}

async function main() {
    console.log('='.repeat(60));
    console.log('Creating All DynamoDB Tables');
    console.log('='.repeat(60));
    console.log(`Region: ${process.env.AWS_REGION || 'us-east-1'}`);
    console.log('');

    const results = [];
    for (const table of tables) {
        const result = await createTable(table);
        results.push(result);
        console.log('');
    }

    console.log('='.repeat(60));
    console.log('Summary:');
    console.log('='.repeat(60));

    const created = results.filter(r => r.status === 'created');
    const existing = results.filter(r => r.status === 'exists');
    const errors = results.filter(r => r.status === 'error');

    console.log(`Created: ${created.length}`);
    created.forEach(r => console.log(`  - ${r.tableName}`));

    console.log(`Already existed: ${existing.length}`);
    existing.forEach(r => console.log(`  - ${r.tableName}`));

    if (errors.length > 0) {
        console.log(`Errors: ${errors.length}`);
        errors.forEach(r => console.log(`  - ${r.tableName}: ${r.error}`));
    }

    console.log('');
    console.log('All tables processed!');
}

main().catch(console.error);
