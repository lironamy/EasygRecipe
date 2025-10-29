const { DynamoDBClient, CreateTableCommand, DescribeTableCommand } = require('@aws-sdk/client-dynamodb');
require('dotenv').config();

const client = new DynamoDBClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const tables = [
    {
        TableName: 'EasyG_Users',
        KeySchema: [
            { AttributeName: 'email', KeyType: 'HASH' }
        ],
        AttributeDefinitions: [
            { AttributeName: 'email', AttributeType: 'S' }
        ],
        BillingMode: 'PAY_PER_REQUEST'
    },
    {
        TableName: 'EasyG_EasyGjson',
        KeySchema: [
            { AttributeName: 'mac_address', KeyType: 'HASH' }
        ],
        AttributeDefinitions: [
            { AttributeName: 'mac_address', AttributeType: 'S' }
        ],
        BillingMode: 'PAY_PER_REQUEST'
    },
    {
        TableName: 'EasyG_DeviceSettings',
        KeySchema: [
            { AttributeName: 'mac_address', KeyType: 'HASH' }
        ],
        AttributeDefinitions: [
            { AttributeName: 'mac_address', AttributeType: 'S' }
        ],
        BillingMode: 'PAY_PER_REQUEST'
    },
    {
        TableName: 'EasyG_Counter',
        KeySchema: [
            { AttributeName: 'model', KeyType: 'HASH' }
        ],
        AttributeDefinitions: [
            { AttributeName: 'model', AttributeType: 'S' }
        ],
        BillingMode: 'PAY_PER_REQUEST'
    },
    {
        TableName: 'EasyG_DeviceParametersVersion',
        KeySchema: [
            { AttributeName: 'version', KeyType: 'HASH' }
        ],
        AttributeDefinitions: [
            { AttributeName: 'version', AttributeType: 'S' }
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

async function createTable(tableConfig) {
    const exists = await tableExists(tableConfig.TableName);

    if (exists) {
        console.log(`Table ${tableConfig.TableName} already exists.`);
        return;
    }

    try {
        await client.send(new CreateTableCommand(tableConfig));
        console.log(`Table ${tableConfig.TableName} created successfully.`);
    } catch (error) {
        console.error(`Error creating table ${tableConfig.TableName}:`, error);
        throw error;
    }
}

async function createAllTables() {
    console.log('Starting DynamoDB table creation...\n');

    for (const table of tables) {
        await createTable(table);
    }

    console.log('\nAll tables created successfully!');
    console.log('\nTable Summary:');
    console.log('- EasyG_Users: Stores user accounts (email as primary key)');
    console.log('- EasyG_EasyGjson: Stores device recipes (mac_address as primary key)');
    console.log('- EasyG_DeviceSettings: Stores device settings (mac_address as primary key)');
    console.log('- EasyG_Counter: Stores auto-increment counters (model as primary key)');
    console.log('- EasyG_DeviceParametersVersion: Stores device parameter versions (version as primary key)');
}

// Run the script
createAllTables()
    .then(() => {
        console.log('\nSetup complete!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\nSetup failed:', error);
        process.exit(1);
    });
