"use client";

import React from "react";
import { usePathname } from "next/navigation";
import ModuleHeader from "../module-header/module-header";


const ModuleHeaderWrapper = () => {
  const pathname = usePathname();

  // Define the pages and their corresponding data
  const pages = [
    { title: "Dashboard", path: "/dashboard", backButtonNeeded: false },
    { title: "Timesheet", path: "/time-sheet", backButtonNeeded: false },
    { title: "Organization", path: "/organization", backButtonNeeded: false },

  ];

  // Find the matching page based on the current pathname
  const currentPage = pages.find((page) => page.path === pathname);

  // Fallback in case no matching page is found
  const title = currentPage?.title || "Default Title";
  const isBackButtonNeeded = currentPage?.backButtonNeeded || false;

  return (
        <ModuleHeader title={title} isBackButtonNeeded={isBackButtonNeeded} />
  );
};

export default ModuleHeaderWrapper;
