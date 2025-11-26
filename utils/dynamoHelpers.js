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

// System JSON storage operations
async function upsertSystemJson(config_id, payload) {
    if (typeof payload === 'undefined') {
        throw new Error('Payload is required');
    }

    const now = new Date().toISOString();
    const params = {
        TableName: TABLES.SYSTEM_JSON,
        Item: {
            config_id,
            payload,
            updated_at: now
        }
    };

    await docClient.send(new PutCommand(params));
    return { config_id, payload, updated_at: now };
}

async function getSystemJson(config_id) {
    const params = {
        TableName: TABLES.SYSTEM_JSON,
        Key: { config_id }
    };

    const result = await docClient.send(new GetCommand(params));
    return result.Item ? result.Item.payload : null;
}

// ============================================
// ML Models Operations
// ============================================

async function createMLModel(model_id, modelData) {
    const now = new Date().toISOString();
    const params = {
        TableName: TABLES.ML_MODELS,
        Item: {
            model_id,
            ...modelData,
            created_at: now,
            updated_at: now
        }
    };

    await docClient.send(new PutCommand(params));
    return { model_id, ...modelData, created_at: now, updated_at: now };
}

async function getMLModel(model_id) {
    const params = {
        TableName: TABLES.ML_MODELS,
        Key: { model_id }
    };

    const result = await docClient.send(new GetCommand(params));
    return result.Item || null;
}

async function updateMLModel(model_id, updates) {
    const now = new Date().toISOString();
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

    updateExpressions.push('#updated_at = :updated_at');
    expressionAttributeNames['#updated_at'] = 'updated_at';
    expressionAttributeValues[':updated_at'] = now;

    const params = {
        TableName: TABLES.ML_MODELS,
        Key: { model_id },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
    };

    const result = await docClient.send(new UpdateCommand(params));
    return result.Attributes;
}

async function deleteMLModel(model_id) {
    const params = {
        TableName: TABLES.ML_MODELS,
        Key: { model_id }
    };

    await docClient.send(new DeleteCommand(params));
}

async function listMLModels() {
    const params = {
        TableName: TABLES.ML_MODELS
    };

    const result = await docClient.send(new ScanCommand(params));
    return result.Items || [];
}

// ============================================
// ML Training Data Operations
// ============================================

async function addTrainingRecord(dataset_id, record_id, data) {
    const now = new Date().toISOString();
    const params = {
        TableName: TABLES.ML_TRAINING_DATA,
        Item: {
            dataset_id,
            record_id,
            data,
            created_at: now
        }
    };

    await docClient.send(new PutCommand(params));
    return { dataset_id, record_id, data, created_at: now };
}

async function getTrainingRecord(dataset_id, record_id) {
    const params = {
        TableName: TABLES.ML_TRAINING_DATA,
        Key: { dataset_id, record_id }
    };

    const result = await docClient.send(new GetCommand(params));
    return result.Item || null;
}

async function getTrainingDataset(dataset_id) {
    const params = {
        TableName: TABLES.ML_TRAINING_DATA,
        KeyConditionExpression: 'dataset_id = :dataset_id',
        ExpressionAttributeValues: {
            ':dataset_id': dataset_id
        }
    };

    const result = await docClient.send(new QueryCommand(params));
    return result.Items || [];
}

async function deleteTrainingRecord(dataset_id, record_id) {
    const params = {
        TableName: TABLES.ML_TRAINING_DATA,
        Key: { dataset_id, record_id }
    };

    await docClient.send(new DeleteCommand(params));
}

// ============================================
// ML Predictions Operations
// ============================================

async function createPrediction(prediction_id, mac_address, predictionData) {
    const now = new Date().toISOString();
    const params = {
        TableName: TABLES.ML_PREDICTIONS,
        Item: {
            prediction_id,
            mac_address,
            ...predictionData,
            created_at: now
        }
    };

    await docClient.send(new PutCommand(params));
    return { prediction_id, mac_address, ...predictionData, created_at: now };
}

