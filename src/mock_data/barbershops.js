export const services = [
  {
    id: "1",
    name: "Fade Masters",
    category: "Barbershop",
    latitude: 41.3111,
    longitude: 69.2797,
    image: "/images/barbershop1.jpg",
    description: "Premium fades and modern cuts for men.",
  },
  {
    id: "2",
    name: "Glamour Hair Studio",
    category: "Hair Salon",
    latitude: 41.3145,
    longitude: 69.2812,
    image: "/images/hairsalon1.jpg",
    description: "Luxury hair care and styling for women.",
  },
  {
    id: "3",
    name: "Sparkle Nails",
    category: "Nail Salon",
    latitude: 41.3160,
    longitude: 69.2780,
    image: "/images/nailsalon1.jpg",
    description: "Stylish nail art and manicure services.",
  },
];





export const categories = [
    {
        title: "Barbershops",
        route: "/barbershops",
        services: [
            { id: 1, name: "Fade Masters", rating: 4.9, image: "/images/barber1.jpg" },
            { id: 2, name: "Sharp Cuts", rating: 4.7, image: "/images/barber2.jpg" },
            { id: 3, name: "Fade Masters", rating: 4.9, image: "/images/barber1.jpg" },
            { id: 4, name: "Sharp Cuts", rating: 4.7, image: "/images/barber2.jpg" },
            { id: 5, name: "Fade Masters", rating: 4.9, image: "/images/barber1.jpg" },
            { id: 6, name: "Sharp Cuts", rating: 4.7, image: "/images/barber2.jpg" },
            { id: 7, name: "Fade Masters", rating: 4.9, image: "/images/barber1.jpg" },
            { id: 8, name: "Sharp Cuts", rating: 4.7, image: "/images/barber2.jpg" },
        ],
    },
    {
        title: "Hair Salons",
        route: "/hair-salons",
        services: [
            { id: 103, name: "Glam Studio", rating: 4.8, image: "/images/hair1.jpg" },
            { id: 204, name: "Blow & Go", rating: 4.6, image: "/images/hair2.jpg" },
        ],
    },
    // Duplicated Hair Salons categories from your original data for demonstration
    // In a real application, you might want to deduplicate or give unique titles/IDs
    {
        title: "Hair Salons 2", // Changed title to distinguish
        route: "/hair-salons",
        services: [
            { id: 5, name: "Style Hub", rating: 4.5, image: "/images/hair3.jpg" },
            { id: 6, name: "Cut & Color", rating: 4.9, image: "/images/hair4.jpg" },
        ],
    },
    {
        title: "Nail Spas",
        route: "/nail-spas",
        services: [
            { id: 7, name: "Perfect Pedi", rating: 4.7, image: "/images/nail1.jpg" },
            { id: 8, name: "Nail Artistry", rating: 4.8, image: "/images/nail2.jpg" },
        ],
    },
    {
        title: "Massage Therapy",
        route: "/massage-therapy",
        services: [
            { id: 9, name: "Relax Retreat", rating: 4.9, image: "/images/massage1.jpg" },
            { id: 10, name: "Deep Tissue Pros", rating: 4.6, image: "/images/massage2.jpg" },
        ],
    },
    {
        title: "Barbershops 2", // More content for scrolling demo
        route: "/barbershops-more",
        services: [
            { id: 11, name: "Classic Cuts", rating: 4.8, image: "/images/barber3.jpg" },
            { id: 12, name: "Modern Man", rating: 4.7, image: "/images/barber4.jpg" },
        ],
    },
    {
        title: "Hair Salons 3",
        route: "/hair-salons-more",
        services: [
            { id: 13, name: "Chic Locks", rating: 4.9, image: "/images/hair5.jpg" },
            { id: 14, name: "Salon Elite", rating: 4.8, image: "/images/hair6.jpg" },
        ],
    },
    {
        title: "Beauty Treatments",
        route: "/beauty-treatments",
        services: [
            { id: 15, name: "Glow Up Studio", rating: 4.7, image: "/images/beauty1.jpg" },
            { id: 16, name: "Flawless Skin", rating: 4.8, image: "/images/beauty2.jpg" },
        ],
    },
    {
        title: "Spa Services",
        route: "/spa-services",
        services: [
            { id: 17, name: "Serenity Spa", rating: 4.9, image: "/images/spa1.jpg" },
            { id: 18, name: "Tranquil Oasis", rating: 4.7, image: "/images/spa2.jpg" },
        ],
    },
];
