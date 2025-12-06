import axios from "axios";
import type { Note, NoteTag } from "../types/note";


export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface FetchNotesProps {
  search?: string;
  tag?: string;
  page: number;
  perPage: number;
}

export interface NoteData {
  title: string;
  content: string;
  tag: NoteTag;
}


axios.defaults.baseURL = "https://notehub-public.goit.study/api";
axios.defaults.headers.common["Authorization"] = `Bearer ${
  process.env.NEXT_PUBLIC_NOTEHUB_TOKEN
}`;

export async function fetchNotes(options: FetchNotesProps): Promise<FetchNotesResponse> {

 const { page, perPage, tag, search } = options; 

 
 const finalTag = tag === "All" || tag === "" ? undefined : tag;

 const params = {
 page,
 perPage,
 ...(search && { search}), 
 ...(finalTag && {tag: finalTag}), };


 const res = await axios.get<FetchNotesResponse>("/notes", { params });
 return res.data;
}

export async function getSingleNote(id: string): Promise<Note> {
  const res = await axios.get<Note>(`/notes/${id}`);
  return res.data;
}

export async function createNote(data: NoteData): Promise<Note> {
  const res = await axios.post<Note>("/notes", data);
  return res.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const res = await axios.delete<Note>(`/notes/${id}`);
  return res.data;
}