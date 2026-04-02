export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export const mainNav: NavItem[] = [
  {
    label: 'Our Shop',
    href: '/about',
    children: [
      { label: 'About Us', href: '/about' },
      { label: 'Coupons', href: '/coupons' },
      { label: 'Reviews', href: '/reviews' },
    ],
  },
  {
    label: 'Services',
    href: '/services',
    children: [
      { label: 'All Services', href: '/services' },
      { label: 'Auto Repair', href: '/services/auto-repair' },
      { label: 'Brake Service', href: '/services/brake-service' },
      { label: 'Tires', href: '/services/tires' },
      { label: 'AC Repair', href: '/services/ac-repair' },
      { label: 'Smog Check', href: '/services/smog-check' },
    ],
  },
  {
    label: 'Towing',
    href: '/services/towing',
  },
  {
    label: 'Service Areas',
    href: '/areas',
    children: [
      { label: 'Livermore', href: '/areas/livermore' },
      { label: 'Pleasanton', href: '/areas/pleasanton' },
      { label: 'Dublin', href: '/areas/dublin' },
    ],
  },
  {
    label: 'Blog',
    href: '/blog',
  },
  {
    label: 'Contact',
    href: '/contact',
    children: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'Request Appointment', href: '/appointment' },
    ],
  },
];

export const footerNav = {
  services: [
    { label: 'Auto Repair', href: '/services/auto-repair' },
    { label: 'Brake Service', href: '/services/brake-service' },
    { label: 'Tires', href: '/services/tires' },
    { label: 'Towing', href: '/services/towing' },
    { label: 'AC Repair', href: '/services/ac-repair' },
    { label: 'Smog Check', href: '/services/smog-check' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Reviews', href: '/reviews' },
    { label: 'Coupons', href: '/coupons' },
    { label: 'Blog', href: '/blog' },
    { label: 'Privacy Policy', href: '/privacy' },
  ],
};
