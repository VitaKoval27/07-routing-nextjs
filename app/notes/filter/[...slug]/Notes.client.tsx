"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import { Toaster } from "react-hot-toast";
import ErrorMessage from "@/app/notes/error";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import Loader from "@/app/loading";
import { fetchNotes } from "@/lib/api";
import css from "./Notes.module.css";

interface NotesClientProps {
    initialQuery: string;
    initialPage: number;
    tag?: string;
}

export default function NotesClient({
    initialQuery,
    initialPage,
    tag
}: NotesClientProps) {
    const [query, setQuery] = useState<string>(initialQuery);
    const [page, setPage] = useState<number>(initialPage);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const {
        data,
        isLoading,
        isError,
        error,
        refetch
    } = useQuery({
        queryKey: ["notes", query, page, tag],
        queryFn: () => fetchNotes({
            search: query,
            page,
            perPage: 12,
            tag: tag
        }),
        placeholderData: (previousData) => previousData,
        refetchOnMount: false,
    });

    const totalPages = data?.totalPages ?? 0;

    function openModal() {
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
    }

    const handleSearch = (newQuery: string) => {
        setQuery(newQuery);
        setPage(1);
    };

    const updateSearchWord = useDebouncedCallback(handleSearch, 500);

    const handlePageChange = (selectedPage: number) => {
        setPage(selectedPage + 1);
    };

    const handleReset = () => {
        refetch();
    };

    return (
        <div className={css.app}>
            <header className={css.toolbar}>
                <SearchBox onSearch={updateSearchWord} value={query} />
                {totalPages > 1 && (
                    <Pagination
                        pageCount={totalPages}
                        onPageChange={handlePageChange}
                        forcePage={page - 1}
                    />
                )}
                <button className={css.button} onClick={openModal}>
                    Create note +
                </button>
            </header>

            {isLoading && <Loader />}

            {isError && (
                <ErrorMessage
                    error={error as Error}
                    reset={handleReset}
                />
            )}

            {data && data.notes.length === 0 && !isLoading && !isError && (
                <p>No notes found. Try changing your search or filter.</p>
            )}

            {data && data.notes.length > 0 && <NoteList notes={data.notes} />}

            {isModalOpen && (
                <Modal onClose={closeModal}>
                    <NoteForm onClose={closeModal} />
                </Modal>
            )}

            <Toaster position="bottom-right" reverseOrder={false} />
        </div>
    );
}