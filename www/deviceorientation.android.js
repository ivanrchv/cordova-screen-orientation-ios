cordova.define("cordova-device-orientation-listener.deviceorientation.android", function(require, exports, module) { /*
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

    var exec = require('cordova/exec');
    var deviceOrientation = typeof deviceOrientation != 'undefined' ? deviceOrientation : {};

    var _dvcOrientation = {
        isRegisteredWithAndroid: false,
        listeners: [],
        registerWithAndroid: function () {
            this.isRegisteredWithAndroid = true;
            exec(this.handleDeviceOrientation, null, 'IRRDeviceOrientation', 'registerNotification', []);
        },
        deregisterWithAndroid: function () {
            this.isRegisteredWithAndroid = false;
            exec(null, null, 'IRRDeviceOrientation', 'unregisterNotification', []);
        },
        handleDeviceOrientation: function (orientation) {
            deviceOrientation.currentOrientation = orientation;

            for (var i = 0; i < _dvcOrientation.listeners.length; i++) {
                _dvcOrientation.listeners[i](orientation);
            }
        }
    };

    deviceOrientation.addEventListener = function (callback) {
        if (!_dvcOrientation.isRegisteredWithAndroid) {
            _dvcOrientation.registerWithAndroid();
        }
        _dvcOrientation.listeners.push(callback);
    };

    deviceOrientation.removeEventListener = function (listenerToFilter) {
        _dvcOrientation.listeners = _dvcOrientation.listeners.filter(function (listener) {
            return listener !== listenerToFilter;
        });

        if (_dvcOrientation.listeners.length == 0) {
            _dvcOrientation.deregisterWithAndroid();
        }
    };



    module.exports = deviceOrientation;
});

