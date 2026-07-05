import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '../../services/noteService';
import { type Note } from "../../types/note";
import css from './NoteList.module.css';

interface NoteListProps {
    notes: Note[];
}
function NoteList({ notes }: NoteListProps) {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteNote(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
        },
    });

    return (
        <ul className={css.list}>
            {notes.map((note) => (
                <li key={note.id} className={css.card}>
                    <h3>{note.title}</h3>
                    <p>{note.content}</p>
                    <span className={css.tag}>{note.tag}</span>

                    <button
                        type="button"
                        className={css.deleteBtn}
                        onClick={() => deleteMutation.mutate(note.id)}
                        disabled={deleteMutation.isPending}
                    >
                        {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                    </button>
                </li>
            ))}
        </ul>
    );
}

export default NoteList;