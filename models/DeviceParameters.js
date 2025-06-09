const mongoose = require('mongoose');

const deviceParametersSchema = new mongoose.Schema({
    mac_address: { type: String, required: true, unique: true },
    parameters: {
        // Drop button pump working times
        drop_button_short_press_time: { type: Number, required: true },
        drop_button_long_press_time: { type: Number, required: true },
        
        // Heater settings
        heater_ntc_value: { type: Number, required: true },
        heating_boost_times: { type: Map, of: Number, required: true }, // Maps temperature to boost time
        
        // Auto shutdown settings
        battery_shutdown_voltage: { type: Number, required: true },
        inactivity_shutdown_time: { type: Number, required: true }, // in minutes
        
        // Battery settings
        battery_full_charge_voltage: { type: Number, required: true },
        
        // Pump settings
        initial_pump_priming_time: { type: Number, required: true },
        initial_pump_addition_time: { type: Number, required: true },
        
        // Capacity pump settings
        capacity_pump_times: { type: Map, of: Number, required: true }, // Maps capacity percentage to pump time
        
        // Protection settings
        over_current_voltage: { type: Number, required: true },
        over_current_time: { type: Number, required: true },
        
        // Bluetooth settings
        bt_pairing_enabled: { type: Boolean, default: true }
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Update the updated_at timestamp before saving
deviceParametersSchema.pre('save', function(next) {
    this.updated_at = new Date();
    next();
});

const DeviceParameters = mongoose.model('DeviceParameters', deviceParametersSchema);

module.exports = DeviceParameters; 