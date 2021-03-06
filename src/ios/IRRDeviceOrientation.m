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

#import "IRRDeviceOrientation.h"

@interface IRRDeviceOrientation()

@property (strong, nonatomic) NSString *callbackId;

@end

@implementation IRRDeviceOrientation

-(void)registerNotification:(CDVInvokedUrlCommand *)command
{
    self.callbackId = command.callbackId;
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(orientationChanged:) name:UIDeviceOrientationDidChangeNotification object:nil];
}

-(void)unregisterNotification:(CDVInvokedUrlCommand *)command
{
    self.callbackId = nil;
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)orientationChanged:(NSNotification *)notification{
    UIDeviceOrientation orientation = [[UIDevice currentDevice] orientation];
    CDVPluginResult* pluginResult = nil;
    
    switch (orientation) {
        case UIDeviceOrientationPortrait: {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"portrait-primary"];
        }
            break;
        case UIDeviceOrientationPortraitUpsideDown: {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"portrait-secondary"];
        }
            break;
        case UIDeviceOrientationLandscapeLeft: {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"landscape-primary"];
        }
            break;
        case UIDeviceOrientationLandscapeRight: {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"landscape-secondary"];
        }
            break;
        default: {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"unknown"];
        }
            break;
    }
    pluginResult.keepCallback = @(YES);
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.callbackId];
}

-(void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

@end
