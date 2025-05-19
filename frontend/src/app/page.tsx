import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import React from "react";

type Posts = {
  id: string;
  Title: string;
  Content: string;
  createdAt: string;
  documentId: string;
  publishedAt: string;
  updatedAt: string;
  coverImage?: any;
  displayImages?: any;
}; 
const getPosts = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/posts?populate=*`
    );
    return res.json();
  } catch (error) {
    console.log("unexpected eror occured while fetching data");
  }
};

export default async function Page() {
  const { data, meta } = await getPosts();

  if (!data || data?.length === 0) {
    <div>No data available</div>;
  }

  return (
    <div className="flex items-center justify-center flex-col my-10">
      <h1 className="text-3xl font-semibold">All the Blog Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:grid-cols-3">
        {data.map((item: Posts) => (
          <Card className="p-10 m-5 shadow-xl " key={item?.id}>
            <CardDescription className="sr-only">
              this is card description
            </CardDescription>
            <CardContent>
              <div className="w-full rounded-sm flex items-center justify-center">
                <Image
                  width={100}
                  height={100}
                  alt={item?.coverImage?.name}
                  src={`${process.env.NEXT_PUBLIC_API}${item?.coverImage?.url}`}
                  className="object-cover"
                />
              </div>
              <h2 className="my-5 font-semibold line-clamp-2 text-lg">
                {item.Title}
              </h2>
              <p className="line-clamp-4">{item?.Content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
