const { GetCommand, PutCommand, UpdateCommand, DeleteCommand, QueryCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient, TABLES } = require('../config/dynamodb');

// Counter helper - auto-increment user_id
async function getNextUserId() {
    const params = {
        TableName: TABLES.COUNTER,
        Key: { tableName: 'User' },
        UpdateExpression: 'ADD #count :inc',
        ExpressionAttributeNames: { '#count': 'count' },
        ExpressionAttributeValues: { ':inc': 1 },
        ReturnValues: 'UPDATED_NEW'
    };

    try {
        const result = await docClient.send(new UpdateCommand(params));
        return result.Attributes.count;
    } catch (error) {
        console.error('Error getting next user ID:', error);
        throw error;
    }
}

// User operations
async function createUser(email, hashedPassword, nickname) {
    const user_id = await getNextUserId();
    const now = new Date().toISOString();

    const params = {
        TableName: TABLES.USERS,
        Item: {
            email: email.toLowerCase(),
            user_id,
            password: hashedPassword,
            nickname: nickname.toLowerCase(),
            created_at: now,
            updated_at: now
        },
        ConditionExpression: 'attribute_not_exists(email)'
    };

    await docClient.send(new PutCommand(params));
    return { user_id, nickname, created_at: now };
}

async function findUserByEmail(email) {
    const params = {
        TableName: TABLES.USERS,
        Key: { email: email.toLowerCase() }
    };

    const result = await docClient.send(new GetCommand(params));
    return result.Item || null;
}

async function deleteUserByEmail(email) {
    const params = {
        TableName: TABLES.USERS,
        Key: { email: email.toLowerCase() }
    };

    await docClient.send(new DeleteCommand(params));
}

async function updateUserLastLogin(email) {
    const now = new Date().toISOString();
    const params = {
        TableName: TABLES.USERS,
        Key: { email: email.toLowerCase() },
        UpdateExpression: 'SET last_login = :last_login, updated_at = :updated_at',
        ExpressionAttributeValues: {
            ':last_login': now,
            ':updated_at': now
        },
        ReturnValues: 'ALL_NEW'
    };

    const result = await docClient.send(new UpdateCommand(params));
    return result.Attributes;
}

// EasyGjson operations
async function upsertEasyGjson(mac_address, easygjson) {
    const now = new Date().toISOString();
    const params = {
        TableName: TABLES.EASYGJSON,
        Item: {
            mac_address,
            easygjson,
            created_at: now,
            updated_at: now
        }
    };

    const result = await docClient.send(new PutCommand(params));
    return { mac_address, easygjson, updated_at: now };
}

async function findEasyGjson(mac_address) {
    const params = {
        TableName: TABLES.EASYGJSON,
        Key: { mac_address }
    };

    const result = await docClient.send(new GetCommand(params));
    return result.Item || null;
}

// DeviceSettings operations
async function upsertDeviceSettings(mac_address, updates) {
    const now = new Date().toISOString();

    // Build update expression dynamically
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    Object.keys(updates).forEach((key, index) => {
        const attrName = `#attr${index}`;
        const attrValue = `:val${index}`;
        updateExpressions.push(`${attrName} = ${attrValue}`);
        expressionAttributeNames[attrName] = key;
        expressionAttributeValues[attrValue] = updates[key];
    });

    // Add updated_at and created_at (if not exists)
    updateExpressions.push('#updated_at = :updated_at');
    updateExpressions.push('created_at = if_not_exists(created_at, :created_at)');
    expressionAttributeNames['#updated_at'] = 'updated_at';
    expressionAttributeValues[':updated_at'] = now;
    expressionAttributeValues[':created_at'] = now;

    const params = {
        TableName: TABLES.DEVICE_SETTINGS,
        Key: { mac_address },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
    };

    const result = await docClient.send(new UpdateCommand(params));
    return result.Attributes;
}

async function findDeviceSettings(mac_address) {
    const params = {
        TableName: TABLES.DEVICE_SETTINGS,
        Key: { mac_address }
    };

    const result = await docClient.send(new GetCommand(params));
    return result.Item || null;
}

