const mongoose = require('mongoose');

const deviceParametersVersionSchema = new mongoose.Schema({
    version: { type: String, required: true, unique: true },
    parameters: {
        drop_button_short_press_time: { type: Number, required: true },
        drop_button_long_press_time: { type: Number, required: true },
        heater_ntc_value: { type: Number, required: true },
        heating_boost_times: { type: Map, of: Number, required: true },
        battery_shutdown_voltage: { type: Number, required: true },
        inactivity_shutdown_time: { type: Number, required: true },
        battery_full_charge_voltage: { type: Number, required: true },
        initial_pump_priming_time: { type: Number, required: true },
        initial_pump_addition_time: { type: Number, required: true },
        capacity_pump_times: { type: Map, of: Number, required: true },
        over_current_voltage: { type: Number, required: true },
        over_current_time: { type: Number, required: true },
        bt_pairing_enabled: { type: Boolean, default: true }
    },
    pending_devices: [{ type: String }], // List of MAC addresses that haven't received the update
    updated_devices: [{
        mac_address: { type: String, required: true },
        updated_at: { type: Date, default: Date.now }
    }],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Update the updated_at timestamp before saving
deviceParametersVersionSchema.pre('save', function(next) {
    this.updated_at = new Date();
    next();
});

const DeviceParametersVersion = mongoose.model('DeviceParametersVersion', deviceParametersVersionSchema);

module.exports = DeviceParametersVersion; 