// "use client";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import React, { useEffect, useState } from "react";
// import usePostData from "@/app/hooks/PostData";
// import toast from "react-hot-toast";
// import { ClipLoader } from "react-spinners";
// import { useRouter } from "next/navigation";
// import { useRef } from "react";

// export function LoginForm() {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const { postData, result, responseError, loading } = usePostData();
//   const router = useRouter();
//   const closeRef = useRef<HTMLButtonElement>(null); // ✅

//   useEffect(() => {
//     if (result?.success) {
//       toast.success(result?.message || "login successful");
//       closeRef.current?.click();
//       router.back();
//     }
//     if (responseError)
//       toast.error(responseError?.response?.data?.message || "failed to login");
//   }, [responseError, result]);

//   const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const loginHandler = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     await postData("/auth/login", formData);
//   };
//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         {/* <ButtonWithBg background="#FF8C5A">Register</ButtonWithBg> */}
//         <Button variant={"outline"} className="bg-none border border-[#c5c4bc]">
//           Login
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <form onSubmit={loginHandler}>
//           <DialogHeader>
//             <DialogTitle>Login profile</DialogTitle>
//           </DialogHeader>
//           <div className="grid gap-4">
//             <div className="grid gap-3">
//               <Label htmlFor="email">email</Label>
//               <Input
//                 id="email"
//                 name="email"
//                 type="email"
//                 placeholder="enter email"
//                 onChange={handleInput}
//               />
//             </div>
//             <div className="grid gap-3">
//               <Label htmlFor="password">password</Label>
//               <Input
//                 id="password"
//                 name="password"
//                 type="password"
//                 placeholder="enter password"
//                 onChange={handleInput}
//               />
//             </div>
//           </div>
//           <DialogFooter className="flex gap-10 my-5">
//             <DialogClose asChild ref={closeRef}>
//               <Button variant="outline">
//                 Cancel
//               </Button>
//             </DialogClose>
//             <Button type="submit">
//               {loading ? <ClipLoader size={15} /> : "login"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }
"use client";
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
import React, { useEffect, useState } from "react";
import usePostData from "@/app/hooks/PostData";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export function LoginForm() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const closeRef = useRef<HTMLButtonElement>(null);
  let { postData, result, responseError, loading } = usePostData();
  const router = useRouter();

  useEffect(() => {
    if (result?.success) {
      responseError=undefined;
      toast.success(result?.message || "Login successful");
      // setOpen(false);
      closeRef.current?.click();
    }
    if (responseError) {
      toast.error(responseError?.response?.data?.message || "Failed to login");
    }
  }, [responseError, result, router]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const loginHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await postData("/auth/login", formData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="bg-none border border-[#c5c4bc]">
          Login
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={loginHandler}>
          <DialogHeader>
            <DialogTitle>Login to your account</DialogTitle>
            <DialogDescription>
              Enter your credentials to access your account
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                className="col-span-3"
                onChange={handleInput}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="col-span-3"
                onChange={handleInput}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline"ref={closeRef}>Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <ClipLoader size={15} className="mr-2 text-white" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
