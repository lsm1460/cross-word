const API_SERVER = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export const GET_WORD_DEFINITION = `${API_SERVER}/word/getword`; // ?word=&word=
export const POST_SAVE_GAME = `${API_SERVER}/word/savegame`;
export const GET_GAME_LIST = `${API_SERVER}/word/getgamelist`; // ?page=&per_page
export const GET_GAME = `${API_SERVER}/word/getgame`; // ?id
