//
//  IRRScreenOrientation.h
//
//  Created by Ivan Raychev on 6.06.16 г..
//
//

#import <Cordova/CDV.h>

@interface IRRScreenOrientation : CDVPlugin

-(void)registerNotification:(CDVInvokedUrlCommand*)command;
-(void)unregisterNotification:(CDVInvokedUrlCommand*)command;

@end
