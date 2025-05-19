import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
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
const getPosts = async (page: number = 1) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/posts?populate=*&pagination[page]=${page}&pagination[pageSize]=9`
    );
    return res.json();
  } catch (error) {
    console.log("unexpected eror occured while fetching data");
  }
};

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  //default url gives string && convert it to integer
  const currentPage = parseInt(searchParams.page || "1", 10);
  const result = await getPosts(currentPage);
  const { data, meta } = result;

  console.log("result", result.meta.pagination);

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

      {/* Pagination Container */}
      <div className="flex justify-center gap-4 mt-10">
        {/* prev button */}
        <Link
          href={`?page=${meta?.pagination?.page - 1}`}
          className={`px-4 py-2 rounded bg-gray-200 ${
            meta.pagination.page === 1 ? "pointer-events-none opacity-50" : "" //if first page
          }`}
        >
          Prev
        </Link>

        <Link
          href={`?page=${meta?.pagination?.page + 1}`}
          className={`px-4 py-2 rounded bg-gray-200 ${
            meta.pagination.page === meta?.pagination.pageCount
              ? "pointer-events-none opacity-50"
              : "" //last page
          }`}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
