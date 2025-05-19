"use client";


// check to see if the data is being set in the user or not
import Cookies from "js-cookie";

import React, { useEffect, useState } from "react";

function Me() {
  const token = Cookies.get("token");
  const getData = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/users/me?populate=*`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    const data = await res.json()
    console.log("userdata", data);
  };
  useEffect(() => {
    getData();
  }, []);

  return <div>Me</div>;
}

export default Me;
