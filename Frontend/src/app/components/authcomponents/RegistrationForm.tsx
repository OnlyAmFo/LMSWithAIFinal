"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { registrationSchema } from "@/app/@types/registration.schema";
import usePostData from "@/app/hooks/PostData";
import { ClipLoader } from "react-spinners";

export function RegistrationForm() {
  const [formData, setFormData] = useState<registrationSchema>({
    firstName: "",
    lastName: "",
    email: "",
    class: undefined,
    gender: "",
    password: "",
    confirmPassword: "",
    profile:undefined,
  });
  const [profile, setProfile] = useState<File | undefined>(undefined);
  const [previewProfile, setPreviewProfile] = useState<string>();
  const { postData, loading, result, responseError } = usePostData();

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  useEffect(() => {
    if (responseError) console.log(responseError);
    if (result) console.log(result);
  }, [result, responseError]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Handle number field for "class"
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getPreviewProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setProfile(file);
      setPreviewProfile(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData) return;

    const userData = new FormData();
    userData.append("firstName", formData.firstName);
    userData.append("lastName", formData.lastName);
    userData.append("email", formData.email);
    userData.append("gender", formData.gender);
    userData.append("password", formData.password);

    if (typeof formData.class !== "undefined") {
      userData.append("class", String(formData.class));
    }

    if (profile) {
      userData.append("profile", profile);
    }

    await postData("/auth/registration", userData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#FF8C5A] outline-0">Register</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <form encType="multipart/form-data" onSubmit={handleSubmit}>
          <DialogHeader className="mb-10">
            <DialogTitle>
              Register into <strong>codeskinnovations</strong>
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="fname">
                <span className="text-[red] text-xl">*</span> first name
              </Label>
              <Input
                id="fname"
                name="firstName"
                placeholder="enter first name"
                onChange={handleInput}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="lname">
                <span className="text-[red] text-xl">*</span> last name
              </Label>
              <Input
                id="lname"
                name="lastName"
                placeholder="enter last name"
                onChange={handleInput}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="email">
                <span className="text-[red] text-xl">*</span> email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="enter email"
                onChange={handleInput}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="gender">
                <span className="text-[red] text-xl">*</span> gender
              </Label>
              <Select
                name="gender"
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, gender: value }))
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="class">class</Label>
              <Input
                id="class"
                name="class"
                type="number"
                placeholder="enter class"
                onChange={handleInput}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="password">
                <span className="text-[red] text-xl">*</span> password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="enter password"
                onChange={handleInput}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="cpassword">
                <span className="text-[red] text-xl">*</span> confirm password
              </Label>
              <Input
                id="cpassword"
                name="confirmPassword"
                type="password"
                placeholder="enter password again"
                onChange={handleInput}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="profile">profile</Label>
              <Input
                id="profile"
                name="profile"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  getPreviewProfile(e);
                }}
              />
            </div>

            {previewProfile && (
              <div className="grid gap-2">
                <Label htmlFor="profile">Profile Preview:</Label>
                <div className="relative w-full max-w-xs aspect-square mx-auto overflow-hidden rounded-lg border border-gray-300">
                  <Image
                    src={previewProfile}
                    alt="Preview Profile"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="my-5 mt-10">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">
              {loading ? <ClipLoader size={15} /> : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
