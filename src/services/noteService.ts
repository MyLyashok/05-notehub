import axios from "axios";
import { type Note } from "../types/note";

const token = import.meta.env.VITE_NOTEHUB_TOKEN;

export const noteApi = axios.create({
    baseURL: 'https://notehub-public.goit.study/api',
    headers: {
        Authorization: `Bearer ${token}`,
    }
})

export interface FetchNotesResponse {
    notes: Note[];
    total: number;
    page: number;
    perPage: number;
    pages: number;

}

export const fetchNotes = async (page = 1, search = ''): Promise<FetchNotesResponse> => {
    const perPage = 12;

    const response = await noteApi.get<FetchNotesResponse>('/notes', {
        params: {
            page,
            perPage,
            search: search || undefined
        },
    });
    return response.data;
}

export interface CreateNoteData {
    title: string;
    content: string;
    tag: string;
}

export const createNote = async (noteData: CreateNoteData): Promise<Note> => {
    const response = await noteApi.post<Note>('/notes', noteData);
    return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
    const response = await noteApi.delete<Note>(`/notes/${id}`);
    return response.data;
};