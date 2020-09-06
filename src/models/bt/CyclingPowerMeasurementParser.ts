class CyclingPowerMeasurementParser extends BleCharacteristicParser {

    constructor () {
        super();
        this.fields = cycling_power_measurement;
        this.mask_size = 16;
    }
}
const ble_sint16 = ['getInt16', 2, true];
const ble_uint8 = ['getUint8', 1];
const ble_uint16 = ['getUint16', 2, true];
const ble_uint32 = ['getUint32', 4, true];
const ble_uint24 = ['getUint8', 3];

const cycling_power_measurement = [
    [0, [ [ble_sint16, 'instantaneous_power'] ]],
    [1, [ [ble_uint8, 'pedal_power_balance'] ]],
    [2, [ /* Pedal Power Balance Reference */]],
    [4, [ [ble_uint16, 'accumulated_torque'] ]],
    [8, [ /* Accumulated Torque Source */]],
    [16, [ [ble_uint32, 'cumulative_wheel_revolutions'], [ble_uint16, 'last_wheel_event_time'] ]],
    [32, [ [ble_uint16, 'cumulative_crank_revolutions'], [ble_uint16, 'last_crank_event_time'] ]],
    [64, [ [ble_sint16, 'maximum_force_magnitude'], [ble_sint16, 'minimum_force_magnitude'] ]],
    [128, [ [ble_sint16, 'maximum_torque_magnitude'], [ble_sint16, 'minimum_torque_magnitude'] ]],
    [256, [ [ble_uint24, 'maximum_minimum_angle'] ]],
    [512, [ [ble_uint16, 'top_dead_spot_angle'] ]],
    [1024, [ [ble_uint16, 'bottom_dead_spot_angle'] ]],
    [2048, [ [ble_uint16, 'accumulated_energy'] ]],
    [4096, [ /* Offset Compensation Indicator */]]
];

