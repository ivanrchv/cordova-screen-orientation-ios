//
//  IRRDeviceOrientation.h
//
//  Created by Ivan Raychev on 6.06.16 г..
//
//

#import <Cordova/CDV.h>

@interface IRRDeviceOrientation : CDVPlugin

-(void)registerNotification:(CDVInvokedUrlCommand*)command;
-(void)unregisterNotification:(CDVInvokedUrlCommand*)command;

@end
