"use client"
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, MapPin, Link, Calendar, Camera, Plus, Users, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfile } from '@/hooks/useProfile';

 export function ProfilePage () {
const {profile} = useProfile()
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-b from-purple-500 to-purple-600 h-48 relative">
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
          <div className="relative">
            <Avatar className="w-32 h-32 border-4 border-white">
              <AvatarImage src="/api/placeholder/128/128" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-0 right-0 rounded-full bg-white hover:bg-gray-100"
            >
              <Camera className="w-4 h-4 text-purple-600" />
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-20 px-4 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">{profile?.given_name} {profile?.family_name} </h1>
          <p className="text-gray-500">Product Designer</p>
        </div>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-3 text-gray-600">
              <Mail className="w-5 h-5 text-purple-500" />
              <span>jane.cooper@example.com</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <MapPin className="w-5 h-5 text-purple-500" />
              <span>San Francisco, CA</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Link className="w-5 h-5 text-purple-500" />
              <span>portfolio.design</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-white p-4 text-center">
            <p className="text-xl font-semibold text-purple-600">124</p>
            <p className="text-sm text-gray-500">Projects</p>
          </Card>
          <Card className="bg-white p-4 text-center">
            <p className="text-xl font-semibold text-purple-600">5.2k</p>
            <p className="text-sm text-gray-500">Followers</p>
          </Card>
          <Card className="bg-white p-4 text-center">
            <p className="text-xl font-semibold text-purple-600">42</p>
            <p className="text-sm text-gray-500">Following</p>
          </Card>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex justify-around items-center">
          <Button variant="ghost" size="icon" className="text-purple-600">
            <Calendar className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400">
            <Mail className="w-6 h-6" />
          </Button>
          <Button
            className="rounded-full bg-purple-600 hover:bg-purple-700 -mt-8 shadow-lg"
            size="icon"
          >
            <Plus className="w-6 h-6 text-white" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400">
            <Users className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400">
            <Settings className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};
