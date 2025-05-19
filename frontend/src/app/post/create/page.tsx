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
import { Textarea } from "@/components/ui/textarea";
import Cookies from "js-cookie";
import { useEffect } from "react";

// Define the data types
const formSchema = z.object({
  Title: z.string().min(5).max(200),
  Content: z.string().min(10).max(2000),
  coverImage: z.any(),
});

export default function PostForm() {
  useEffect(() => {
    const token = Cookies.get("token");
    console.log("Client-side token:", token);
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const token = Cookies.get("token");

      if (!token) {
        console.error("No token found in cookies");
        return;
      }

      let uploadedImageId = null;

      
      //image upload separately
      if (values.coverImage && values.coverImage.length > 0) {
        const uploadData = new FormData();
        uploadData.append("files", values.coverImage[0]);

        const uploadRes = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/upload`,
          {
            method: "POST",
            body: uploadData,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!uploadRes.ok) {
          const error = await uploadRes.json();
          console.error("Error uploading image:", error);
          return;
        }

        const uploadResult = await uploadRes.json();

        if (uploadResult && uploadResult.length > 0) {
          uploadedImageId = uploadResult[0].id;
        }
      }

      const postPayload = {
        data: {
          Title: values.Title,
          Content: values.Content,
          ...(uploadedImageId && {
            coverImage: uploadedImageId,
          }),
        },
      };

      //finally create the post with image id
      const postRes = await fetch(`${process.env.NEXT_PUBLIC_API}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postPayload),
      });

      if (!postRes.ok) {
        const errorData = await postRes.json();
        console.error("Error creating post:", errorData);
        return;
      }

      const postData = await postRes.json();
      console.log("Post created:", postData);
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Title: "",
      Content: "",
    },
  });

  return (
    <div className="flex items-center justify-center mt-10">
      <div className="max-w-[80vw] w-[50vw] border p-10">
        <h1 className="text-xl font-bold mb-10 text-center">
          Create a new Post
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full"
          >
            <FormField
              control={form.control}
              name="Title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => field.onChange(e.target.files)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="Content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full cursor-pointer" type="submit">
              Add Post
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
