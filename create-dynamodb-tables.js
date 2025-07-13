const AWS = require('aws-sdk');
require('dotenv').config();

// Configure AWS
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const dynamodb = new AWS.DynamoDB();

// Table definitions
const tables = [
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
        TableName: 'DeviceParametersVersion',
        KeySchema: [
            { AttributeName: 'version', KeyType: 'HASH' }
        ],
        AttributeDefinitions: [
            { AttributeName: 'version', AttributeType: 'S' }
        ],
        BillingMode: 'PAY_PER_REQUEST'
    }
];

async function createTables() {
    for (const tableConfig of tables) {
        try {
            console.log(`Creating table: ${tableConfig.TableName}`);
            
            // Check if table already exists
            try {
                await dynamodb.describeTable({ TableName: tableConfig.TableName }).promise();
                console.log(`Table ${tableConfig.TableName} already exists.`);
                continue;
            } catch (error) {
                if (error.code !== 'ResourceNotFoundException') {
                    throw error;
                }
            }
            
            // Create the table
            const result = await dynamodb.createTable(tableConfig).promise();
            console.log(`Table ${tableConfig.TableName} created successfully.`);
            
            // Wait for table to be active
            console.log(`Waiting for table ${tableConfig.TableName} to be active...`);
            await dynamodb.waitFor('tableExists', { TableName: tableConfig.TableName }).promise();
            console.log(`Table ${tableConfig.TableName} is now active.`);
            
        } catch (error) {
            console.error(`Error creating table ${tableConfig.TableName}:`, error);
        }
    }
}

createTables().then(() => {
    console.log('All tables created successfully!');
}).catch(error => {
    console.error('Error creating tables:', error);
}); 