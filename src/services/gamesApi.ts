import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Game } from '../types/game'

/**
 * Пока каталог лежит статичным JSON в public/data.
 * Когда появится бэкенд, достаточно поменять baseUrl и пути в query.
 */
export const gamesApi = createApi({
  reducerPath: 'gamesApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.BASE_URL}data/` }),
  tagTypes: ['Game'],
  endpoints: (builder) => ({
    getGames: builder.query<Game[], void>({
      query: () => 'games.json',
      providesTags: ['Game'],
    }),
    getGameBySlug: builder.query<Game | null, string>({
      query: () => 'games.json',
      transformResponse: (games: Game[], _meta, slug) =>
        games.find((game) => game.slug === slug) ?? null,
      providesTags: (_result, _error, slug) => [{ type: 'Game', id: slug }],
    }),
  }),
})

export const { useGetGamesQuery, useGetGameBySlugQuery } = gamesApi
