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

var exec = require('cordova/exec');
var deviceOrientation = typeof deviceOrientation != 'undefined' ? deviceOrientation : {};

var _dvcOrientation = {
    isRegisteredWithIOS: false,
    listeners: [],
    registerWithIOS: function () {
        this.isRegisteredWithIOS = true;
        exec(this.handleDeviceOrientation, null, 'IRRDeviceOrientation', 'registerNotification', []);
    },
    deregisterWithIOS: function () {
        this.isRegisteredWithIOS = false;
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
    if (!_dvcOrientation.isRegisteredWithIOS) {
        _dvcOrientation.registerWithIOS();
    }
    _dvcOrientation.listeners.push(callback);
};

deviceOrientation.removeEventListeners = function () {
    _dvcOrientation.listeners = [];
    _dvcOrientation.deregisterWithIOS();
};



module.exports = deviceOrientation;
