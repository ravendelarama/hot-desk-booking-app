import React from 'react';

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
 
export function AccountSettings() {
    return (
        <div>
            <label className="font-bold text-3xl p-12" htmlFor="account settings">Account Settings</label>
            <div className="grid w-full max-w-sm items-center gap-1.5 p-12">
                <Label className="text-lg" htmlFor="email">Email</Label>
                <Input disabled type="email" id="email" placeholder="example@email.here" />
            </div>
    
            <div className="grid w-full max-w-sm items-center gap-1.5 p-12">
                <Label className="text-lg" htmlFor="password">Password</Label>
                <div className="flex w-full max-w-sm items-center space-x-3">
                    <Input disabled type="password" placeholder="" />
                    <Button variant="default" >Reset Password</Button>
                </div>
            </div>
        </div>
    );
}

