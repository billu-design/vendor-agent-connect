
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Shield, Smartphone, Globe } from "lucide-react";

const Settings = () => {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Settings</h1>
        
        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-primary" />
                  <CardTitle>Notifications</CardTitle>
                </div>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="new-contract" className="flex flex-col space-y-1">
                    <span>New Contracts</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Receive notifications when a new contract is created
                    </span>
                  </Label>
                  <Switch id="new-contract" defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="contract-updates" className="flex flex-col space-y-1">
                    <span>Contract Updates</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Get notified when contracts are modified
                    </span>
                  </Label>
                  <Switch id="contract-updates" defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="messages" className="flex flex-col space-y-1">
                    <span>Messages</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Receive notifications for new messages
                    </span>
                  </Label>
                  <Switch id="messages" defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-primary" />
                  <CardTitle>Appearance</CardTitle>
                </div>
                <CardDescription>Customize how the application looks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                    <span>Dark Mode</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Toggle between light and dark mode
                    </span>
                  </Label>
                  <Switch id="dark-mode" />
                </div>
                
                <div className="mt-6">
                  <Button variant="outline">Reset to Defaults</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle>Security</CardTitle>
                </div>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="two-factor" className="flex flex-col space-y-1">
                    <span>Two-Factor Authentication</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </span>
                  </Label>
                  <Switch id="two-factor" />
                </div>
                
                <Separator />
                
                <div className="mt-6 space-y-2">
                  <Button variant="outline">Change Password</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-5 w-5 text-primary" />
                  <CardTitle>Advanced Settings</CardTitle>
                </div>
                <CardDescription>Configure advanced settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="api-access" className="flex flex-col space-y-1">
                    <span>API Access</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Enable API access to your account
                    </span>
                  </Label>
                  <Switch id="api-access" />
                </div>
                
                <Separator />
                
                <div className="mt-6">
                  <Button variant="outline">Export Data</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Settings;
