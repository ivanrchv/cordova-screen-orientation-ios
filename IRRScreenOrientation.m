//
//  IRRScreenOrientation.m
//
//  Created by Ivan Raychev on 6.06.16 г..
//
//

#import "IRRScreenOrientation.h"

@interface IRRScreenOrientation()

@property (strong, nonatomic) NSString *callbackId;

@end

@implementation IRRScreenOrientation

-(void)registerNotification:(CDVInvokedUrlCommand *)command
{
    self.callbackId = command.callbackId;
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
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.callbackId];
}

-(void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

@end
