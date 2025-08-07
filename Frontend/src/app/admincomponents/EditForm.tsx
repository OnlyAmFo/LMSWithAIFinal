"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
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
import usePostData from "@/app/hooks/PostData";
import { ClipLoader } from "react-spinners";

export function EditForm({user}:{user:any}) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    class: undefined,
    gender: "",
  });
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData) return;

    if (typeof formData.class === "undefined") {
      delete formData.class;
    }

    await postData(`/user/uupdate-user/${user?.id}`, formData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className=" outline-0">Edit </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="mb-10">
            <DialogTitle>
              update <strong>user</strong>
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
                defaultValue={user.firstName}
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
                defaultValue={user.lastName}
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
                defaultValue={user.email}
                onChange={handleInput}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="gender">
                <span className="text-[red] text-xl">*</span> gender
              </Label>
              <Select
                name="gender"
                defaultValue={user.gender}
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
                defaultValue={user.class && user.class}
                onChange={handleInput}
              />
            </div>
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
