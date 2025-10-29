# MongoDB to DynamoDB Migration Guide

## Overview
This server has been migrated from MongoDB to AWS DynamoDB. All database operations now use DynamoDB tables instead of MongoDB collections.

## Prerequisites
- AWS Account with DynamoDB access
- AWS credentials (Access Key ID and Secret Access Key)
- Appropriate IAM permissions for DynamoDB operations

## Environment Variables
Make sure your `.env` file contains the following AWS configuration:

```
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=us-east-1
```

## DynamoDB Tables

The migration creates 5 DynamoDB tables:

### 1. EasyG_Users
- **Primary Key**: `email` (String)
- **Attributes**: user_id, email, password, nickname
- **Purpose**: Stores user account information

### 2. EasyG_EasyGjson
- **Primary Key**: `mac_address` (String)
- **Attributes**: mac_address, easygjson, created_at, updated_at
- **Purpose**: Stores device recipe configurations

### 3. EasyG_DeviceSettings
- **Primary Key**: `mac_address` (String)
- **Attributes**: mac_address, onboarding_pass, prog_choose, pleasure_q, wellness_q, demomode, useDebugMode, remoteLogsEnabled, demoAccounts, wififlow, created_at, updated_at
- **Purpose**: Stores device settings and preferences

### 4. EasyG_Counter
- **Primary Key**: `model` (String)
- **Attributes**: model, count
- **Purpose**: Auto-increment counter for user IDs

### 5. EasyG_DeviceParametersVersion
- **Primary Key**: `version` (String)
- **Attributes**: version, parameters, pending_devices, updated_devices, created_at, updated_at
- **Purpose**: Stores device parameter versions and update tracking

## Setup Instructions

### Step 1: Create DynamoDB Tables
Run the table creation script:

```bash
node scripts/createDynamoDBTables.js
```

This will create all required DynamoDB tables in your AWS account.

### Step 2: Initialize Counter
Initialize the User counter in DynamoDB:

```bash
# Use AWS CLI or AWS Console to add an item to EasyG_Counter table:
{
  "model": "User",
  "count": 0
}
```

Or use the AWS SDK:

```javascript
const { PutCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient, TABLES } = require('./config/dynamodb');

await docClient.send(new PutCommand({
    TableName: TABLES.COUNTER,
    Item: { model: 'User', count: 0 }
}));
```

### Step 3: Migrate Existing Data (Optional)
If you have existing MongoDB data, you'll need to migrate it to DynamoDB. Create a migration script that:

1. Connects to your MongoDB database
2. Reads all documents from each collection
3. Transforms the data as needed
4. Inserts into corresponding DynamoDB tables

Example migration script structure:

```javascript
// Connect to MongoDB
const mongoClient = await MongoClient.connect(MONGO_URI);
const db = mongoClient.db('easyg');

// Migrate Users
const users = await db.collection('users').find({}).toArray();
for (const user of users) {
    await docClient.send(new PutCommand({
        TableName: 'EasyG_Users',
        Item: {
            email: user.email,
            user_id: user.user_id,
            password: user.password,
            nickname: user.nickname
        }
    }));
}

// Repeat for other collections...
```

### Step 4: Start the Server
```bash
node app.js
```

## Key Changes

### Code Changes
1. **Removed Dependencies**: `mongoose` package has been removed
2. **New Dependencies**: Added `@aws-sdk/client-dynamodb` and `@aws-sdk/lib-dynamodb`
3. **Configuration**: New `config/dynamodb.js` for DynamoDB client setup
4. **Helper Functions**: New `utils/dynamoHelpers.js` with database operation helpers

### Database Operation Changes
- **No Schemas**: DynamoDB is schema-less, validation is done in application code
- **No Middleware**: Pre-save hooks replaced with direct counter operations
- **Atomic Updates**: Used UpdateCommand for atomic counter increments
- **No Joins**: DynamoDB doesn't support joins; data is denormalized
- **Conditional Writes**: Used for unique constraint checks (e.g., unique email)

## Differences from MongoDB

| Feature | MongoDB | DynamoDB |
|---------|---------|----------|
| Data Model | Document-based | Key-value and document |
| Schema | Flexible with Mongoose | Schema-less |
| Queries | Rich query language | Limited query capabilities |
| Indexes | Automatic on any field | Only on defined keys |
| Auto-increment | Middleware required | Manual counter implementation |
| Transactions | Multi-document | Limited |

## Performance Considerations

1. **Billing Mode**: Tables use PAY_PER_REQUEST (on-demand) billing
2. **Indexes**: Consider adding GSIs (Global Secondary Indexes) for frequently queried non-key attributes
3. **Batch Operations**: For bulk writes, use BatchWriteCommand
4. **Read Consistency**: Current implementation uses eventual consistency (default)

## Troubleshooting

### Error: "ResourceNotFoundException"
- Table doesn't exist - run the table creation script

### Error: "AccessDeniedException"
- Check AWS credentials and IAM permissions

### Error: "ConditionalCheckFailedException"
- Unique constraint violation (e.g., duplicate email)

### Slow Queries
- Consider adding GSIs for frequently queried attributes
- Use Query instead of Scan when possible

## Rollback Plan

If you need to rollback to MongoDB:

1. Restore the original `app.js` from git history
2. Reinstall mongoose: `npm install mongoose`
3. Restore MongoDB connection string
4. Restart the server

## Support

For issues or questions about this migration, contact your development team.