async function getPrediction(prediction_id) {
    const params = {
        TableName: TABLES.ML_PREDICTIONS,
        Key: { prediction_id }
    };

    const result = await docClient.send(new GetCommand(params));
    return result.Item || null;
}

async function getPredictionsByMac(mac_address, limit = 50) {
    const params = {
        TableName: TABLES.ML_PREDICTIONS,
        IndexName: 'mac_address-created_at-index',
        KeyConditionExpression: 'mac_address = :mac_address',
        ExpressionAttributeValues: {
            ':mac_address': mac_address
        },
        ScanIndexForward: false,
        Limit: limit
    };

    const result = await docClient.send(new QueryCommand(params));
    return result.Items || [];
}

// ============================================
// AI Conversations Operations
// ============================================

async function createConversation(conversation_id, user_email, conversationData = {}) {
    const now = new Date().toISOString();
    const params = {
        TableName: TABLES.AI_CONVERSATIONS,
        Item: {
            conversation_id,
            user_email,
            messages: [],
            ...conversationData,
            created_at: now,
            updated_at: now
        }
    };

    await docClient.send(new PutCommand(params));
    return { conversation_id, user_email, messages: [], ...conversationData, created_at: now, updated_at: now };
}

async function getConversation(conversation_id) {
    const params = {
        TableName: TABLES.AI_CONVERSATIONS,
        Key: { conversation_id }
    };

    const result = await docClient.send(new GetCommand(params));
    return result.Item || null;
}

async function addMessageToConversation(conversation_id, message) {
    const now = new Date().toISOString();
    const params = {
        TableName: TABLES.AI_CONVERSATIONS,
        Key: { conversation_id },
        UpdateExpression: 'SET messages = list_append(if_not_exists(messages, :empty_list), :new_message), updated_at = :updated_at',
        ExpressionAttributeValues: {
            ':new_message': [{ ...message, timestamp: now }],
            ':empty_list': [],
            ':updated_at': now
        },
        ReturnValues: 'ALL_NEW'
    };

    const result = await docClient.send(new UpdateCommand(params));
    return result.Attributes;
}

async function getConversationsByUser(user_email, limit = 20) {
    const params = {
        TableName: TABLES.AI_CONVERSATIONS,
        IndexName: 'user_email-created_at-index',
        KeyConditionExpression: 'user_email = :user_email',
        ExpressionAttributeValues: {
            ':user_email': user_email
        },
        ScanIndexForward: false,
        Limit: limit
    };

    const result = await docClient.send(new QueryCommand(params));
    return result.Items || [];
}

async function deleteConversation(conversation_id) {
    const params = {
        TableName: TABLES.AI_CONVERSATIONS,
        Key: { conversation_id }
    };

    await docClient.send(new DeleteCommand(params));
}

// ============================================
// AI Prompt Templates Operations
// ============================================

async function createPromptTemplate(template_id, templateData) {
    const now = new Date().toISOString();
    const params = {
        TableName: TABLES.AI_PROMPT_TEMPLATES,
        Item: {
            template_id,
            ...templateData,
            created_at: now,
            updated_at: now
        }
    };

    await docClient.send(new PutCommand(params));
    return { template_id, ...templateData, created_at: now, updated_at: now };
}

async function getPromptTemplate(template_id) {
    const params = {
        TableName: TABLES.AI_PROMPT_TEMPLATES,
        Key: { template_id }
    };

    const result = await docClient.send(new GetCommand(params));
    return result.Item || null;
}

async function updatePromptTemplate(template_id, updates) {
    const now = new Date().toISOString();
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

    updateExpressions.push('#updated_at = :updated_at');
    expressionAttributeNames['#updated_at'] = 'updated_at';
    expressionAttributeValues[':updated_at'] = now;

    const params = {
        TableName: TABLES.AI_PROMPT_TEMPLATES,
        Key: { template_id },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
    };

    const result = await docClient.send(new UpdateCommand(params));
    return result.Attributes;
}

async function listPromptTemplates() {
    const params = {
        TableName: TABLES.AI_PROMPT_TEMPLATES
    };

    const result = await docClient.send(new ScanCommand(params));
    return result.Items || [];
}

