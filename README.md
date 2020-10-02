# Bike-Simulator-Svelte

## How to use it

### Windows/MacOs/Chrome OS/Android

1. Go to [policumbent.it/whpsc-sim](https://www.policumbent.it/whpsc-sim/)
2. Connect your bluetooth powermeter. (This functionality is available only in Google Chrome 83+)
3. Start a new run

### Linux

1. How you can see [here](https://github.com/WebBluetoothCG/web-bluetooth/blob/gh-pages/implementation-status.md), Linux version of bluettoth API are partially implemented and not supported. So you need to enable `chrome://flags/#enable-experimental-web-platform-features`.
1. Go to [policumbent.it/whpsc-sim](https://www.policumbent.it/whpsc-sim/)
1. Connect your bluetooth powermeter. (This functionality is available only in Google Chrome 83+ and on linux may not work)
1. Start a new run

## Requirements

- *Android*: Requires Android 6.0 Marshmallow or later.
- *Mac*: Requires OS X Yosemite or later. (Some MacBooks may not work: Check "About this Mac" / "System Report" / "Bluetooth" and verify that Low Energy is supported.)
- *Linux*: Requires Kernel 3.19+ and BlueZ 5.41+ installed. Read How to get Chrome Web Bluetooth working on Linux.(Note that Bluetooth daemon needs to run with experimental interfaces if BlueZ version is lower than 5.43: sudo /usr/sbin/bluetoothd -E)
- *Windows*: Requires Windows 10 version 1706 (Creators Update) or later.
