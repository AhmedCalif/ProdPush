"use client"
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, MapPin, Link, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfile } from '@/hooks/useProfile';

export function ProfilePage() {
  const { profile } = useProfile()

  return (
    <div className="container mx-auto py-8 mt-8">
      <div className="relative mb-8">
        <div className="h-48 rounded-lg bg-gradient-to-r bg-black to-purple-600" />
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-16">
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-white">
              <AvatarImage src="/api/placeholder/128/128" />
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-0 right-0 rounded-full bg-white hover:bg-gray-100"
            >
              <Camera className="h-4 w-4 text-purple-600" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-20 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">{profile?.name}</h1>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-xl font-semibold text-purple-600">10</p> {/*// TODO: Make Project Data Real  */}
              <p className="text-sm text-gray-500">Projects</p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-xl font-semibold text-purple-600">5.2k</p>    {/*// TODO: Make Tasks Data Real  */}
              <p className="text-sm text-gray-500">Tasks</p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-xl font-semibold text-purple-600">42</p>
              <p className="text-sm text-gray-500">Following</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3 text-gray-600">
              <Mail className="h-5 w-5 text-purple-500" />
              <span>{profile?.email}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <MapPin className="h-5 w-5 text-purple-500" />
              <span>San Francisco, CA</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Link className="h-5 w-5 text-purple-500" />
              <span>portfolio.design</span>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
  );
}
