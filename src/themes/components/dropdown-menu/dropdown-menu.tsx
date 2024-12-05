"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Dropdown } from "antd";
import styles from "./dropdown-menu.module.scss";

interface MenuItem {
  key: string;
  label: React.ReactNode;
  onClick?: () => void;
}

interface DropdownProps {
  menuItems: MenuItem[];
  trigger?: ("click" | "hover" | "contextMenu")[];
  icon?: React.ReactNode;
  wrapperClassName?: string;
}

const DropdownMenu: React.FC<DropdownProps> = ({
  menuItems,
  trigger = ["click"],
  icon,
  wrapperClassName = "",
}) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (visible: boolean) => {
    setOpen(visible);
    console.log("Dropdown open state changed:", visible);
  };

  const handleScroll = useCallback(() => {
    if (open) {

      setOpen(false);
    }
  }, [open]);

  useEffect(() => {
    
    // Only add listener if dropdown is open
    if (open) {
      window.addEventListener('scroll', handleScroll, { passive: true });


      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [open, handleScroll]);

  return (
    <Dropdown
      open={open}
      onOpenChange={handleOpenChange}
      trigger={trigger}
      menu={{
        items: menuItems.map((item) => ({
          key: item.key,
          label: item.label,
          onClick: item.onClick,
        })),
      }}
    >
      <div className={`${styles.triggerWrapper} ${wrapperClassName}`}>
        {icon}
      </div>
    </Dropdown>
  );
};

export default DropdownMenu;