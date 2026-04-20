import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export const apiRegister = (username, password) =>
  api.post('/user/register', { username, password }).then((r) => r.data);

export const apiLogin = (username, password) =>
  api.post('/user/login', { username, password }).then((r) => r.data);

export const apiLogout = () => api.post('/user/logout').then((r) => r.data);

export const apiIsLoggedIn = () => api.get('/user/isLoggedIn').then((r) => r.data);

export const apiListGames = () => api.get('/sudoku').then((r) => r.data);

export const apiGetGame = (id) => api.get(`/sudoku/${id}`).then((r) => r.data);

export const apiCreateGame = (difficulty) =>
  api.post('/sudoku', { difficulty }).then((r) => r.data);

export const apiCreateCustomGame = (puzzle) =>
  api.post('/sudoku/custom', { puzzle }).then((r) => r.data);

export const apiDeleteGame = (id) =>
  api.delete(`/sudoku/${id}`).then((r) => r.data);

export const apiRenameGame = (id, name) =>
  api.put(`/sudoku/${id}`, { name }).then((r) => r.data);

export const apiLeaderboard = () => api.get('/highscore').then((r) => r.data);

export const apiGameScores = (gameId) =>
  api.get(`/highscore/${gameId}`).then((r) => r.data);

export const apiRecordScore = (gameId, durationSeconds) =>
  api.post('/highscore', { gameId, durationSeconds }).then((r) => r.data);

export function errMessage(err) {
  return err?.response?.data?.error || err?.message || 'Request failed.';
}

export default api;
