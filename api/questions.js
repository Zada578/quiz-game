export default function handler(req, res) {
  res.status(200).json([
    {
      question: "What is 2+2?",
      options: ["2", "3", "4", "5"],
      answer: "4"
    },
    {
      question: "Capital of India?",
      options: ["Mumbai", "Delhi", "Chennai", "Kolkata"],
      answer: "Delhi"
    }
  ]);
}
