import { useState, useEffect } from 'react';
import { Modal, Form, Button, Badge } from 'react-bootstrap';
import { Category } from '../../types/api.types';

interface CategoryModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (data: Partial<Category>) => Promise<void>;
  category?: Category | null;
}

const CategoryModal = ({ show, onHide, onSubmit, category }: CategoryModalProps) => {
  const [name, setName] = useState('');
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [newSubcategory, setNewSubcategory] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      setName(category?.name || '');
      setSubcategories(category?.subcategories || []);
      setIsActive(category?.isActive ?? true);
      setNewSubcategory('');
    }
  }, [show, category]);

  const handleAddSubcategory = () => {
    const trimmed = newSubcategory.trim();
    if (trimmed && !subcategories.includes(trimmed)) {
      setSubcategories([...subcategories, trimmed]);
      setNewSubcategory('');
    }
  };


  const handleRemoveSubcategory = (index: number) => {
    setSubcategories((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      alert('Category name is required');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        name: trimmedName,
        subcategories,
        isActive,
      });
      onHide();
    } catch (error) {
      console.error('Failed to submit category:', error);
      alert('Failed to save category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{category ? 'Edit Category' : 'Add New Category'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter category name"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Subcategories</Form.Label>
            <div className="d-flex gap-2 mb-2">
              <Form.Control
                type="text"
                value={newSubcategory}
                onChange={(e) => setNewSubcategory(e.target.value)}
                placeholder="Add subcategory"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubcategory();
                  }
                }}
              />
              <Button variant="outline-primary" onClick={handleAddSubcategory} type="button">
                Add
              </Button>
            </div>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {subcategories.map((subcat, index) => (
                <Badge key={index} bg="secondary" className="p-2 d-flex align-items-center gap-2">
                  {subcat}
                  <button
                    type="button"
                    className="btn btn-link text-white p-0 ms-2"
                    onClick={() => handleRemoveSubcategory(index)}
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CategoryModal;
