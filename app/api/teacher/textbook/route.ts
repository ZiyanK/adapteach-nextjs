import { NextResponse } from "next/server"

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const curriculumData = {
    class: 10,
    subject: "Science",
    medium: "English",
    chapters: [
      {
        chapter_number: 1,
        title: "Chemical Reactions and Equations",
        sections: [
          "1.1 Chemical Equation",
          "1.2 Balanced Chemical Equation",
          "1.3 Implication of a Balanced Chemical Equation",
          "1.4 Types of Chemical Reactions",
        ],
      },
      {
        chapter_number: 2,
        title: "Acids, Bases and Salts",
        sections: [
          "2.1 Definition in terms of H⁺ and OH⁻ ions",
          "2.2 General Properties",
          "2.3 Examples and Uses",
          "2.4 Concept of pH Scale",
          "2.5 Properties and Uses of Sodium Hydroxide",
        ],
      },
      {
        chapter_number: 3,
        title: "Metals and Non‑metals",
        sections: [
          "3.1 Properties of Metals and Non‑metals",
          "3.2 Reactivity Series",
          "3.3 Formation and Properties of Ionic Compounds",
          "3.4 Basic Metallurgical Processes",
          "3.5 Corrosion and its Prevention",
        ],
      },
    ],
  }

  return NextResponse.json(curriculumData)
}
