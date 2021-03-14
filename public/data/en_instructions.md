*Click [here](https://youtu.be/N9bM0_JU3bI?t=61) to watch video tutorial!*

## About

Welcome to the virtual World Human Powered Speed Challenge. Normally, when no world wide pandemic is going on, we organise a yearly race in the desert of Nevada. Just outside the town called Battle Mountain lies one of the straightest sections of road that can be found. There we race with bikes, solely relying on human power, and during the event bikes regularly break the Nevada speed limit!
[More on the event](http://www.ihpva.org/)

This simulator allows you to run on the path of the actual event. Simply connect your smart trainer or power meter to this application, get dressed, get warmed up and race! You can try different tactics and different bicycle settings to see which makes for the quickest run.

## WHPSC

The event is held on a section of State Road 305, just outside Battle Mountain, Nevada. During the event the road is closed to traffic. The event starts with a 5 miles (8 km) strip of road to build up speed, followed by exactly 200 meters (0.12 miles) during which your speed is measured. After this section you have around 1 mile (1.6 km) to slow down and at the end of this you will see our catchers teammates.

To learn more about the event click [here](https://www.policumbent.it/en/whpsc/)

## Connecting

### Bluetooth

This application uses a connection to your bluetooth power meter or smart trainer. This functionality is only available on Google Chrome 83+. Download the latest version here: [https://www.google.com/intl/en_en/chrome/](https://www.google.com/intl/en_en/chrome/)

*If you have a slow internet connection we suggest you to download the standalone version from [here](https://github.com/policumbent/WHPSC-Sim/releases)*

#### Windows/MacOS/Android

1. Go to [whpsc-sim.policumbent.it](https://whpsc-sim.policumbent.it/)
1. Connect your bluetooth power meter.
1. Start a new run

#### Linux

1. On the Linux version of Chrome the bluetooth API is partially implemented ([see here](https://github.com/WebBluetoothCG/web-bluetooth/blob/gh-pages/implementation-status.md)). Please enable: `chrome://flags/#enable-experimental-web-platform-features`.
1. Go to [whpsc-sim.policumbent.it](https://whpsc-sim.policumbent.it/)
1. Connect your bluetooth power meter.
1. Start a new run

### ANT+

#### Windows

1. First time
    1. Insert the ANT+ dongle
    1. Download [Zadig](https://zadig.akeo.ie/)
    1. Open Zadig
    1. Click on `Options` and then on `List All Devices`
    1. Select `ANT USBStick2`
    1. Select `libusb-win32 (v1.2.6.0)`
    1. Click on `Replace Driver` or `Downgrade Driver`
1. Download last version of standalone application from [here](https://github.com/policumbent/WHPSC-Sim/releases)
1. Insert the ANT+ dongle
1. Start app and connect your ANT+ power meter

*If you need a detailed explanation, you can read [our tutorial with images](./windows-driver.html).*

#### Linux/MacOS

1. Download last version of standalone application from [here](https://github.com/policumbent/WHPSC-Sim/releases)
1. Insert the ANT+ dongle
1. Start app and connect your ANT+ power meter

**For any problem or question contact [softwarer@policumbent.it](mailto:software@policumbent.it).**

## Starting a race

When you have connected your power meter or smart trainer you can click on `start` to start a race. This will let you choose some presets we have made for you:

- **Taurus:** this is a simulation of a really fast streamlined recumbent bike from the category we race in at Battle Mountain. Select this one for the highest speeds!
- **Recumbent bike:** this is a simulation of a more regular recumbent fast bike. It will still be faster than a road bike, but not nearly as fast as Taurus!
- **Road bicycle:** this is a simulation with a road racing bicycle. It will still be faster (probably) than you are used to, since at Battle Mountain you are at 1400 meters altitude.
- **Custom:** uses the settings you have set in the custom options. Play around with the different parameters to discover what makes you go really fast!

When you are done with the set up you will see a view from the bike at the State Road 305. Get ready to start after the countdown and push hard to start!

During the first part of the track you’ll see some road signs (on the right) stating, by steps of half a mile, the distance to cover up to the finish line; the final kilometre is measured in meters, so you’ll see the 1 mile sign followed by the 1000, 500, 200 metre signs.  Moreover, on your digital display, you’ll have a virtual countdown of the final 1500 m. Use this to determine the optimal point to start your full power sprint.

After the final 200 meters you would normally stop pedalling and start to brake (but slowly, in order not to overheat your brakes or rims). You have about a mile to slow down after which you will see your catching team ready to catch your bike and release you from it. To slow you down we have simulated a breaking force based on your speed that starts just after the final 200 meter.

## Finishing a race

After you have finished the race you will be presented with a window to enter your details for the results list. This is not compulsory, however if you want to brag to your friends you better put something in here! You can use any name that you want, please play nice! The one thing that is mandatory though, mainly to prevent abuse, is to enter a real email address. We will send you an email at this address with a link that you need to click on to publish your results. We will not abuse or publish this mail address [see our privacy policy](https://www.policumbent.it/whpsc-sim/GDPR.html).

Once your results are published you can also share them on Facebook or Instagram. So please use these to share your results and get more people to know about our event!

Now take a well deserved rest and…. try again!

## Settings

You can further tweak and customise the simulator by modifying the following settings.

- **Rider weight:** This influences the rider’s dissipated energy by rolling resistance and is used to calculate the contribution of the slope.

- **Rider height:** This influences your air resistance on non streamlined bicycles.

- **Altitude/Temperature/Humidity:** These influences air density. Decreasing the air density makes your bike go faster. In the real world you can achieve this by going to higher altitudes. Of course going to zero would be impossible as then you could not breathe.(Battle Mountain values: altitude 1400m, temperature 25°C, humidity 30%)

When modifying the following parameters, they will be set to be used when you start the race with a `custom streamliner`.

- **Bike weight:** *(default : 30 kg)* It's used to calculate dissipated energy by rolling resistance and to calculate the contribution of the slope.

- **Wheels inertia:** *(default 0.09)* Influences how long your wheels keep rolling and how difficult it is to start the wheels rolling. Setting a lower value here allows your wheels to spin up faster, but they will also spin down faster. When you select a high value it will be more difficult to get the bike off the line.

- **Efficiency:** *(default : 0.95)* This is the efficiency of the drivetrain of the bicycle. Set a higher value to better convert your input power into speed.

- **Wheels circumference** *(default : 1.45)* This allows you to simulate smaller and larger wheels. Larger wheels have a lower rolling resistance.

- **Frontal Area:** *(default : 0.3m²)* This setting controls the frontal area of your bike. The smaller your frontal area is, the faster your bike will be. Of course in the real world your bike size is controlled by many more things than a simple slider. The most important one of course is … you! Will you actually fit a bike with a frontal area of 0.01 m²?

- **Cd @ 120 km/h** *(default : 0.05)* This is the drag coefficient of your custom bike. A lower drag coefficient is largely a result of a better streamlined bike. Bicycles that run at Battle mountain are really well designed for low drag coefficients. As a comparison a regular road cyclist has a Cd of 0.67 and a typical fast car around 0.25 to 0.32! The total coefficient of a Battle Mountain racer is typically about the same as the drag coefficient of a single car mirror!

Click **Save** to save your settings locally, so that when you start a race with yoour custom bike these settings will be used to calculate your speed.

## Requirements

- **Android:** Requires Android 6.0 Marshmallow or later.
- **Mac:** Requires OS X Yosemite or later. (Some MacBooks may not work: Check "About this Mac" / "System Report" / "Bluetooth" and verify that Low Energy is supported.)
- **Linux:** Requires Kernel 3.19+ and BlueZ 5.41+ installed. Read How to get Chrome Web Bluetooth working on Linux.(Note that Bluetooth daemon needs to run with experimental interfaces if BlueZ version is lower than 5.43: sudo /usr/sbin/bluetoothd -E)
- **Windows:** Requires Windows 10 version 1706 (Creators Update) or later.
- **IOS and ipadOS:** Not supported at this time
