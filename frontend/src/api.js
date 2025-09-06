const BASE_URL = "http://localhost:3000/api";
const AUTH_URL = `${BASE_URL}/auth`;

export const signup = async (userData) => {
  const res = await fetch(`${AUTH_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(userData),
  });
  return res.json();
};

export const login = async (userData) => {
  const res = await fetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(userData),
  });
  return res.json();
};

export const logout = async () => {
  const res = await fetch(`${AUTH_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
};

// Şehir ve konum fonksiyonları
export const getLocations = async () => {
  const res = await fetch(`${BASE_URL}/locations`);
  return res.json();
};

export const getLocationsByCity = async (cityName) => {
  const res = await fetch(
    `${BASE_URL}/locations/${encodeURIComponent(cityName)}`
  );
  return res.json();
};

export const getCityDetail = async (id) => {
  const res = await fetch(`${BASE_URL}/locations/sehir/${id}`);
  return res.json();
};

export const addComment = async (id, comment) => {
  const res = await fetch(`${BASE_URL}/locations/sehir/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(comment),
  });
  return res.json();
};

export const getLocationsByCategory = async (category) => {
  const res = await fetch(`${BASE_URL}/locations/category/${category}`);
  return res.json();
};

export const getTopRatedPlaces = async () => {
  const res = await fetch(`${BASE_URL}/locations/top-rated`);
  return res.json();
};

// Dinamik filtreleme endpointi
export const filterLocations = async ({
  category,
  cityName,
  universityName,
}) => {
  if (!category && !cityName && !universityName) {
    return await getLocations();
  }

  let query = [];
  if (category) query.push(`category=${encodeURIComponent(category)}`);
  if (cityName) query.push(`cityName=${encodeURIComponent(cityName)}`);
  if (universityName)
    query.push(`universityName=${encodeURIComponent(universityName)}`);

  const url = `${BASE_URL}/locations/filter?${query.join("&")}`;
  const res = await fetch(url);
  return res.json();
};

// Soru ekle
export const askQuestion = async ({ title, body, universityName }) => {
  try {
    const res = await fetch(`${BASE_URL}/q-a/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title, body, universityName }),
    });

    if (!res.ok) {
      throw new Error("Soru gönderilemedi");
    }

    return res.json();
  } catch (error) {
    console.error("Error asking question:", error);
    throw error;
  }
};

// Soru listele - GET request olarak düzeltildi
export const getQuestions = async (universityName) => {
  try {
    const res = await fetch(
      `${BASE_URL}/q-a/questions?universityName=${encodeURIComponent(
        universityName
      )}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );

    if (!res.ok) {
      throw new Error("Sorular alınamadı");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};

// Cevap ekle
export const answerQuestion = async (questionId, text) => {
  try {
    const res = await fetch(`${BASE_URL}/q-a/answer/${questionId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      throw new Error("Cevap gönderilemedi");
    }

    return res.json();
  } catch (error) {
    console.error("Error answering question:", error);
    throw error;
  }
};

// Cevapları getir
export const getAnswers = async (questionId) => {
  try {
    const res = await fetch(`${BASE_URL}/q-a/answers/${questionId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Cevaplar alınamadı");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching answers:", error);
    throw error;
  }
};

// Chatbot fonksiyonu
export const chatWithBot = async (message) => {
  try {
    const res = await fetch(`${BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      throw new Error("Chatbot isteği başarısız");
    }

    return res.json();
  } catch (error) {
    console.error("Error chatting with bot:", error);
    throw error;
  }
};
