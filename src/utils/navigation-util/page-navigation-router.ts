import Icons from "@/themes/images/icons/icons"; // Icons import

interface NavigationLinks {
  path: string;
  label: string;
  defaultIcon: keyof typeof Icons;
  activeIcon: keyof typeof Icons;
  collapsible: boolean;
}

export class NavBarNavigationClass {
    public navigationLinks: NavigationLinks[] = [
      { path: "/", label: "DashBoard", defaultIcon: "dashboardOutline", activeIcon: "dashboardFilled", collapsible: false },
      { path: "/time-sheet", label: "TimeSheet", defaultIcon: "timeSheetOutline", activeIcon: "timeSheetFilled", collapsible: true },
      { path: "/organization", label: "Organization", defaultIcon: "organizationOutline", activeIcon: "organizationFilled", collapsible: false },
    ];
  
    // Function to get the active status of the link based on the current pathname
    public getActiveStatus(path: string, pathname: string): boolean {
      return pathname === path; // Returns true if the current pathname matches the path
    }
  
    /**
     * Navigate to the desired path when a menu item is clicked.
     * @param {string} path The path to navigate to.
     * @param {Function} navigate The function to perform the navigation.
     */
    public navigateTo(path: string, navigate: (path: string) => void) {
      navigate(path); // Perform the navigation
    }
  }