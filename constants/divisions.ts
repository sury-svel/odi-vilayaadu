export type Division = "arumbu" | "mottu" | "mugai" | "malar" | "semmal";

export const divisions = {
  arumbu: {
    id: "arumbu",
    name: {
      en: "Arumbu",
      ta: "அரும்பு",
    },
    ageRange: {
      en: "Ages 4-5",
      ta: "வயது 4-5",
    },
    minAge: 4,
    maxAge: 5
  },
  mottu: {
    id: "mottu",
    name: {
      en: "Mottu",
      ta: "மொட்டு",
    },
    ageRange: {
      en: "Ages 6-8",
      ta: "வயது 6-8",
    },
    minAge: 6,
    maxAge: 8
  },
  mugai: {
    id: "mugai",
    name: {
      en: "Mugai",
      ta: "முகை",
    },
    ageRange: {
      en: "Ages 9-10",
      ta: "வயது 9-10",
    },
    minAge: 9,
    maxAge: 10
  },
  malar: {
    id: "malar",
    name: {
      en: "Malar",
      ta: "மலர்",
    },
    ageRange: {
      en: "Ages 11-13",
      ta: "வயது 11-13",
    },
    minAge: 11,
    maxAge: 13
  }
};

// Helper function to determine division based on age
export const getDivisionByAge = (age: number): Division | null => {
  for (const [key, value] of Object.entries(divisions)) {
    if (age >= value.minAge && age <= value.maxAge) {
      return key as Division;
    }
  }
  return null;
};