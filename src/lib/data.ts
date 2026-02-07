export const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Departments", href: "/departments" },
    { label: "The Smart Club", href: "/club" },
    { label: "Offers", href: "/offers" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
];

export const DEPARTMENTS = [
    {
        id: "fresh-mart",
        title: "Fresh Mart",
        description: "Organic veggies, exotic fruits, imported gourmet.",
        icon: "ShoppingBasket",
        image: "/images/fresh-mart.jpg",
    },
    {
        id: "fashion-studio",
        title: "Fashion Studio",
        description: "Branded apparel, accessories, footwear.",
        icon: "Shirt",
        image: "/images/fashion.jpg",
    },
    {
        id: "tech-zone",
        title: "Tech Zone",
        description: "Latest gadgets, smart home devices, accessories.",
        icon: "Smartphone",
        image: "/images/tech.jpg",
    },
    {
        id: "home-living",
        title: "Home & Living",
        description: "Decor, kitchenware, essentials.",
        icon: "Home",
        image: "/images/home.jpg",
    },
];

export const CLUB_TIERS = [
    {
        name: "Silver Shopper",
        benefits: ["Points on every purchase", "Member-only discounts"],
        price: "Free",
        color: "bg-gray-200 text-gray-800",
    },
    {
        name: "Gold Elite",
        benefits: ["Priority billing", "Free delivery", "1.5x Points"],
        price: "₹999/year",
        color: "bg-yellow-400 text-yellow-900",
    },
    {
        name: "Platinum Access",
        benefits: [
            "Exclusive lounge access",
            "Birthday gifts",
            "Personal shopper",
            "2x Points",
        ],
        price: "₹2499/year",
        color: "bg-slate-800 text-white border border-gold-400",
    },
];
