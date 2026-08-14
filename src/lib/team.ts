export type TeamMember = {
  slug: string;
  name: string;
  title: string;
  practiceNote: string;
  courts?: string[];
  photo?: string;
};

export const team: TeamMember[] = [
  {
    slug: "eshan-kumar-gupta",
    name: "Eshan Kumar Gupta",
    title: "Proprietor",
    practiceNote:
      "Litigation across the Chamber's areas of practice, before the Allahabad High Court and the district judiciary of Uttar Pradesh.",
    courts: [
      "Allahabad High Court, Lucknow Bench",
      "District & Sessions Court, Lucknow",
    ],
    photo: "/images/team/eshan-kumar-gupta.png",
  },
  {
    slug: "sunil-kumar",
    name: "Sunil Kumar",
    title: "Senior Associate Advocate",
    practiceNote: "25+ years of practice.",
  },
  {
    slug: "piyush-gupta",
    name: "Piyush Gupta",
    title: "Associate Advocate",
    practiceNote: "3+ years of practice.",
    photo: "/images/team/piyush-gupta.png",
  },
  {
    slug: "hamza-dilshad",
    name: "Hamza Dilshad",
    title: "Associate",
    practiceNote: "Client counselling and case coordination.",
    photo: "/images/team/hamza-dilshad.png",
  },
];
