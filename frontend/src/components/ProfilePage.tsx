"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, MapPin, Link as LinkIcon, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfile } from '@/hooks/useProfile';

export function ProfilePage() {
  const { profile } = useProfile();

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="mt-8">
        <div className="relative mb-16">
          <div className="h-32 w-full rounded-lg bg-gradient-to-r bg-indigo-600" />
          <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2">
            <div className="relative">
              <Avatar className="h-20 w-20 border-2 border-white">
                <AvatarImage src="/api/placeholder/128/128" />
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1">
                <Camera className="h-4 w-4 text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-xl font-semibold">{profile?.name}</h1>
          </div>

          <div className="flex justify-between gap-4">
            <div className="text-center bg-white rounded-lg shadow-sm py-3 px-6">
              <p className="text-indigo-500 text-lg font-semibold">10</p>
              <p className="text-gray-500 text-sm">Projects</p>
            </div>
            <div className="text-center bg-white rounded-lg shadow-sm py-3 px-6">
              <p className="text-purple-600 text-lg font-semibold">5.2k</p>
              <p className="text-gray-500 text-sm">Tasks</p>
            </div>
            <div className="text-center bg-white rounded-lg shadow-sm py-3 px-6">
              <p className="text-purple-600 text-lg font-semibold">42</p>
              <p className="text-gray-500 text-sm">Following</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-3 text-gray-600">
              <Mail className="h-5 w-5 text-purple-500 shrink-0" />
              <span className="text-base">{profile?.email}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <MapPin className="h-5 w-5 text-purple-500 shrink-0" />
              <span className="text-base">San Francisco, CA</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <LinkIcon className="h-5 w-5 text-purple-500 shrink-0" />
              <span className="text-base">portfolio.design</span>
            </div>
            <div className="flex flex-col jutify-center items-center">
            <Button
            variant={"secondary"}
            className="bg-indigo-500 rounded-2xl max-w-lg"
            >
              Save
            </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
