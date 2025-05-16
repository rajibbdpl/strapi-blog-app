"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Cookies from "js-cookie";

//define the data types
const formSchema = z.object({
  Title: z.string().min(5).max(200),
  Content: z.string().min(10).max(2000),
  coverImage: z.any(),
});

export default function PostForm() {
  //grab jwt from cookie

  async function onSubmit(values: z.infer<typeof formSchema>) {
     
    //send using formdata while sending files
    const formData = new FormData();
    formData.append("Title", values.Title);
    formData.append("Content", values.Content);
    // Append the file
    if (values.coverImage && values.coverImage.length > 0) {
      formData.append("coverImage", values.coverImage[0]);
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/posts`, {
      method: "POST",
      credentials:"include",
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Error posting:", errorData);
      return;
    }

    const data = await res.json();
    console.log("Post created:", data);
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Title: "",
      Content: "",
    },
  });

  return (
    <div className="flex items-center justify-center mt-10 ">
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
