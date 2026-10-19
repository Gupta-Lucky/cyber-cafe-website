/*
  PRICING DATA
  ------------
  Pricing section के सारे cards का data सिर्फ़ यहीं है।
  नया card जोड़ना हो तो नीचे `categories` की list में एक block और जोड़ दीजिए,
  card अपने-आप बन जाएगा। HTML या CSS में कुछ नहीं बदलना।

  एक card का format:
  {
    icon: "id-card",                      // नीचे वाली icon list में से कोई एक
    title: "PAN Card",                    // card की heading
    items: [
      { name: "New PAN Card", price: 200 },   // price: संख्या  -> ₹200
      { name: "Typing (per page)", price: "₹30" },  // या सीधा text
      { name: "Excel Dashboard", price: "₹1,000+" },
      { name: "Recharge", price: "Free" },
    ],
  }

  Icon के नाम:
  id-card, user-check, graduation-cap, landmark, vote, shopping-bag, award,
  train, briefcase, calculator, building, car, book, map, heart, zap, plane,
  file-text, image, table, globe, video, megaphone

  ⚠️ ज़रूरी: PAN Card को छोड़कर बाकी सारे दाम सिर्फ़ नमूना (sample) हैं।
  Website live करने से पहले हर दाम अपने असली दाम से बदलिए, फिर नीचे
  config में showSampleNotice को false कर दीजिए।
*/

