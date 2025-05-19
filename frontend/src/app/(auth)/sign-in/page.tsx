"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

//define the data types
const formSchema = z.object({
  identifier: z.string().email(),
  password: z.string(),
});

export default function ProfileForm() {
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Submitting values", values);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/auth/local`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: values.identifier,
          password: values.password,
        }),
      });

      const data = await res.json();
      if (data?.error?.status === 400) {
        toast.error("Invalid credentials");
        return;
      }
      console.log("data", data);
      const jwt = data.jwt;

      const cookieRes = await fetch("/api/set-cookie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: jwt }),
      });
      if (!cookieRes.ok) {
        toast.error("Failed to store cookie");
        return;
      }

      toast.success("Welcome back user");
      // router.push("/");

      router.push("/");
    } catch (error: any) {
      console.log("Error in login", error);
      toast.error(error?.response?.data?.message || "Failed login");
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  return (
    <div className="flex items-center justify-center h-[100vh]">
      <div className="max-w-[80vw] w-[50vw] border border-black p-10 rounded-2xl shadow-2xl">
        <h1 className="text-xl font-bold mb-10 text-center">Login</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full"
          >
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full cursor-pointer" type="submit">
              Login
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
