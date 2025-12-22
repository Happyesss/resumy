'use client';

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, BellOff, CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import {
  requestNotificationPermission,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  isPushSubscribed,
} from "@/hooks/use-notifications";

export function NotificationSettings() {
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushPermission, setPushPermission] = useState<NotificationPermission>('default');
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);

  // Check push notification status
  useEffect(() => {
    const checkPushStatus = async () => {
      if ('Notification' in window) {
        setPushPermission(Notification.permission);
      }
      const subscribed = await isPushSubscribed();
      setPushEnabled(subscribed);
      setIsLoading(false);
    };
    checkPushStatus();
  }, []);

  // Handle toggle push notifications
  const handleTogglePush = useCallback(async (enabled: boolean) => {
    setIsToggling(true);
    
    try {
      if (enabled) {
        const permission = await requestNotificationPermission();
        setPushPermission(permission);
        
        if (permission === 'granted') {
          const success = await subscribeToPushNotifications();
          setPushEnabled(success);
        } else {
          setPushEnabled(false);
        }
      } else {
        const success = await unsubscribeFromPushNotifications();
        if (success) {
          setPushEnabled(false);
        }
      }
    } catch (error) {
      console.error('Failed to toggle push notifications:', error);
    } finally {
      setIsToggling(false);
    }
  }, []);

  const isSupported = 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;

  return (
    <Card className="bg-neutral-900 border-neutral-800">
      <CardHeader>
        <CardTitle className="text-lg text-white flex items-center gap-2">
          <Bell className="h-5 w-5 text-purple-400" />
          Push Notifications
        </CardTitle>
        <CardDescription className="text-slate-400">
          Receive browser notifications when someone views your shared resume
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isSupported ? (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
            <XCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-yellow-500">Not Supported</p>
              <p className="text-xs text-yellow-500/70">
                Push notifications are not supported in your browser.
              </p>
            </div>
          </div>
        ) : pushPermission === 'denied' ? (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
            <BellOff className="h-5 w-5 text-red-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-500">Notifications Blocked</p>
              <p className="text-xs text-red-500/70">
                You&apos;ve blocked notifications for this site. Please enable them in your browser settings.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications" className="text-sm text-white">
                  Resume View Notifications
                </Label>
                <p className="text-xs text-slate-400">
                  Get notified when someone views your shared resume
                </p>
              </div>
              <Switch
                id="push-notifications"
                checked={pushEnabled}
                onCheckedChange={handleTogglePush}
                disabled={isLoading || isToggling}
              />
            </div>

            {pushEnabled && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <p className="text-sm text-green-500">
                  Push notifications are enabled
                </p>
              </div>
            )}
          </div>
        )}

        {/* Notification types */}
        <div className="pt-4 border-t border-neutral-800">
          <h4 className="text-sm font-medium text-white mb-3">Notification Types</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">Resume Views</p>
                <p className="text-xs text-slate-500">When someone views your shared resume</p>
              </div>
              <Switch defaultChecked disabled={!pushEnabled} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">System Updates</p>
                <p className="text-xs text-slate-500">Important updates about your account</p>
              </div>
              <Switch defaultChecked disabled={!pushEnabled} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
