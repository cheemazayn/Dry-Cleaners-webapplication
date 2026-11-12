// All website photos live here (Unsplash, free licence). Swap any URL to change a picture.
const u = (id, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const IMAGES = {
  heroBand: u("1635274605638-d44babc08a4f", 1800), // folded shirts, blue table
  steps: u("1763495195143-f3d6650630f9", 1000),    // woman working at a dry cleaner
  services: u("1451933335233-c41672c8f378", 1000), // suit hanging on a rack
  band: u("1626806819282-2c1dc01a5e0c", 1800),     // washer and dryer
  ironing: u("1696546761220-6c418dfefb8d", 1000),  // person ironing a shirt
  cta: u("1549037173-e3b717902c57", 1800),         // suit jackets on a rail
  login: u("1582735689369-4fe89db7114c", 900),     // textile in laundry basket
  register: u("1567113463300-102a7eb3cb26", 900),  // folded apparel
  admin: u("1610305401607-8745a10c75dd", 900),     // washing machines
  track: u("1520434901111-8e9bcb42c628", 1200),    // garment on a rack
};

export default IMAGES;
