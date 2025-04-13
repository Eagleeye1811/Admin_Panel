import { useState, useEffect } from 'react';
import { Container, Table, Button, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import CategoryModal from '../../components/categories/CategoryModal';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/categoryService';
import { Category } from '../../types/api.types';

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEdit = async (data: Partial<Category>) => {
    try {
      if (selectedCategory) {
        await updateCategory(selectedCategory._id, data);
      } else {
        await createCategory(data);
      }
      fetchCategories();
      setShowModal(false);
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
        fetchCategories();
      } catch (error) {
        console.error('Failed to delete category:', error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Categories</h1>
        <Button onClick={() => {
          setSelectedCategory(null);
          setShowModal(true);
        }}>
          Add New Category
        </Button>
      </div>

      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Subcategories</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category._id}>
              <td>{category.name}</td>
              <td>
                <div className="d-flex flex-wrap gap-1">
                  {category.subcategories.map((subcat, index) => (
                    <Badge key={index} bg="secondary" className="p-2">
                      {subcat}
                    </Badge>
                  ))}
                </div>
              </td>
              <td>
                <Badge bg={category.isActive ? 'success' : 'warning'}>
                  {category.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  className="me-2"
                  onClick={() => {
                    setSelectedCategory(category);
                    setShowModal(true);
                  }}
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(category._id)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <CategoryModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleAddEdit}
        category={selectedCategory}
      />
    </Container>
  );
};

export default CategoriesPage;