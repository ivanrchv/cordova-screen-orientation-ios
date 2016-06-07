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
    listeners: [],
    registerWithIOS: function () {
        exec(null, null, 'IRRDeviceOrientation', 'registerNotification', [this.handleDeviceOrientation]);
    },
    deregisterWithIOS: function () {
        exec(null, null, 'IRRDeviceOrientation', 'unregisterNotification', [this.handleDeviceOrientation]);
    },
    handleDeviceOrientation: function (orientation) {
        deviceOrientation.currentOrientation = orientation;

        for (var i = 0; i < this.listeners.length; i++) {
            this.listeners[i](orientation);
        }
    }
};

deviceOrientation.addEventListener = function (callback) {
    _dvcOrientation.listeners.push(callback);
};

deviceOrientation.removeEventListener = function (listenerToFilter) {
    _dvcOrientation.listeners = _dvcOrientation.listeners.filter(function (listener) {
        return listener !== listenerToFilter;
    });
};



module.exports = deviceOrientation;