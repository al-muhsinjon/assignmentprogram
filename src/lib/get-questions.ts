import generateCapitalOption from "./generate-option";

const getQuestions = async () => {
  try {
    const response = await fetch(`https://restcountries.com/v3.1/all`);
    if (!response.ok) {
      throw new Error("Failed to fetch countries");
    }
    const data: RestCountry[] = await response.json();

    const shuffled = data.sort(() => 0.5 - Math.random()).slice(0, 3);

    const questions = shuffled.map((country) => {
      const correct_answer = country?.capital?.[0] || "";
      const incorrect_answers = generateCapitalOption<RestCountry>(data)
        .filter((c) => c.capital?.[0] && c.capital[0] !== correct_answer)
        .map((item) => item?.capital[0] || "")
        .slice(0, 10);
      const all_answers = [correct_answer, ...incorrect_answers].sort(
        () => 0.5 - Math.random()
      );
      return {
        question: country?.name?.common || "",
        correct_answer,
        incorrect_answers,
        all_answers,
        flag: country?.flags?.svg || country?.flags?.png || "",
      };
    });

    return questions;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
};

export default getQuestions;
