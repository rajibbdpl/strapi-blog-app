"use client";

import React from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import Cookies from "js-cookie";

function Bookmark({ id }: { id: string }) {
  const token = Cookies.get("token");
  console.log("token", token)
  async function handleBookmark() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/bookmark/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Failed to bookmark post");
      }

      const data = await res.json();
      toast.success(data.message || "Bookmarked successfully!");
    } catch (error: any) {
      toast.error(error.message || "Error bookmarking post");
    }
  }
  return (
    <Button className="mt-5" onClick={handleBookmark}>
      Bookmark
    </Button>
  );
}

export default Bookmark;
