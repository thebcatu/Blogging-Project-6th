import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { fetchBlogById, updateBlog } from '../../redux/slices/blogSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EditBlog = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await dispatch(fetchBlogById(id)).unwrap();
        setInitialValues({
          title: response.title,
          content: response.content,
          tags: response.tags,
          category: response.category,
        });
      } catch (error) {
        console.error('Failed to fetch blog:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [dispatch, id]);

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    content: Yup.string().required('Content is required'),
    tags: Yup.string(),
    category: Yup.number().required('Category is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(updateBlog({ blogId: id, blogData: values })).unwrap();
      navigate(`/blogs/${id}`);
    } catch (error) {
      console.error('Failed to update blog:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Blog</h1>
      {initialValues && (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="bg-white shadow-md rounded-lg p-6">
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                  Title
                </label>
                <Field
                  type="text"
                  name="title"
                  id="title"
                  className="form-input"
                />
                <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="mb-4">
                <label htmlFor="content" className="block text-gray-700 font-medium mb-2">
                  Content
                </label>
                <Field
                  as="textarea"
                  name="content"
                  id="content"
                  rows="6"
                  className="form-input"
                />
                <ErrorMessage name="content" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="mb-4">
                <label htmlFor="tags" className="block text-gray-700 font-medium mb-2">
                  Tags (comma-separated)
                </label>
                <Field
                  type="text"
                  name="tags"
                  id="tags"
                  className="form-input"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
                  Category
                </label>
                <Field
                  as="select"
                  name="category"
                  id="category"
                  className="form-input"
                >
                  <option value="">Select a category</option>
                  {/* Add category options dynamically */}
                </Field>
                <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update Blog'}
              </button>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default EditBlog;
