
export const enum SupportedESP {
    ESP32_C3 = "ESP32-C3",
}

export const enum InterfaceType {
    UART,
    SPI,
    I2C,
    I2S,
    USB,
    TWO_WIRE,
    LED_PWM,
    RMT,
}
export interface UART {
    RX: number,
    TX: number,
    CTS?: number,
    RTS?: number
}

export interface SPI {
    SCK: number,
    CS: number,
    MOSI?: number,
    MISO?: number,
    IO2?: number,
    IO3?: number,
}

export interface I2C {
    SCL: number,
    SDA: number
}

export interface USB {
    D_P: number,
    D_N: number
}

export interface ADC {
    channel: { io: number }[]
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
    gpio?: number,
}

export interface Chip {
    reference: SupportedESP,
    layout: { n_side_pins: number, n_bottom_pins: number },
    interfaces: { type: InterfaceType, qnt?: number }[],
    blockedInterfaces?: { type: InterfaceType, number: number }[],
    analog: { adc: ADC[], },
    pins: Pin[]
}
const ncPin: Pin = {
    type: PinType.NC,
    label: "NC",
};
const gndPin: Pin = {
    type: PinType.GND,
    label: "GND",
};
const enPin: Pin = {
    type: PinType.SYS,
    label: "EN",
};
const vccPin: Pin = {
    type: PinType.VCC,
    label: "3v3",
};

const espC3: Chip = {
    reference: SupportedESP.ESP32_C3,
    layout: { n_side_pins: 11, n_bottom_pins: 13 },
    analog: { adc: [{ channel: [{ io: 0 }, { io: 1 }, { io: 2 }, { io: 3 }, { io: 4 }] }, { channel: [{ io: 5 }] }], },
    interfaces: [
        { type: InterfaceType.UART, qnt: 2 },
        { type: InterfaceType.SPI, qnt: 3 },
        { type: InterfaceType.I2C, qnt: 1 },
        { type: InterfaceType.I2S, qnt: 1 },
        { type: InterfaceType.USB, qnt: 1 },
        { type: InterfaceType.TWO_WIRE, qnt: 1 },
        { type: InterfaceType.LED_PWM, qnt: 6 },
        { type: InterfaceType.RMT, qnt: 2 },],
    blockedInterfaces: [{ type: InterfaceType.SPI, number: 0 }, { type: InterfaceType.SPI, number: 1 }],
    pins: [
        gndPin,
        gndPin,
        vccPin,
        ncPin,
        ncPin,
        { type: PinType.GPIO, label: "IO2", gpio: 2 },
        { type: PinType.GPIO, label: "IO3", gpio: 3 },
        enPin,
        ncPin,
        ncPin,
        gndPin,
        { type: PinType.GPIO, label: "IO0", gpio: 0 },
        { type: PinType.GPIO, label: "IO1", gpio: 1 },
        gndPin,
        ncPin,
        { type: PinType.GPIO, label: "IO10", gpio: 10 },
        ncPin,
        { type: PinType.GPIO, label: "IO4", gpio: 4 },
        { type: PinType.GPIO, label: "IO5", gpio: 5 },
        { type: PinType.GPIO, label: "IO6", gpio: 6 },
        { type: PinType.GPIO, label: "IO7", gpio: 7 },
        { type: PinType.GPIO, label: "IO8", gpio: 8 },
        { type: PinType.GPIO, label: "IO9", gpio: 9 },
        ncPin,
        ncPin,
        { type: PinType.GPIO, label: "IO18", gpio: 18 },
        { type: PinType.GPIO, label: "IO19", gpio: 19 },
        ncPin,
        ncPin,
        { type: PinType.GPIO, label: "UART0_RX", gpio: 20 },
        { type: PinType.GPIO, label: "UART0_TX", gpio: 21 },
        ncPin,
        ncPin,
        ncPin,
        ncPin,
    ]
};

export const modules: Chip[] = [espC3]