async function findOneDeviceSettings() {
    const params = {
        TableName: TABLES.DEVICE_SETTINGS,
        Limit: 1
    };

    const result = await docClient.send(new ScanCommand(params));
    return result.Items && result.Items.length > 0 ? result.Items[0] : null;
}

// DeviceParametersVersion operations
async function upsertDeviceParametersVersion(version, parameters) {
    const now = new Date().toISOString();
    const params = {
        TableName: TABLES.DEVICE_PARAMETERS_VERSION,
        Item: {
            version,
            parameters,
            pending_devices: [],
            updated_devices: [],
            created_at: now,
            updated_at: now
        }
    };

    await docClient.send(new PutCommand(params));
    return { version, parameters, pending_devices: [], updated_devices: [], created_at: now, updated_at: now };
}

async function findDeviceParametersVersion(version) {
    const params = {
        TableName: TABLES.DEVICE_PARAMETERS_VERSION,
        Key: { version }
    };

    const result = await docClient.send(new GetCommand(params));
    return result.Item || null;
}

async function updateDeviceParametersVersion(version, updates) {
    const now = new Date().toISOString();

    const params = {
        TableName: TABLES.DEVICE_PARAMETERS_VERSION,
        Key: { version },
        UpdateExpression: 'SET parameters = :parameters, updated_at = :updated_at',
        ExpressionAttributeValues: {
            ':parameters': updates.parameters,
            ':updated_at': now
        },
        ReturnValues: 'ALL_NEW'
    };

    const result = await docClient.send(new UpdateCommand(params));
    return result.Attributes;
}

async function addPendingDevices(version, macAddresses) {
    // Get current version document
    const versionDoc = await findDeviceParametersVersion(version);
    if (!versionDoc) {
        throw new Error('Version not found');
    }

    // Get existing updated MAC addresses
    const existingUpdatedMacs = new Set(
        (versionDoc.updated_devices || []).map(d => d.mac_address)
    );

    // Filter out already updated MACs
    const newPendingMacs = macAddresses.filter(mac => !existingUpdatedMacs.has(mac));

    // Merge with existing pending devices
    const mergedPendingDevices = [...new Set([...(versionDoc.pending_devices || []), ...newPendingMacs])];

    const params = {
        TableName: TABLES.DEVICE_PARAMETERS_VERSION,
        Key: { version },
        UpdateExpression: 'SET pending_devices = :pending',
        ExpressionAttributeValues: {
            ':pending': mergedPendingDevices
        },
        ReturnValues: 'ALL_NEW'
    };

    const result = await docClient.send(new UpdateCommand(params));
    return result.Attributes;
}

async function addUpdatedDevice(version, mac_address) {
    const now = new Date().toISOString();
    const params = {
        TableName: TABLES.DEVICE_PARAMETERS_VERSION,
        Key: { version },
        UpdateExpression: 'SET updated_devices = list_append(if_not_exists(updated_devices, :empty_list), :new_device)',
        ExpressionAttributeValues: {
            ':new_device': [{ mac_address, updated_at: now }],
            ':empty_list': []
        },
        ReturnValues: 'ALL_NEW'
    };

    const result = await docClient.send(new UpdateCommand(params));
    return result.Attributes;
}

async function findVersionByPendingMac(mac_address) {
    const params = {
        TableName: TABLES.DEVICE_PARAMETERS_VERSION
    };

    const result = await docClient.send(new ScanCommand(params));

    // Filter for versions that have this MAC in pending_devices
    const versionsWithMac = (result.Items || []).filter(version => {
        return version.pending_devices && version.pending_devices.includes(mac_address);
    });

    // Sort by version descending and return the latest
    if (versionsWithMac.length > 0) {
        return versionsWithMac.sort((a, b) => b.version.localeCompare(a.version))[0];
    }
    return null;
}

module.exports = {
    getNextUserId,
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
    findVersionByPendingMac
};
