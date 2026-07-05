import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createNote, type CreateNoteData } from '../../services/noteService';
import css from './NoteForm.module.css';


interface NoteFormProps {
    onSubmit?: (values: CreateNoteData) => void;
    onClose: () => void; // 
}

function NoteForm({ onClose }: NoteFormProps) {
    const queryClient = useQueryClient();


    const createMutation = useMutation({
        mutationFn: (newNote: CreateNoteData) => createNote(newNote),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
            onClose();
        },
    });

    const formik = useFormik<CreateNoteData>({
        initialValues: {
            title: '',
            content: '',
            tag: 'Todo',
        },
        validationSchema: Yup.object({
            title: Yup.string().required('Title is required'),
            content: Yup.string()
                .notRequired()
                .max(500, 'Maximum 500 characters'),
        }),
        onSubmit: (values) => {
            createMutation.mutate(values);
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className={css.form}>
            <div className={css.fieldGroup}>
                <label htmlFor="content" className={css.label}>Content</label>
                <textarea
                    id="content"
                    name="content"
                    className={css.textarea}
                    onChange={formik.handleChange}
                    value={formik.values.content}
                />
                {formik.touched.content && formik.errors.content ? (
                    <div className={css.error}>{formik.errors.content}</div>
                ) : null}
            </div>
            <div className={css.actions}>
                <button type="button" className={css.cancelBtn} onClick={onClose}>
                    Cancel
                </button>
                <button type="submit" className={css.submitBtn} disabled={createMutation.isPending}>
                    {createMutation.isPending ? 'Saving...' : 'Create note'}
                </button>
            </div>
        </form>
    );
}

export default NoteForm;