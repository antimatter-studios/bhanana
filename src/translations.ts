export type Lang = "en" | "ne";

export const languages: Lang[] = ["en", "ne"];

type Copy = {
  nav: { home: string; about: string; blog: string; contact: string; admin: string };
  cta: { donate: string; volunteer: string };
  hero: { title: string; subtitle: string; impact: string };
  stats: { confidence: string; belonging: string; continuation: string; girls: string };
  mission: { title: string; body: string };
  approach: { title: string; body: string };
  impactTiers: { label: string; items: { amount: string; text: string }[] };
  contact: { title: string; body: string; email: string };
  admin: { title: string; body: string };
  blog: { title: string; body: string };
};

export const copy: Record<Lang, Copy> = {
  en: {
    nav: { home: "Home", about: "About", blog: "Blog", contact: "Contact", admin: "Admin" },
    cta: { donate: "Donate", volunteer: "Volunteer" },
    hero: {
      title: "Creating safe, joyful spaces for children in Nepal",
      subtitle:
        "Inspired by Sujan and Ambika Karki, Bhanana builds places where every child can play, heal, and thrive through community, sport, and holistic care.",
      impact: "81% of children in our pilot reported higher self-confidence.",
    },
    stats: {
      confidence: "81% gained self-confidence",
      belonging: "91% felt team belonging",
      continuation: "96% want to continue",
      girls: "77% participants are girls",
    },
    mission: {
      title: "Mission",
      body: "We partner with communities to create vibrant, inclusive environments that nurture each child's physical, mental, and emotional well-being—ensuring they feel seen, heard, and valued.",
    },
    approach: {
      title: "Our approach",
      body: "Play (including football), social-emotional and creative workshops, mindfulness, and mentorship with local leaders—tailored for every child, built to last.",
    },
    impactTiers: {
      label: "Your donation’s impact",
      items: [
        { amount: "$50", text: "Creative workshops that let children process feelings through art and play." },
        { amount: "$100", text: "Sports equipment to build teamwork, movement, and confidence." },
        { amount: "$500", text: "Training community members to provide ongoing mental health support." },
        { amount: "$1000", text: "Safe zones for children affected by trauma—spaces for healing and growth." },
      ],
    },
    contact: {
      title: "Get in touch",
      body: "Want to collaborate, donate, or bring Bhanana to your community? Reach out.",
      email: "hello@bhanana.org",
    },
    admin: {
      title: "Admin",
      body: "Private area for managing content, programs, and impact updates. (Coming soon.)",
    },
    blog: {
      title: "Stories & updates",
      body: "We’ll share program learnings, community spotlights, and ways to get involved.",
    },
  },
  ne: {
    nav: { home: "गृहपृष्ठ", about: "हाम्रो बारे", blog: "ब्लग", contact: "सम्पर्क", admin: "प्रशासन" },
    cta: { donate: "दान गर्नुहोस्", volunteer: "स्वयंसेवक बनौं" },
    hero: {
      title: "बालबालिकाका लागि सुरक्षित र खुसीको स्थानहरू",
      subtitle:
        "सुझन र अम्बिका कार्कीको सम्झनामा, भननाले समुदायसँग मिलेर खेलकुद, भावना, र सहायताबाट बच्चाहरूलाई खेल्न, निको हुन र फस्टाउन मद्दत गर्छ।",
      impact: "हाम्रो पाइलटमा ८१% बालबालिकाले आत्मविश्वास बढेको बताए।",
    },
    stats: {
      confidence: "८१% ले आत्मविश्वास पाए",
      belonging: "९१% ले टोलीमा अपनत्व महसुस गरे",
      continuation: "९६% ले निरन्तरता चाहन्छन्",
      girls: "७७% सहभागी बालिका",
    },
    mission: {
      title: "हाम्रो मिशन",
      body: "हामी समुदायसँग साझेदारी गरेर बालबालिकाको शारीरिक, मानसिक र भावनात्मक कल्याणलाई समेट्ने र उनीहरूलाई देखिएको, सुनेको र मूल्यवान् महसुस हुने वातावरण बनाउँछौं।",
    },
    approach: {
      title: "हाम्रो विधि",
      body: "फुटबलसहित खेलकुद, सामाजिक-भावनात्मक र सिर्जनात्मक कार्यशाला, माइन्डफुलनेस, र स्थानीय नेतृत्वसँगको मार्गदर्शन—प्रत्येक बालबालिकाका लागि अनुरूप र दिगो।",
    },
    impactTiers: {
      label: "तपाईंको समर्थनको प्रभाव",
      items: [
        { amount: "$५०", text: "सिर्जनात्मक कार्यशाला जसले कला र खेलमार्फत भावना व्यक्त गर्न सुरक्षित स्थान दिन्छ।" },
        { amount: "$१००", text: "खेलकुद सामग्री, टोली भावना र आत्मविश्वासका लागि।" },
        { amount: "$५००", text: "समुदायका सदस्यहरूलाई मानसिक स्वास्थ्य सहयोग दिन तालिम।" },
        { amount: "$१०००", text: "आघातबाट प्रभावित बालबालिकाका लागि सुरक्षित क्षेत्र, उपचार र विकासका लागि।" },
      ],
    },
    contact: {
      title: "सम्पर्क",
      body: "सहयोग, दान, वा आफ्नो समुदायमा भनना ल्याउन चाहनुहुन्छ? हामीलाई लेख्नुहोस्।",
      email: "hello@bhanana.org",
    },
    admin: {
      title: "प्रशासन",
      body: "समग्री, कार्यक्रम, र प्रभाव अद्यावधिक व्यवस्थापन गर्ने निजी क्षेत्र। (चाँडै आउँदैछ।)",
    },
    blog: {
      title: "कथा र अद्यावधिक",
      body: "हामी कार्यक्रमका सिकाइ, समुदायको प्रकाश, र सहभागी हुने तरिकाहरू साझा गर्नेछौं।",
    },
  },
};

export function getCopy(lang?: string): { lang: Lang; text: Copy } {
  if (lang === "ne") return { lang: "ne", text: copy.ne };
  return { lang: "en", text: copy.en };
}
