import Icons from "@/themes/images/icons/icons";

interface NavigationLinks {
  path: string;
  label: string;
}

export class ProfileNavigationClass {
  public navigationLinks: NavigationLinks[] = [
    { path: '/profile', label: 'Profile' },
    { path: '/notifications', label: 'Notifications' },
    { path: '/holidays', label: 'Holidays' },
    { path: '', label: 'Logout' },
  ];

  // Define a map from label to icon name
  private labelToIconMap: { [key: string]: keyof typeof Icons } = {
    'Profile': 'avatarIcon',
    'Notifications': 'bell',
    'Holidays': 'holiday',
    'Logout': 'logout',
  };

  /**
   * Navigates to the selected path based on the clicked menu item.
   *
   * @param {string} label - The label of the selected menu item.
   * @param {Function} navigate - Function to handle navigation.
   */
  public navigateTo(label: string, navigate: (path: string) => void): void {
    const link = this.navigationLinks.find((link) => link.label === label);
    if (link) {
      navigate(link.path);
    }
  }

  /**
   * Get the corresponding icon name for a menu item label.
   *
   * @param {string} label - The label of the menu item.
   * @returns {keyof typeof Icons} - The corresponding icon name.
   */
  public getIconForLabel(label: string): keyof typeof Icons {
    return this.labelToIconMap[label] || 'defaultIcon';
  }
}