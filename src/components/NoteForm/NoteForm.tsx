import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createNote, type CreateNoteData } from '../../services/noteService';
import css from './NoteForm.module.css';

interface NoteFormProps {
    onClose: () => void;
}


const TAG_OPTIONS = ['Todo', 'Work', 'Personal', 'Ideas'];

function NoteForm({ onClose }: NoteFormProps) {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (newNote: CreateNoteData) => createNote(newNote),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notes'] });
            onClose();
        },
    });

    const validationSchema = Yup.object({
        title: Yup.string()
            .trim()
            .required('Title is required'),
        tag: Yup.string()
            .oneOf(TAG_OPTIONS, 'Invalid tag selection')
            .required('Tag is required'),
        content: Yup.string()
            .max(500, 'Maximum 500 characters')
            .notRequired(),
    });

    const initialValues: CreateNoteData = {
        title: '',
        content: '',
        tag: 'Todo',
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => {
                createMutation.mutate(values);
            }}
        >
            <Form className={css.form}>

                <div className={css.fieldGroup}>
                    <label htmlFor="title" className={css.label}>Title</label>
                    <Field
                        id="title"
                        name="title"
                        type="text"
                        className={css.input}
                        placeholder="Enter note title..."
                    />

                    <ErrorMessage name="title" component="span" className={css.error} />
                </div>


                <div className={css.fieldGroup}>
                    <label htmlFor="tag" className={css.label}>Tag</label>
                    <Field id="tag" name="tag" as="select" className={css.select}>
                        {TAG_OPTIONS.map(option => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </Field>
                    <ErrorMessage name="tag" component="span" className={css.error} />
                </div>

                <div className={css.fieldGroup}>
                    <label htmlFor="content" className={css.label}>Content</label>
                    <Field
                        id="content"
                        name="content"
                        as="textarea"
                        className={css.textarea}
                        placeholder="Enter note content (optional)..."
                    />
                    <ErrorMessage name="content" component="span" className={css.error} />
                </div>

                <div className={css.actions}>
                    <button type="button" className={css.cancelBtn} onClick={onClose}>
                        Cancel
                    </button>
                    <button type="submit" className={css.submitBtn} disabled={createMutation.isPending}>
                        {createMutation.isPending ? 'Saving...' : 'Create note'}
                    </button>
                </div>
            </Form>
        </Formik>
    );
}

export default NoteForm;