window.MSC_PRICING = {
  config: {
    callNumber: "+919241062900", // "Call Now" बटन इसी number पर dial pad खोलता है
    showSampleNotice: true, // live करने से पहले false करें
    sampleNotice:
      "Sample prices for design preview. Replace them with your real rates before going live.",
    note: "Rates may change. Please call to confirm before sending your documents.",
  },

  categories: [
    {
      icon: "id-card",
      title: "PAN Card",
      items: [
        { name: "New PAN Card", price: 200 },
        { name: "PAN Correction", price: 150 },
        { name: "PAN Reprint", price: 80 },
      ],
    },
    {
      icon: "user-check",
      title: "Aadhaar",
      items: [
        { name: "Download & Print", price: 30 },
        { name: "Address Update", price: 100 },
        { name: "PVC Card Order", price: 80 },
      ],
    },
    {
      icon: "graduation-cap",
      title: "B.A / B.Sc / B.Com",
      items: [
        { name: "Exam Form", price: 120 },
        { name: "Admit Card", price: 25 },
        { name: "Admission", price: "___" },
      ],
    },
    {
      icon: "landmark",
      title: "Govt Certificates",
      items: [
        { name: "Caste", price: 50 },
        { name: "Income", price: 50 },
        { name: "Residence", price: 50 },
        { name: "EWS / NCL", price: 100 },
      ],
    },
    {
      icon: "vote",
      title: "Voter ID",
      items: [
        { name: "New Voter ID", price: 100 },
        { name: "Correction", price: 80 },
        { name: "e-EPIC Download", price: 30 },
      ],
    },
    {
      icon: "shopping-bag",
      title: "Ration Card",
      items: [
        { name: "New Ration Card", price: 150 },
        { name: "Add / Remove Member", price: 50 },
        { name: "Correction", price: 50 },
      ],
    },
    {
      icon: "award",
      title: "Scholarship",
      items: [
        { name: "New Application", price: 150 },
        { name: "Renewal", price: 80 },
        { name: "Status Check", price: 20 },
      ],
    },
    {
      icon: "train",
      title: "SSC & Railway",
      items: [
        { name: "SSC Exam Form", price: "___" },
        { name: "RRB Exam Form", price: "____" },
        { name: "Admit Card", price: 30 },
      ],
    },
    {
      icon: "briefcase",
      title: "Govt Job Forms",
      items: [
        { name: "State Govt Job", price: "___" },
        { name: "Central Govt Job", price: "___" },
        { name: "Police / BSSC", price: "___" },
      ],
    },
    // {
    //   icon: "calculator",
    //   title: "Tax & GST",
    //   items: [
    //     { name: "ITR (Salaried)", price: 400 },
    //     { name: "ITR (Business)", price: 800 },
    //     { name: "GST Registration", price: 1000 },
    //   ],
    // },
    // {
    //   icon: "building",
    //   title: "Business Registration",
    //   items: [
    //     { name: "Udyam (MSME)", price: 300 },
    //     { name: "FSSAI", price: 800 },
    //     { name: "Digital Signature", price: 1500 },
    //   ],
    // },
    {
      icon: "car",
      title: "Driving Licence",
      items: [
        { name: "Learner Licence", price: 300 },
        { name: "DL Renewal", price: "___" },
        { name: "e-Challan Payment", price: 50 },
      ],
    },
    // {
    //   icon: "book",
    //   title: "Passport",
    //   items: [
    //     { name: "New Passport Form", price: 400 },
    //     { name: "Renewal Form", price: 400 },
    //     { name: "Appointment Booking", price: 100 },
    //   ],
    // },
    // {
    //   icon: "map",
    //   title: "Land Records",
    //   items: [
    //     { name: "Jamabandi Copy", price: 50 },
    //     { name: "Rent Receipt", price: 60 },
    //     { name: "Dakhil-Kharij", price: 300 },
    //   ],
    // },
    {
      icon: "heart",
      title: "Govt Schemes",
      items: [
        { name: "Ayushman Card", price: 50 },
        { name: "e-Shram Card", price: 50 },
        { name: "PM-Kisan", price: 50 },
        { name: "Pension Form", price: 100 },
      ],
    },
    {
      icon: "zap",
      title: "Bills & Recharge",
      items: [
        { name: "Electricity Bill", price: 10 },
        { name: "Mobile Recharge", price: "Free" },
        { name: "DTH Recharge", price: "Free" },
      ],
    },
    {
      icon: "plane",
      title: "Travel Tickets",
      items: [
        { name: "Train (IRCTC)", price: "___" },
        { name: "Bus Ticket", price: "___" },
        // { name: "Flight Ticket", price: 100 },
      ],
    },
    {
      icon: "file-text",
      title: "Resume & Typing",
      items: [
        { name: "Resume / CV", price: 100 },
        { name: "Typing (per page)", price: 30 },
        { name: "Translation (per page)", price: 50 },
      ],
    },
    {
      icon: "image",
      title: "PDF & Photo Work",
      items: [
        { name: "Photo to PDF", price: 20 },
        { name: "Compress / Merge PDF", price: 20 },
        { name: "Photo & Sign Resize", price: 20 },
        { name: "Background Removal", price: 50 },
      ],
    },
    {
      icon: "table",
      title: "MS Excel Works",
      items: [
        { name: "Data Entry", price: "₹300+" },
        { name: "Formulas & Reports", price: "₹500+" },
        { name: "Dashboards", price: "₹1,000+" },
        { name: "Invoice Format", price: "₹300+" },
      ],
    },
    {
      icon: "globe",
      title: "Website Development",
      items: [
        { name: "Landing Page", price: "₹2,999+" },
        { name: "Portfolio Website", price: "₹2,000+" },
        { name: "Business Website", price: "₹7,999+" },
        { name: "Maintenance", price: "₹499/mo" },
      ],
    },
    {
      icon: "video",
      title: "Video Editing",
      items: [
        // { name: "Reel / Short", price: "₹300+" },
        { name: "marri Video", price: "₹___" },
        { name: "Event Video", price: "₹___" },
      ],
    },
    {
      icon: "megaphone",
      title: "Digital Marketing",
      items: [
        { name: "Social Media Post", price: "___" },
        { name: "Poster / Banner", price: "₹150+" },
        { name: "Google Business Profile", price: "___" },
        { name: "Logo Design", price: "___" },
      ],
    },
  ],
};
