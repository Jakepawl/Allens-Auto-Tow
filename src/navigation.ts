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
      { label: 'Oil Change', href: '/services/oil-change' },
      { label: 'Engine Repair', href: '/services/engine-repair' },
      { label: 'Tires', href: '/services/tires' },
      { label: 'Transmission', href: '/services/transmission-service' },
      { label: 'AC Repair', href: '/services/ac-repair' },
      { label: 'Smog Check', href: '/services/smog-check' },
    ],
  },
  {
    label: 'Brands',
    href: '/brands',
    children: [
      { label: 'All Brands', href: '/brands' },
      { label: 'Honda', href: '/brands/honda' },
      { label: 'Toyota', href: '/brands/toyota' },
      { label: 'Ford', href: '/brands/ford' },
      { label: 'Chevrolet', href: '/brands/chevrolet' },
      { label: 'BMW', href: '/brands/bmw' },
      { label: 'Nissan', href: '/brands/nissan' },
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
      { label: 'I-580 Corridor', href: '/areas/i-580' },
      { label: 'I-680 Corridor', href: '/areas/i-680' },
      { label: 'Altamont Pass', href: '/areas/altamont-pass' },
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
    { label: 'Oil Change', href: '/services/oil-change' },
    { label: 'Engine Repair', href: '/services/engine-repair' },
    { label: 'Tires', href: '/services/tires' },
    { label: 'Towing', href: '/services/towing' },
    { label: 'AC Repair', href: '/services/ac-repair' },
    { label: 'Smog Check', href: '/services/smog-check' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Reviews', href: '/reviews' },
    { label: 'Coupons', href: '/coupons' },
    { label: 'Brands', href: '/brands' },
    { label: 'Blog', href: '/blog' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};
