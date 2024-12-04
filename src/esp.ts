
export const enum SupportedESP {
    ESP32_C3 = "ESP32-C3",
    ESP32_S3 = "ESP32-S3",
}

export const enum ConnectivityInterface {
    NONE,
    UART,
    SPI,
    I2C,
    I2S,
    USB,
    TWO_WIRE,
    LED_PWM,
    ADC,
    INPUT,
    OUTPUT
}

export enum PinType {
    GPIO,
    VCC,
    GND,
    SYS,
    NC
}
export interface Pin {
    type: PinType,
    label: string,
    gpio: number,
    interface: ConnectivityInterface
}

export interface Chip {
    reference: SupportedESP,
    layout: { n_side_pins: number, n_bottom_pins: number },
    n_gpios: number,
    pins: Pin[]
}
const ncPin: Pin = {
    type: PinType.NC,
    label: "NC",
    gpio: 0xff,
    interface: ConnectivityInterface.NONE
};
const gndPin: Pin = {
    type: PinType.GND,
    label: "GND",
    gpio: 0xff,
    interface: ConnectivityInterface.NONE
};
const enPin: Pin = {
    type: PinType.SYS,
    label: "EN",
    gpio: 0xff,
    interface: ConnectivityInterface.NONE
};
const vccPin: Pin = {
    type: PinType.VCC,
    label: "3v3",
    gpio: 0xff,
    interface: ConnectivityInterface.NONE
};

const espC3: Chip = {
    reference: SupportedESP.ESP32_C3,
    layout: { n_side_pins: 11, n_bottom_pins: 13 },
    n_gpios: 15,
    pins: [
        gndPin,
        gndPin,
        vccPin,
        ncPin,
        ncPin,
        { type: PinType.GPIO, label: "IO2", gpio: 2, interface: ConnectivityInterface.NONE },
        { type: PinType.GPIO, label: "IO3", gpio: 3, interface: ConnectivityInterface.NONE },
        enPin,
        ncPin,
        ncPin,
        gndPin,
        { type: PinType.GPIO, label: "IO0", gpio: 0, interface: ConnectivityInterface.NONE },
        { type: PinType.GPIO, label: "IO1", gpio: 1, interface: ConnectivityInterface.NONE },
        gndPin,
        ncPin,
        { type: PinType.GPIO, label: "IO10", gpio: 10, interface: ConnectivityInterface.NONE },
        ncPin,
        { type: PinType.GPIO, label: "IO4", gpio: 4, interface: ConnectivityInterface.NONE },
        { type: PinType.GPIO, label: "IO5", gpio: 5, interface: ConnectivityInterface.NONE },
        { type: PinType.GPIO, label: "IO6", gpio: 6, interface: ConnectivityInterface.NONE },
        { type: PinType.GPIO, label: "IO7", gpio: 7, interface: ConnectivityInterface.NONE },
        { type: PinType.GPIO, label: "IO8", gpio: 8, interface: ConnectivityInterface.NONE },
        { type: PinType.GPIO, label: "IO9", gpio: 9, interface: ConnectivityInterface.NONE },
        ncPin,
        ncPin,
        { type: PinType.GPIO, label: "IO18", gpio: 18, interface: ConnectivityInterface.NONE },
        { type: PinType.GPIO, label: "IO19", gpio: 19, interface: ConnectivityInterface.NONE },
        ncPin,
        ncPin,
        { type: PinType.GPIO, label: "RXD0", gpio: 20, interface: ConnectivityInterface.UART },
        { type: PinType.GPIO, label: "TXD0", gpio: 21, interface: ConnectivityInterface.UART },
        ncPin,
        ncPin,
        ncPin,
        ncPin,
    ]
};

export const modules: Chip[] = [espC3]
