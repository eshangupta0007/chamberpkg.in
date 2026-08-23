export type TeamMember = {
  slug: string;
  name: string;
  title: string;
  practiceNote: string;
  courts?: string[];
  /**
   * Portrait path. Filenames carry a short content hash: replacing a photo
   * under the same name can be masked by the image cache, so the URL has to
   * change whenever the image does.
   */
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
    photo: "/images/team/eshan-kumar-gupta.87453032.png",
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
    photo: "/images/team/piyush-gupta.14bb3267.png",
  },
  {
    slug: "hamza-dilshad",
    name: "Hamza Dilshad",
    title: "Associate",
    practiceNote: "Client counselling and case coordination.",
    photo: "/images/team/hamza-dilshad.1914ecb9.png",
  },
];
