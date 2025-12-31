export const getSongById = async (id: string) => {
  const response = await fetch(
    `https://saavn.sumit.co/api/songs/${id}`
  );

  const json = await response.json();

  // API returns array inside data
  return json.data[0];
};
