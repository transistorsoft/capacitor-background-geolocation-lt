Background Geolocation for Capacitor &middot; [![npm](https://img.shields.io/npm/dm/@transistorsoft/capacitor-background-geolocation.svg)]() [![npm](https://img.shields.io/npm/v/@transistorsoft/capacitor-background-geolocation.svg)]()
============================================================================

[![](https://dl.dropboxusercontent.com/s/nm4s5ltlug63vv8/logo-150-print.png?dl=1)](https://www.transistorsoft.com)

-------------------------------------------------------------------------------

The *most* sophisticated background **location-tracking & geofencing** module with battery-conscious motion-detection intelligence for **iOS** and **Android**.

The plugin's [Philosophy of Operation](../../wiki/Philosophy-of-Operation) is to use **motion-detection** APIs (using accelerometer, gyroscope and magnetometer) to detect when the device is *moving* and *stationary*.

- When the device is detected to be **moving**, the plugin will *automatically* start recording a location according to the configured `distanceFilter` (meters).

- When the device is detected be **stationary**, the plugin will automatically turn off location-services to conserve energy.

Also available for [Flutter](https://github.com/transistorsoft/flutter_background_geolocation), [Cordova](https://github.com/transistorsoft/cordova-background-geolocation-lt), and [React Native](https://github.com/transistorsoft/capacitor-background-geolocation).

----------------------------------------------------------------------------

The **[Android module](http://www.transistorsoft.com/shop/products/capacitor-background-geolocation)** requires [purchasing a license](http://www.transistorsoft.com/shop/products/capacitor-background-geolocation).  However, it *will* work for **DEBUG** builds.  It will **not** work with **RELEASE** builds [without purchasing a license](http://www.transistorsoft.com/shop/products/capacitor-background-geolocation).

(2018) This plugin is supported **full-time** and field-tested **daily** since 2013.

----------------------------------------------------------------------------

[![Google Play](https://dl.dropboxusercontent.com/s/80rf906x0fheb26/google-play-icon.png?dl=1)](https://play.google.com/store/apps/details?id=com.transistorsoft.backgroundgeolocation.react)

![Home](https://dl.dropboxusercontent.com/s/wa43w1n3xhkjn0i/home-framed-350.png?dl=1)
![Settings](https://dl.dropboxusercontent.com/s/8oad228siog49kt/settings-framed-350.png?dl=1)

# Contents
- ### :books: [API Documentation](https://transistorsoft.github.io/capacitor-background-geolocation)
- ### [Installing the Plugin](#large_blue_diamond-installing-the-plugin)
- ### [Setup Guides](#large_blue_diamond-setup-guides)
- ### [Configure your License](#large_blue_diamond-configure-your-license)
- ### [Using the plugin](#large_blue_diamond-using-the-plugin)
- ### [Example](#large_blue_diamond-example)
- ### [Debugging](../../wiki/Debugging)
- ### [Demo Application](#large_blue_diamond-demo-application)
- ### [Testing Server](#large_blue_diamond-simple-testing-server)
- ### [Privacy Policy](help/PRIVACY_POLICY.md)

## :large_blue_diamond: Installing the Plugin

### With `yarn`

```bash
yarn add @transistorsoft/capacitor-background-geolocation
```

### With `npm`
```
$ npm install @transistorsoft/capacitor-background-geolocation --save
```

## :large_blue_diamond: Setup Guides

### iOS
- [Required iOS Setup](help/INSTALL-IOS.md)

### Android
- [Required Android Setup](help/INSTALL-ANDROID.md)


## :large_blue_diamond: Configure your license

1. Login to Customer Dashboard to generate an application key:
[www.transistorsoft.com/shop/customers](http://www.transistorsoft.com/shop/customers)
![](https://gallery.mailchimp.com/e932ea68a1cb31b9ce2608656/images/b2696718-a77e-4f50-96a8-0b61d8019bac.png)

2. Add your license-key to `android/app/src/main/AndroidManifest.xml`:

```diff
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.transistorsoft.backgroundgeolocation.react">

  <application
    android:name=".MainApplication"
    android:allowBackup="true"
    android:label="@string/app_name"
    android:icon="@mipmap/ic_launcher"
    android:theme="@style/AppTheme">

    <!-- capacitor-background-geolocation licence -->
+     <meta-data android:name="com.transistorsoft.locationmanager.license" android:value="YOUR_LICENCE_KEY_HERE" />
    .
    .
    .
  </application>
</manifest>
```

## :large_blue_diamond: Using the plugin ##

```javascript
import BackgroundGeolocation from "@transistorsoft/capacitor-background-geolocation";
```

- You can also optionally `import` interfaces:
```javascript
import BackgroundGeolocation, {
  State,
  Config,
  Location,
  LocationError,
  Geofence,
  HttpEvent,
  MotionActivityEvent,
  ProviderChangeEvent,
  MotionChangeEvent,
  GeofenceEvent,
  GeofencesChangeEvent,
  HeartbeatEvent,
  ConnectivityChangeEvent,
  DeviceSettings,
  DeviceSettingsRequest,
  SQLQuery,
  Authorization, AuthorizationEvent,
  DeviceInfo,
  TransistorAuthorizationToken
} from "@transistorsoft/capacitor-background-geolocation";
```

## :large_blue_diamond: Example

There are three main steps to using `BackgroundGeolocation`
1. Wire up event-listeners.
2. `#ready` the plugin.
3. `#start` the plugin.

```javascript
// Import BackgroundGeolocation + any optional interfaces
import BackgroundGeolocation from "@transistorsoft/capacitor-background-geolocation";

export class HomePage {

  async ionViewWillEnter() {
    ////
    // 1.  Wire up event-listeners
    //

    // This handler fires whenever bgGeo receives a location update.
    BackgroundGeolocation.onLocation((location) => {
      console.log('[onLocation]', location);
    }, ((error) => {  // <-- Location errors
      console.log('[onLocation] ERROR:', error);
    });

    // This handler fires when movement states changes (stationary->moving; moving->stationary)
    BackgroundGeolocation.onMotionChange((location) => {
      console.log('[onMotionChange]', location);
    });

    // This event fires when a change in motion activity is detected
    BackgroundGeolocation.onActivityChange((event) => {
      console.log('[onActivityChange]', event);
    });

    // This event fires when the user toggles location-services authorization
    BackgroundGeolocation.onProviderChange((event) => {
      console.log('[onProviderChange]', event);
    });

    // See the API docs for a list of all available events -- there are a total of 13 events.

    ////
    // 2.  Execute #ready method (required)
    //
    BackgroundGeolocation.ready({
      // Geolocation Config
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 10,
      // Activity Recognition
      stopTimeout: 1,
      // Application config
      debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false,   // <-- Allow the background-service to continue tracking when user closes the app.
      startOnBoot: true,        // <-- Auto start tracking when device is powered-up.
      // HTTP / SQLite config
      url: 'http://yourserver.com/locations',
      batchSync: false,       // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
      autoSync: true,         // <-- [Default: true] Set true to sync each location to server as it arrives.
      headers: {              // <-- Optional HTTP headers
        "X-FOO": "bar"
      },
      params: {               // <-- Optional HTTP params append to each HTTP request
        "auth_token": "maybe_your_server_authenticates_via_token_YES?"
      },
      extras: {               // <-- Optional meta-data appended to each recorded location.
        "foo": "bar"
      }
    }).then((state) => {
      console.log("BackgroundGeolocation is configured and ready to use ", state.enabled);

      if (!state.enabled) {
        ////
        // 3. Start tracking!
        //
        BackgroundGeolocation.start().then(() => {
          console.log("[start] success");
        });
      }
    }).catch((error) => {
      console.warn('[BackgroundGeolocation ready] ERROR: ', error);
    });
  }
}

```

:warning: Do not execute *any* API method which will require accessing location-services until the callback to **`#ready`** executes (eg: `#getCurrentPosition`, `#watchPosition`, `#start`).

### Promise API

The `BackgroundGeolocation` Javascript API supports [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) for *nearly* every method (the exceptions are **`#watchPosition`** and adding event-listeners via **`onXXX`** methods (eg: `onLocation`, `onProviderChange`).  For more information, see the [API Documentation](https://transistorsoft.github.io/capacitor-background-geolocation)


## :large_blue_diamond: [Demo Application](./example)

A fully-featured [Demo App](./example) is available in this repo.  After first cloning this repo, follow the installation instructions in the [README](./example/README.md) there.  This demo-app includes an advanced settings-screen allowing you to quickly experiment with all the different settings available for each platform.

![Home](https://dl.dropboxusercontent.com/s/wa43w1n3xhkjn0i/home-framed-350.png?dl=1)
![Settings](https://dl.dropboxusercontent.com/s/8oad228siog49kt/settings-framed-350.png?dl=1)


## :large_blue_diamond: [Simple Testing Server](https://github.com/transistorsoft/background-geolocation-console)

A simple Node-based [web-application](https://github.com/transistorsoft/background-geolocation-console) with SQLite database is available for field-testing and performance analysis.  If you're familiar with Node, you can have this server up-and-running in about **one minute**.

![](https://dl.dropboxusercontent.com/s/px5rzz7wybkv8fs/background-geolocation-console-map.png?dl=1)

![](https://dl.dropboxusercontent.com/s/tiy5b2oivt0np2y/background-geolocation-console-grid.png?dl=1)

# License

The MIT License (MIT)

Copyright (c) 2018 Chris Scott, Transistor Software

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


