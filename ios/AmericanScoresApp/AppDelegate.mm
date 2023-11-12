#import <Firebase.h>
#import <FirebaseAuth/FirebaseAuth.h>
#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>

//@interface AppDelegate ()
//
//@property (nonatomic, strong) NSDictionary *launchOptions;
//
//@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
//  if ([FIRApp defaultApp] == nil) {
    [FIRApp configure];
//  }
  self.moduleName = @"main";
//  self.launchOptions = launchOptions;
//  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