async function deletePromptTemplate(template_id) {
    const params = {
        TableName: TABLES.AI_PROMPT_TEMPLATES,
        Key: { template_id }
    };

    await docClient.send(new DeleteCommand(params));
}

// ============================================
// AI Usage Metrics Operations
// ============================================

async function recordUsageMetric(metric_id, user_email, metricData) {
    const now = new Date().toISOString();
    const date = now.split('T')[0]; // YYYY-MM-DD format
    const params = {
        TableName: TABLES.AI_USAGE_METRICS,
        Item: {
            metric_id,
            user_email,
            date,
            ...metricData,
            created_at: now
        }
    };

    await docClient.send(new PutCommand(params));
    return { metric_id, user_email, date, ...metricData, created_at: now };
}

async function getUsageMetric(metric_id) {
    const params = {
        TableName: TABLES.AI_USAGE_METRICS,
        Key: { metric_id }
    };

    const result = await docClient.send(new GetCommand(params));
    return result.Item || null;
}

async function getUsageMetricsByDate(date) {
    const params = {
        TableName: TABLES.AI_USAGE_METRICS,
        IndexName: 'date-index',
        KeyConditionExpression: '#date = :date',
        ExpressionAttributeNames: {
            '#date': 'date'
        },
        ExpressionAttributeValues: {
            ':date': date
        }
    };

    const result = await docClient.send(new QueryCommand(params));
    return result.Items || [];
}

async function getUsageMetricsByUser(user_email, startDate = null, endDate = null) {
    const params = {
        TableName: TABLES.AI_USAGE_METRICS,
        IndexName: 'user_email-date-index',
        KeyConditionExpression: 'user_email = :user_email',
        ExpressionAttributeValues: {
            ':user_email': user_email
        }
    };

    if (startDate && endDate) {
        params.KeyConditionExpression += ' AND #date BETWEEN :startDate AND :endDate';
        params.ExpressionAttributeNames = { '#date': 'date' };
        params.ExpressionAttributeValues[':startDate'] = startDate;
        params.ExpressionAttributeValues[':endDate'] = endDate;
    } else if (startDate) {
        params.KeyConditionExpression += ' AND #date >= :startDate';
        params.ExpressionAttributeNames = { '#date': 'date' };
        params.ExpressionAttributeValues[':startDate'] = startDate;
    }

    const result = await docClient.send(new QueryCommand(params));
    return result.Items || [];
}

module.exports = {
    // User operations
    getNextUserId,
    createUser,
    findUserByEmail,
    deleteUserByEmail,
    updateUserLastLogin,
    // EasyGjson operations
    upsertEasyGjson,
    findEasyGjson,
    // DeviceSettings operations
    upsertDeviceSettings,
    findDeviceSettings,
    findOneDeviceSettings,
    // DeviceParametersVersion operations
    upsertDeviceParametersVersion,
    findDeviceParametersVersion,
    updateDeviceParametersVersion,
    addPendingDevices,
    addUpdatedDevice,
    findVersionByPendingMac,
    // SystemJson operations
    upsertSystemJson,
    getSystemJson,
    // ML Models operations
    createMLModel,
    getMLModel,
    updateMLModel,
    deleteMLModel,
    listMLModels,
    // ML Training Data operations
    addTrainingRecord,
    getTrainingRecord,
    getTrainingDataset,
    deleteTrainingRecord,
    // ML Predictions operations
    createPrediction,
    getPrediction,
    getPredictionsByMac,
    // AI Conversations operations
    createConversation,
    getConversation,
    addMessageToConversation,
    getConversationsByUser,
    deleteConversation,
    // AI Prompt Templates operations
    createPromptTemplate,
    getPromptTemplate,
    updatePromptTemplate,
    listPromptTemplates,
    deletePromptTemplate,
    // AI Usage Metrics operations
    recordUsageMetric,
    getUsageMetric,
    getUsageMetricsByDate,
    getUsageMetricsByUser
};
