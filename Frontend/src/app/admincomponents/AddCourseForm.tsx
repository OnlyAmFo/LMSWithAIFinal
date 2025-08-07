"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
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
import { courseSchema } from "../@types/course.schema";
export function AddCourseForm() {
  const [formData, setFormData] = useState<courseSchema>({
    title: "",
    description: "",
    duration: "",
    tumbnail: undefined,
    price: "",
    level: "",
  });
  const [thumbnail, setThumbnail] = useState<File | undefined>(undefined);
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
      setThumbnail(file);
      setPreviewProfile(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData) return;

    const courseData = new FormData();
    courseData.append("title", formData.title);
    courseData.append("description", formData.description);
    courseData.append("duration", formData.duration);
    courseData.append("price", formData.price);
    courseData.append("level", formData.level);

    if (thumbnail) {
      courseData.append("thumbnail", thumbnail);
    }

    await postData("/course/create", courseData,{
      headers: {
    "Content-Type": "multipart/form-data", // override the default
  },});
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#FF8C5A] outline-0">create course</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <form encType="multipart/form-data" onSubmit={handleSubmit}>
          <DialogHeader className="mb-10">
            <DialogTitle>create course</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="title">
                <span className="text-[red] text-xl">*</span> title
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="enter title"
                onChange={handleInput}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="description">
                <span className="text-[red] text-xl">*</span> description
              </Label>
              <textarea
                id="description"
                name="description"
                placeholder="enter description..."
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="duration">
                <span className="text-[red] text-xl">*</span> duration
              </Label>
              <Input
                id="duration"
                name="duration"
                placeholder="enter duration"
                onChange={handleInput}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="price">price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                placeholder="enter price"
                onChange={handleInput}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="level">
                <span className="text-[red] text-xl">*</span> level
              </Label>
              <Select
                name="level"
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, level: value }))
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="thumbnail">thumbnail</Label>
              <Input
                id="thumbnail"
                name="thumbnail"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  getPreviewProfile(e);
                }}
              />
            </div>

            {previewProfile && (
              <div className="grid gap-2">
                <Label htmlFor="thumbnail">Profile Preview:</Label>
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
              {loading ? <ClipLoader size={15} className="text-white"/> : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
