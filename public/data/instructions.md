## About

Welcome to the virtual World Human Powered Speed Challenge. Normally, when there is no world wide pandemic going on, we organise a yearly race in the desert of Nevada. Just outside of the town called Battle Mountain lies one of the straightest sections of road that we could find. On this road we race bikes, solely on human power, and in this event bikes regularly break the Nevada speed limit!
[More on the event](http://www.ihpva.org/) → link to IPHVA & WHPSC

This simulator allows you to run the course of the actual event. Simply connect your smart trainer or power meter to this application, get dressed, get warmed up and race! You can try different tactics and different bicycle settings to see which is the quickest result.

## WHPSC

The event is held on a section of State Road 305 just outside of Battle Mountain, Nevada. During the event the road is closed for other traffic. The event starts with a 5 mile (8 km) stretch of road to build up speed. After 5 miles (8 km) there is a section that is exactly 200 meters (0.12 miles) in which your speed is measured. After this section you have around 1 mile (1.6 km) to slow down and the end of this you will see our cathers teams. 

To learn more about the event click [here](https://www.policumbent.it/en/home-en/#section-2958)

## Connecting 

### Bluetooth
This application uses a connection to your bluetooth power meter or smart trainer. This functionality is only available on Google Chrome 83+. Download the latest version here: https://www.google.com/intl/en_en/chrome/

#### Windows/MacOS/Android

1. Go to [policumbent.it/whpsc-sim](https://policumbent.it/whpsc-sim)
1. Connect your bluetooth power meter. 
1. Start a new run

#### Linux

1. On the Linux version of Chrome the bluetooth API is partially implemented (see here). Please enable: chrome://flags/#enable-experimental-web-platform-features.
1. Go to [policumbent.it/whpsc-sim](https://policumbent.it/whpsc-sim)
1. Connect your bluetooth power meter. 
1. Start a new run

### ANT+

#### Windows

1. First time
    1. Insert the ANT+ dongle
    1. Download [Zadig](https://zadig.akeo.ie/)
    1. Click on `Options` and then on `List All Devices`
    1. Select `ANT USBStick2`
    1. Select `libusb-win32 (v1.2.6.0)`
    1. Click on `Reinstall Driver`
1. Download last version of standalone application from [here](https://github.com/policumbent/WHPSC-Sim/releases)
1. Insert the ANT+ dongle
1. Start app and connect your ANT+ power meter

#### Linux/MacOS

1. Download last version of standalone application from [here](https://github.com/policumbent/WHPSC-Sim/releases)
1. Insert the ANT+ dongle
1. Start app and connect your ANT+ power meter

## Settings

You can further tweak and customise the simulator by modifying the following settings.

- **Rider weight:** This influences the rider’s dissipated energy by rolling resistance.

- **Rider height:** This influences your air resistance on non streamlined bicycles. 

- **Air density:** Decreasing the air density makes your bike go faster. In the real world you can achieve this by going to higher altitudes. Of course going to zero would be impossible as you then could not breathe. 

When you modify the following settings these will be used when you start the race with a custom streamliner.

- **Bike weight:** *(default : 30 kg)*
	Used to calculate rolling resistance (todo also used to calculate the contribution of the slope)

- **Wheels inertia:** *(default 0.09)* How long do your wheels keep rolling and how difficult is it to start the wheels rolling. Setting a lower value here allows your wheels to spin up faster, but they will also spin down faster. When you select a high value it will be more difficult to get the bike off the line.

- **Efficiency:** *(default : 0.95)* This is the efficiency of the drivetrain of the bicycle. Set a higher value to better convert your input power into speed. 

- **Wheels circumference** *(default : 1.45)* This allows you to simulate smaller and larger wheels. Larger wheels have a lower rolling resistance. 

- **Area:** *(default : 0.3m2)* This setting controls the frontal area of your bike. The smaller your frontal area is, the faster your bike will be. Of course in the real world your bike size is controlled by many more things than a simple slider. The most important one of course is … you! Will you actually fit a bike with a frontal area of 0.01 m²?

- **Cd @ 120 km/h** *(default : 0.05)* This is the drag coefficient of your custom bike. A lower drag coefficient is largely a result of a better streamlined bike. Bicycles that run at Battle mountain are really well designed for low drag coefficients. As a comparison a regular road cyclist has a Cd of 0.37 and a typical fast car around 0.25 to 0.32! The total coefficient of a Battle Mountain racer is typically about the same as the drag coefficient of a single car mirror! 

Click **Save** to save your settings locally. When you now start a race these settings will be used to calculate your speed. 

## Starting a race
After you have connected your bluetooth power meter or smart trainer you can click on ‘start’ to start a race. This will let you choose some presets we have made for you:

- **Taurus:** this is a simulation of a really fast streamlined recumbent in the class as we race it at Battle Mountain. Select this one for the highest speeds!
- **Recumbent bike:** this is a simulation of a more regular recumbent fast bike. It will still be faster than a road bike, but not nearly as fast as Taurus!
- **Road bicycle:** this is a simulation with a road racing bicycle. It will still be faster (probably) than you are used to, since at Battle Mountain you are at 1400 meters altitude. 
- **Custom:** uses the settings you have set under the custom options. Play around with the different parameters to discover what make you go really fast!

When you have selected your bike you will see a view from the bike at the State Road 305. Get ready to start after the countdown and push hard to start!

During the race you will see signs indicating the miles to the 200 meters start. When you come closer to the start of the 200 meter you will see signs every half mile. At 1500 meters before the 200 meter start you will also see a countdown in your ‘virtual’ display. Use this to determine the optimal point to start your full power sprint. 

After the 200 meters normally you would stop pedalling and start to slowly brake, so you will not overheat your brakes or rims. You have about a mile to slow down where you will see your catching team to catch your bike and release from it. To slow you down we have simulated a hill that starts just after the 200 meter. Normally this hill is not there on the actual course. 
Finishing a race
After you have finished the race you will be presented with a window to enter your details for the results list. This is not obligated, however if you want to brag to your friends you better put something in here! You can use any name that you want, please play nice!
The one thing that is obligated, mainly to prevent abuse, is to enter a real email address. We will send you an email at this address with a link that you need to click to publish your results. We will not abuse or publish this mail address (see our privacy policy : link to it)

Once your results are published you can also share them on Facebook or Instagram. So please use these to share your results and get more people in the know about our event! 

Now take a well deserved rest and…. try again!

## Requirements

- **Android:** Requires Android 6.0 Marshmallow or later.
- **Mac:** Requires OS X Yosemite or later. (Some MacBooks may not work: Check "About this Mac" / "System Report" / "Bluetooth" and verify that Low Energy is supported.)
- **Linux:** Requires Kernel 3.19+ and BlueZ 5.41+ installed. Read How to get Chrome Web Bluetooth working on Linux.(Note that Bluetooth daemon needs to run with experimental interfaces if BlueZ version is lower than 5.43: sudo /usr/sbin/bluetoothd -E)
- **Windows:** Requires Windows 10 version 1706 (Creators Update) or later.
- **IOS and ipadOS:** Not supported at this time

