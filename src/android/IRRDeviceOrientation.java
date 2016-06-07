/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

package nib.plugins.deviceorientation;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;

import org.json.JSONArray;
import org.json.JSONException;

import android.app.Activity;
import android.content.pm.ActivityInfo;
import android.util.Log;

import android.view;
import android.provider.Settings.System;
import org.apache.cordova.PluginResult;

public class IRRDeviceOrientation extends CordovaPlugin {

    private static final String TAG = "YoikScreenOrientation";

    /**
     * Screen Orientation Constants
     */

    private static final String UNLOCKED = "unlocked";
    private static final String PORTRAIT_PRIMARY = "portrait-primary";
    private static final String PORTRAIT_SECONDARY = "portrait-secondary";
    private static final String LANDSCAPE_PRIMARY = "landscape-primary";
    private static final String LANDSCAPE_SECONDARY = "landscape-secondary";

    private static final int THRESHOLD = 40;
    public static final int PORTRAIT = 0;
    public static final int LANDSCAPE = 270;
    public static final int REVERSE_PORTRAIT = 180;
    public static final int REVERSE_LANDSCAPE = 90;
    private int lastRotatedTo = 0;
    private OrientationEventListener orientationListener;

    private HashSet listeners = new HashSet();

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) {

        Log.d(TAG, "execute action: " + action);

        // Route the Action
        if (action.equals("registerNotification")) {
            return registerNotification(callbackContext);
        } else if (action.equals("checkRotationLock")) {
            return checkRotationLock(callbackContext);
        }

        // Action not found
        callbackContext.error("action not recognised");
        return false;
    }

    private boolean checkRotationLock(CallbackContext callbackContext) {
        Activity activity = cordova.getActivity();

        if (android.provider.Settings.System.getInt(activity.getContentResolver(), Settings.System.ACCELEROMETER_ROTATION, 0) == 1){
            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, "true"));
        }
        else{
            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, "false"));
        }

        return true;
    }

    private boolean registerNotification(CallbackContext callbackContext) {
        orientationListener.enable();
        listeners.add(callbackContext);
        return true;
    }

    @Override
    protected void pluginInitialize() {
        Activity main = cordova.getActivity();
        orientationListener = new OrientationEventListener(main, SensorManager.SENSOR_DELAY_NORMAL) {

        @Override
        public void onOrientationChanged(int orientation) {
                    int newRotateTo = lastRotatedTo;
                    if(orientation >= 360 + PORTRAIT - THRESHOLD && orientation < 360 || orientation >= 0 && orientation <= PORTRAIT + THRESHOLD) {
                        newRotateTo = 0;
                        PluginResult result = new PluginResult(PluginResult.Status.OK, PORTRAIT_PRIMARY);
                        result.setKeepCallback(true);
                    } else if(orientation >= LANDSCAPE - THRESHOLD && orientation <= LANDSCAPE + THRESHOLD) {
                        newRotateTo = 90;
                        PluginResult result = new PluginResult(PluginResult.Status.OK, LANDSCAPE_PRIMARY);
                        result.setKeepCallback(true);
                    }
                    else if(orientation >= REVERSE_PORTRAIT - THRESHOLD && orientation <= REVERSE_PORTRAIT + THRESHOLD) {
                        newRotateTo = 180;
                        PluginResult result = new PluginResult(PluginResult.Status.OK, PORTRAIT_SECONDARY);
                        result.setKeepCallback(true);
                    }
                    else if(orientation >= REVERSE_LANDSCAPE - THRESHOLD && orientation <= REVERSE_LANDSCAPE + THRESHOLD) {
                        newRotateTo = -90;
                        PluginResult result = new PluginResult(PluginResult.Status.OK, LANDSCAPE_SECONDARY);
                        result.setKeepCallback(true);
                    }

                    if(newRotateTo != lastRotatedTo) {
                        rotateButtons(lastRotatedTo, newRotateTo);
                        lastRotatedTo = newRotateTo;
                    }
                }
        };
    }
}
