const BASE_URL = "https://saavn.sumit.co";

export const searchSongs = async (query: string) => {
  const response = await fetch(
    `${BASE_URL}/api/search/songs?query=${query}`
  );

  const json = await response.json();
  return json.data.results;
};
