'use client'
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getSingleNote } from "@/lib/api";
import Modal from "@/components/Modal/Modal";
import css from "./NotePreview.module.css"

export default function NotePreviewClient() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const {
        data: note,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["note", id],
        queryFn: () => getSingleNote(id),
        refetchOnMount: false,
    });

    if (isLoading) return <p>Loading, please wait...</p>;

    if (error || !note) return <p>Something went wrong</p>;

    const handleBack = () => {
        router.back()
    }

    return (
        <Modal onClose={handleBack}>
            <button className={css.backBtn} onClick={handleBack}>
                Back
            </button>
            <div className={css.container}>
                <div className={css.item}>
                    <div className={css.header}>
                        <h2>{note.title}</h2>
                    </div>
                    <p className={css.content}>{note.content}</p>
                    <p className={css.date}>{note.createdAt}</p>
                </div>
            </div>
        </Modal>
    )
}
